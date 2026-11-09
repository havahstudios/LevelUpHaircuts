import "server-only";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  customerBookedEmail,
  customerCancelledEmail,
  customerDeclinedEmail,
  customerRequestEmail,
  salonCancelledEmail,
  salonRequestEmail,
} from "@/lib/booking/email-templates";
import { site } from "@/lib/site";

// Booking emails. They never block a booking: if sending is not set up or a
// send fails, the booking is still saved and the problem is logged.
//
// How mail is sent, first match wins:
//   1. Gmail: GMAIL_USER + GMAIL_APP_PASSWORD (a Google "app password")
//   2. Resend: RESEND_API_KEY (customers only once BOOKING_FROM_EMAIL uses a verified domain)
//   3. Neither: emails are written to the server log instead
//
// Test mode: EMAIL_REDIRECT_TO sends every email (salon and customer) to that
// one address, with the real recipient shown in the subject.

export type EmailBooking = {
  startsAt: string;
  stylistName: string;
  serviceName: string;
  manageCode: string;
  respondCode?: string;
  stillFree?: boolean;
  client: { name: string; phone: string; email: string };
};

export type EmailKind =
  | "request" // online booking waiting for the salon
  | "accepted" // salon accepted an online booking
  | "declined" // salon declined it
  | "staff_booked" // staff added a phone or walk-in booking
  | "cancelled"; // customer cancelled from their link

const base = () => process.env.NEXT_PUBLIC_SITE_URL || site.siteUrl;

async function salonAddress(): Promise<string | null> {
  const { data } = await getSupabaseAdmin().from("settings").select("notify_email").eq("id", 1).single();
  return data?.notify_email || process.env.SALON_NOTIFY_EMAIL || null;
}

export async function sendBookingEmails(kind: EmailKind, b: EmailBooking) {
  const key = process.env.RESEND_API_KEY;
  const manageUrl = `${base()}/book/manage/${b.manageCode}`;
  const respondUrl = b.respondCode ? `${base()}/booking/respond/${b.respondCode}` : "";

  type Msg = { to: string; subject: string; html: string; text: string };
  const messages: Msg[] = [];
  const salon = kind === "request" || kind === "cancelled" ? await salonAddress() : null;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const useGmail = Boolean(gmailUser && gmailPass);
  const redirect = process.env.EMAIL_REDIRECT_TO || "";
  const from = useGmail
    ? `${site.name} <${gmailUser}>`
    : process.env.BOOKING_FROM_EMAIL || "Level-Up Hair Salon <onboarding@resend.dev>";
  const canEmailCustomers = Boolean(b.client.email) && (useGmail || Boolean(redirect) || !from.includes("resend.dev"));

  if (salon && kind === "request") messages.push({ to: salon, ...salonRequestEmail(b, respondUrl) });
  if (salon && kind === "cancelled") messages.push({ to: salon, ...salonCancelledEmail(b, `${base()}/admin`) });

  if (canEmailCustomers) {
    const to = b.client.email;
    if (kind === "request") messages.push({ to, ...customerRequestEmail(b, manageUrl) });
    if (kind === "accepted" || kind === "staff_booked") messages.push({ to, ...customerBookedEmail(b, manageUrl) });
    if (kind === "declined") messages.push({ to, ...customerDeclinedEmail(b, `${base()}/book`) });
    if (kind === "cancelled") messages.push({ to, ...customerCancelledEmail(b, `${base()}/book`) });
  }

  // Test mode: everything goes to one inbox, labelled with who it was for.
  const outgoing = redirect
    ? messages.map((m) => ({ ...m, to: redirect, subject: m.to === salon ? m.subject : `[Customer copy] ${m.subject}` }))
    : messages;

  if (!useGmail && !key) {
    for (const m of outgoing) console.log(`[email] not sent (no email service set up) ${kind} -> ${m.to}: ${m.subject}`);
    if (kind === "request" && respondUrl) console.log(`[email] accept/decline link: ${respondUrl}`);
    return;
  }

  const gmail = useGmail
    ? nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user: gmailUser, pass: gmailPass } })
    : null;
  const resend = !useGmail && key ? new Resend(key) : null;

  for (const m of outgoing) {
    try {
      if (gmail) {
        await gmail.sendMail({ from, ...m });
      } else if (resend) {
        const { error } = await resend.emails.send({ from, ...m });
        if (error) throw new Error(error.message);
      }
      console.log(`[email] sent ${kind} -> ${m.to}`);
    } catch (error) {
      console.error(`[email] ${kind} to ${m.to} failed:`, error instanceof Error ? error.message : error);
    }
  }
}
