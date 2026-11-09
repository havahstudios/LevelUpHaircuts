import "server-only";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { formatWhen } from "@/lib/booking/time";
import { fullAddress, site } from "@/lib/site";

type EmailBooking = {
  bookingId: string;
  manageCode: string;
  startsAt: string;
  stylistName: string;
  serviceName: string;
  client: { name: string; phone: string; email: string };
  source: string;
};

// Emails never block a booking: if Resend is not set up or a send fails,
// the booking is still saved and the problem is logged.
//
// BOOKING_FROM_EMAIL must use a domain verified in Resend before customers can
// be emailed. Until then (Resend's test sender), only the salon is notified.

function siteBase() {
  return process.env.NEXT_PUBLIC_SITE_URL || site.siteUrl;
}

async function notifyAddress(): Promise<string | null> {
  const { data } = await getSupabaseAdmin().from("settings").select("notify_email").eq("id", 1).single();
  return data?.notify_email || process.env.SALON_NOTIFY_EMAIL || null;
}

export async function sendBookingEmails(kind: "new" | "cancelled", b: EmailBooking) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email] skipped (${kind}): RESEND_API_KEY not set`);
    return;
  }
  const resend = new Resend(key);
  const from = process.env.BOOKING_FROM_EMAIL || "Level-Up Hair Salon <onboarding@resend.dev>";
  const canEmailCustomers = !from.includes("resend.dev");
  const when = formatWhen(b.startsAt);
  const manageUrl = `${siteBase()}/book/manage/${b.manageCode}`;

  try {
    // The salon hears about online bookings and cancellations, not ones its own staff typed in.
    const salon = b.source === "online" ? await notifyAddress() : null;
    if (salon) {
      await resend.emails.send({
        from,
        to: salon,
        subject: kind === "new" ? `New booking: ${b.client.name}, ${when}` : `Cancelled: ${b.client.name}, ${when}`,
        text: [
          kind === "new" ? "New booking" : "A client cancelled their booking",
          "",
          `Client: ${b.client.name}`,
          `Phone: ${b.client.phone}`,
          `Email: ${b.client.email || "none"}`,
          `Service: ${b.serviceName}`,
          `Stylist: ${b.stylistName}`,
          `When: ${when}`,
          `Booked: ${b.source === "online" ? "online" : b.source === "phone" ? "by phone" : "walk-in"}`,
          "",
          `Open the schedule: ${siteBase()}/admin`,
        ].join("\n"),
      });
    }

    if (canEmailCustomers && b.client.email) {
      await resend.emails.send({
        from,
        to: b.client.email,
        subject: kind === "new" ? `You're booked: ${b.serviceName}, ${when}` : `Your appointment on ${when} is cancelled`,
        text:
          kind === "new"
            ? [
                `Hi ${b.client.name},`,
                "",
                `You're booked at ${site.name}.`,
                "",
                `${b.serviceName} with ${b.stylistName}`,
                when,
                fullAddress,
                "",
                `Need to cancel? ${manageUrl}`,
                "",
                "See you soon!",
              ].join("\n")
            : [`Hi ${b.client.name},`, "", `Your ${b.serviceName} on ${when} has been cancelled.`, "", `Book again any time: ${siteBase()}/book`].join("\n"),
      });
    }
  } catch (error) {
    console.error(`[email] ${kind} email failed`, error);
  }
}
