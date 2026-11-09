import "server-only";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { formatWhen } from "@/lib/booking/time";
import { fullAddress, site } from "@/lib/site";

// Booking emails. They never block a booking: if Resend is not set up or a
// send fails, the booking is still saved and the problem is logged.
//
// BOOKING_FROM_EMAIL must use a domain verified in Resend before customers can
// be emailed. Until then (Resend's test sender) only the salon is emailed, and
// Resend only delivers to the address the Resend account was created with.

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
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

async function salonAddress(): Promise<string | null> {
  const { data } = await getSupabaseAdmin().from("settings").select("notify_email").eq("id", 1).single();
  return data?.notify_email || process.env.SALON_NOTIFY_EMAIL || null;
}

/** Simple branded layout that works in every email program (tables, inline styles). */
function layout(title: string, rows: [string, string][], body: string, buttons: { label: string; href: string; primary?: boolean }[] = []) {
  const rowHtml = rows
    .map(([k, v]) => `<tr><td style="padding:6px 0;color:#66625a;font-size:14px">${esc(k)}</td><td style="padding:6px 0;text-align:right;color:#141210;font-size:14px;font-weight:bold">${v}</td></tr>`)
    .join("");
  const buttonHtml = buttons
    .map(
      (b) =>
        `<a href="${b.href}" style="display:inline-block;margin:0 6px 10px 0;padding:14px 26px;border-radius:4px;font-size:15px;font-weight:bold;text-decoration:none;${
          b.primary ? "background:#c9a24a;color:#141210" : "background:#ffffff;color:#141210;border:1px solid #141210"
        }">${esc(b.label)}</a>`,
    )
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#f5efe3;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5efe3;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e4dccd;border-radius:8px;padding:32px">
<tr><td style="font-size:12px;letter-spacing:3px;font-weight:bold;color:#9a7428">LEVEL-UP HAIR SALON</td></tr>
<tr><td style="padding-top:12px;font-size:26px;color:#141210;font-weight:bold">${esc(title)}</td></tr>
<tr><td style="padding-top:14px;font-size:15px;line-height:1.6;color:#3d3a35">${body}</td></tr>
<tr><td style="padding-top:18px"><table role="presentation" width="100%" style="border-top:1px solid #e4dccd;border-bottom:1px solid #e4dccd;padding:8px 0">${rowHtml}</table></td></tr>
${buttonHtml ? `<tr><td style="padding-top:24px">${buttonHtml}</td></tr>` : ""}
<tr><td style="padding-top:20px;font-size:12px;color:#8a857c">${esc(fullAddress)}</td></tr>
</table></td></tr></table></body></html>`;
}

function details(b: EmailBooking): [string, string][] {
  return [
    ["Service", esc(b.serviceName)],
    ["Stylist", esc(b.stylistName)],
    ["When", esc(formatWhen(b.startsAt))],
  ];
}

export async function sendBookingEmails(kind: EmailKind, b: EmailBooking) {
  const key = process.env.RESEND_API_KEY;
  const when = formatWhen(b.startsAt);
  const manageUrl = `${base()}/book/manage/${b.manageCode}`;
  const respondUrl = b.respondCode ? `${base()}/booking/respond/${b.respondCode}` : "";

  type Msg = { to: string; subject: string; html: string; text: string };
  const messages: Msg[] = [];
  const salon = kind === "request" || kind === "cancelled" ? await salonAddress() : null;
  const from = process.env.BOOKING_FROM_EMAIL || "Level-Up Hair Salon <onboarding@resend.dev>";
  const canEmailCustomers = !from.includes("resend.dev") && Boolean(b.client.email);

  if (kind === "request" && salon) {
    const status = "Waiting for you";
    const availability = b.stillFree === false ? "This time now clashes with another booking" : `${b.stylistName} is free at this time`;
    messages.push({
      to: salon,
      subject: `Accept or decline: ${b.client.name}, ${when}`,
      text: `New booking request\n\nClient: ${b.client.name}\nPhone: ${b.client.phone}\nEmail: ${b.client.email}\nService: ${b.serviceName}\nStylist: ${b.stylistName}\nWhen: ${when}\nStatus: ${status}\nAvailability: ${availability}\n\nAccept or decline: ${respondUrl}`,
      html: layout(
        "New booking request",
        [
          ["Client", esc(b.client.name)],
          ["Phone", esc(b.client.phone)],
          ["Email", esc(b.client.email || "none")],
          ...details(b),
          ["Status", `<span style="color:#9a7428">${status}</span>`],
          ["Availability", `<span style="color:${b.stillFree === false ? "#a3341f" : "#3e6b4c"}">${esc(availability)}</span>`],
        ],
        `${esc(b.client.name)} would like to book. The time is held for them until you answer.`,
        [
          { label: "Accept", href: `${respondUrl}?action=accept`, primary: true },
          { label: "Decline", href: `${respondUrl}?action=decline` },
        ],
      ),
    });
  }

  if (kind === "cancelled" && salon) {
    messages.push({
      to: salon,
      subject: `Cancelled: ${b.client.name}, ${when}`,
      text: `${b.client.name} cancelled ${b.serviceName} with ${b.stylistName} on ${when}.`,
      html: layout("A booking was cancelled", details(b), `${esc(b.client.name)} cancelled their booking. The time is free again.`, [
        { label: "Open the schedule", href: `${base()}/admin` },
      ]),
    });
  }

  if (canEmailCustomers) {
    const to = b.client.email;
    const hi = `Hi ${esc(b.client.name)},`;
    if (kind === "request") {
      messages.push({
        to,
        subject: `Request received: ${b.serviceName}, ${when}`,
        text: `${b.client.name}, we got your request for ${b.serviceName} with ${b.stylistName} on ${when}. We'll email you as soon as the salon confirms.\n\nView your booking: ${manageUrl}`,
        html: layout("We got your request", details(b), `${hi}<br>The salon will confirm shortly. We'll email you as soon as they do.`, [{ label: "View your booking", href: manageUrl }]),
      });
    }
    if (kind === "accepted" || kind === "staff_booked") {
      messages.push({
        to,
        subject: `You're booked: ${b.serviceName}, ${when}`,
        text: `${b.client.name}, you're booked for ${b.serviceName} with ${b.stylistName} on ${when} at ${fullAddress}.\n\nNeed to cancel? ${manageUrl}`,
        html: layout("You're booked", details(b), `${hi}<br>See you soon at ${esc(fullAddress)}.`, [{ label: "View or cancel", href: manageUrl }]),
      });
    }
    if (kind === "declined") {
      messages.push({
        to,
        subject: `We couldn't fit you in on ${when}`,
        text: `${b.client.name}, sorry, the salon couldn't fit you in for ${b.serviceName} on ${when}. Please pick another time: ${base()}/book`,
        html: layout("Please pick another time", details(b), `${hi}<br>Sorry, we couldn't fit you in at this time. Please choose another one.`, [
          { label: "Book another time", href: `${base()}/book`, primary: true },
        ]),
      });
    }
    if (kind === "cancelled") {
      messages.push({
        to,
        subject: `Cancelled: ${b.serviceName}, ${when}`,
        text: `${b.client.name}, your ${b.serviceName} on ${when} is cancelled. Book again any time: ${base()}/book`,
        html: layout("Your booking is cancelled", details(b), `${hi}<br>Your appointment has been cancelled.`, [{ label: "Book again", href: `${base()}/book` }]),
      });
    }
  }

  if (!key) {
    for (const m of messages) console.log(`[email] not sent (no RESEND_API_KEY) ${kind} -> ${m.to}: ${m.subject}`);
    if (kind === "request" && respondUrl) console.log(`[email] accept/decline link: ${respondUrl}`);
    return;
  }

  const resend = new Resend(key);
  for (const m of messages) {
    try {
      const { error } = await resend.emails.send({ from, ...m });
      if (error) console.error(`[email] ${kind} to ${m.to} failed:`, error.message);
      else console.log(`[email] sent ${kind} -> ${m.to}`);
    } catch (error) {
      console.error(`[email] ${kind} to ${m.to} failed`, error);
    }
  }
}
