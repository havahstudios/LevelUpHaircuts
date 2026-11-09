// What each booking email looks like. Pure functions (no sending), so they can
// be previewed. Built with tables and inline styles so they render the same in
// Gmail, Apple Mail and Outlook.

import { formatShortWhen, formatWhen } from "@/lib/booking/time";
import { fullAddress, site } from "@/lib/site";

export type TemplateBooking = {
  startsAt: string;
  stylistName: string;
  serviceName: string;
  client: { name: string; phone: string; email: string };
  stillFree?: boolean;
};

export type Email = { subject: string; html: string; text: string };

const C = {
  ink: "#141210",
  muted: "#6b665d",
  gold: "#c9a24a",
  goldDeep: "#9a7428",
  cream: "#f5efe3",
  paper: "#fbf8f2",
  line: "#e9e1d2",
  green: "#3e6b4c",
  red: "#a3341f",
};
const serif = "Georgia, 'Times New Roman', serif";
const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

// Gmail and Apple Mail turn addresses and emails into blue links on their own.
// Wrapping them in our own styled links keeps the design's colours.
const addressLink = (color: string) =>
  `<a href="${site.mapsUrl}" target="_blank" style="color:${color};text-decoration:none">${esc(fullAddress)}</a>`;
const mailLink = (email: string) => `<a href="mailto:${esc(email)}" style="color:${C.ink};text-decoration:none">${esc(email)}</a>`;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

type Button = { label: string; href: string; style: "primary" | "secondary" };
type Row = { label: string; value: string; color?: string };

// Full-width buttons, one per row, so they never squash on a phone.
function button(b: Button) {
  const primary = b.style === "primary";
  return `<tr><td style="padding:0 0 10px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td align="center" bgcolor="${primary ? C.gold : "#ffffff"}" style="border-radius:999px;${primary ? "" : `border:1.5px solid ${C.ink};`}">
      <a href="${b.href}" target="_blank" style="display:block;padding:15px 20px;font-family:${sans};font-size:15px;font-weight:700;color:${C.ink};text-decoration:none;border-radius:999px;letter-spacing:0.02em;text-align:center">${esc(b.label)}</a>
    </td>
  </tr></table>
</td></tr>`;
}

function shell(opts: { preheader: string; tag: string; tagColor?: string; title: string; intro: string; rows: Row[]; buttons?: Button[]; note?: string }) {
  const rows = opts.rows
    .map(
      (r, i) => `<tr>
  <td style="padding:13px 0;${i ? `border-top:1px solid ${C.line};` : ""}font-family:${sans};font-size:13px;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em">${esc(r.label)}</td>
  <td align="right" style="padding:13px 0;${i ? `border-top:1px solid ${C.line};` : ""}font-family:${sans};font-size:15px;font-weight:700;color:${r.color ?? C.ink}">${r.value}</td>
</tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="format-detection" content="telephone=no,date=no,address=no,email=no"><style>a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}</style><title>${esc(opts.title)}</title></head>
<body style="margin:0;padding:0;background:${C.cream};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.cream}">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.cream}" style="background:${C.cream}">
<tr><td align="center" style="padding:36px 14px 44px">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
    <tr><td align="center" style="padding-bottom:22px">
      <div style="font-family:${serif};font-size:28px;font-weight:700;letter-spacing:0.04em;color:${C.ink}">LEVEL<span style="color:${C.gold}">-</span>UP</div>
      <div style="font-family:${sans};font-size:10px;font-weight:700;letter-spacing:0.42em;color:${C.goldDeep};padding-top:6px">HAIR SALON</div>
    </td></tr>

    <tr><td bgcolor="#ffffff" style="background:#ffffff;border:1px solid ${C.line};border-radius:16px;padding:34px 26px 26px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="background:${opts.tagColor ?? "#fbf3df"};border-radius:999px;padding:6px 14px;font-family:${sans};font-size:11px;font-weight:700;letter-spacing:0.14em;color:${C.goldDeep};text-transform:uppercase">${esc(opts.tag)}</td>
      </tr></table>
      <h1 style="margin:18px 0 0;font-family:${serif};font-size:30px;line-height:1.2;font-weight:700;color:${C.ink}">${esc(opts.title)}</h1>
      <p style="margin:12px 0 0;font-family:${sans};font-size:16px;line-height:1.6;color:${C.muted}">${opts.intro}</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:26px;background:${C.paper};border-radius:12px">
        <tr><td style="padding:4px 18px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
        </td></tr>
      </table>

      ${
        opts.buttons?.length
          ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px">${opts.buttons.map(button).join("")}</table>`
          : ""
      }
      ${opts.note ? `<p style="margin:${opts.buttons?.length ? "8px" : "24px"} 0 0;font-family:${sans};font-size:13px;line-height:1.6;color:${C.muted}">${opts.note}</p>` : ""}
    </td></tr>

    <tr><td align="center" style="padding:24px 10px 0;font-family:${sans};font-size:12px;line-height:1.7;color:${C.muted}">
      ${esc(site.name)} · ${addressLink(C.muted)}<br>
      <a href="${site.social.instagram}" style="color:${C.goldDeep};text-decoration:none">Instagram</a> &nbsp;·&nbsp;
      <a href="${site.social.yelp}" style="color:${C.goldDeep};text-decoration:none">Yelp</a>
    </td></tr>
  </table>

</td></tr></table>
</body></html>`;
}

const details = (b: TemplateBooking): Row[] => [
  { label: "Service", value: esc(b.serviceName) },
  { label: "Stylist", value: esc(b.stylistName) },
  { label: "When", value: esc(formatWhen(b.startsAt)) },
];

/** To the salon: a new online request, with Accept / Decline. */
export function salonRequestEmail(b: TemplateBooking, respondUrl: string): Email {
  const when = formatWhen(b.startsAt);
  const free = b.stillFree !== false;
  const availability = free ? `${b.stylistName} is free` : "Clashes with blocked time";
  return {
    subject: `New booking request · ${b.client.name} · ${formatShortWhen(b.startsAt)}`,
    text: `New booking request\n\n${b.client.name}\n${b.client.phone}\n${b.client.email}\n\n${b.serviceName} with ${b.stylistName}\n${when}\nStatus: Waiting for you\nAvailability: ${availability}\n\nAccept or decline: ${respondUrl}`,
    html: shell({
      preheader: `${b.client.name} wants ${b.serviceName} on ${when}. Tap to accept or decline.`,
      tag: "New request",
      title: `${b.client.name} would like to book`,
      intro: "The time is held for them until you answer.",
      rows: [
        { label: "Client", value: esc(b.client.name) },
        { label: "Phone", value: `<a href="tel:${esc(b.client.phone)}" style="color:${C.ink};text-decoration:none">${esc(b.client.phone)}</a>` },
        { label: "Email", value: b.client.email ? mailLink(b.client.email) : "none" },
        ...details(b),
        { label: "Status", value: "Waiting for you", color: C.goldDeep },
        { label: "Availability", value: `<span style="color:${free ? C.green : C.red}">&#9679;</span> ${esc(availability)}`, color: free ? C.green : C.red },
      ],
      buttons: [
        { label: "Accept", href: `${respondUrl}?action=accept`, style: "primary" },
        { label: "Decline", href: `${respondUrl}?action=decline`, style: "secondary" },
      ],
      note: "You'll confirm your choice on the next screen.",
    }),
  };
}

/** To the salon: a customer cancelled. */
export function salonCancelledEmail(b: TemplateBooking, scheduleUrl: string): Email {
  const when = formatWhen(b.startsAt);
  return {
    subject: `Booking cancelled · ${b.client.name} · ${formatShortWhen(b.startsAt)}`,
    text: `${b.client.name} cancelled ${b.serviceName} with ${b.stylistName} on ${when}. The time is free again.`,
    html: shell({
      preheader: `${b.client.name} cancelled. The time is free again.`,
      tag: "Cancelled",
      tagColor: "#f6e6e2",
      title: `${b.client.name} cancelled`,
      intro: "The time is free again for someone else to book.",
      rows: details(b),
      buttons: [{ label: "Open the schedule", href: scheduleUrl, style: "secondary" }],
    }),
  };
}

/** To the customer: request received, waiting for the salon. */
export function customerRequestEmail(b: TemplateBooking, manageUrl: string): Email {
  const when = formatWhen(b.startsAt);
  return {
    subject: `Your booking request is in · Level-Up Hair Salon`,
    text: `Hi ${b.client.name}, we got your request for ${b.serviceName} with ${b.stylistName} on ${when}. We'll email you as soon as the salon confirms.\n\nView your booking: ${manageUrl}`,
    html: shell({
      preheader: "Your time is held while the salon confirms.",
      tag: "Request received",
      title: `Thanks, ${b.client.name}`,
      intro: "Your time is held while the salon confirms. We'll email you as soon as they do.",
      rows: details(b),
      buttons: [{ label: "View your booking", href: manageUrl, style: "secondary" }],
    }),
  };
}

/** To the customer: confirmed (salon accepted, or staff booked it). */
export function customerBookedEmail(b: TemplateBooking, manageUrl: string): Email {
  const when = formatWhen(b.startsAt);
  return {
    subject: `You're booked at Level-Up · ${formatShortWhen(b.startsAt)}`,
    text: `Hi ${b.client.name}, you're booked for ${b.serviceName} with ${b.stylistName} on ${when} at ${fullAddress}.\n\nNeed to cancel? ${manageUrl}`,
    html: shell({
      preheader: `See you ${when}.`,
      tag: "Confirmed",
      tagColor: "#e6f0e8",
      title: "You're booked",
      intro: `See you soon, ${esc(b.client.name)}. We're at ${addressLink(C.ink)}.`,
      rows: details(b),
      buttons: [
        { label: "Get directions", href: site.mapsUrl, style: "primary" },
        { label: "View or cancel", href: manageUrl, style: "secondary" },
      ],
    }),
  };
}

/** To the customer: the salon declined. */
export function customerDeclinedEmail(b: TemplateBooking, bookUrl: string): Email {
  const when = formatWhen(b.startsAt);
  return {
    subject: `That time isn't available · Level-Up Hair Salon`,
    text: `Hi ${b.client.name}, sorry, the salon couldn't fit you in for ${b.serviceName} on ${when}. Please pick another time: ${bookUrl}`,
    html: shell({
      preheader: "Sorry, that time didn't work. Please choose another.",
      tag: "Not available",
      tagColor: "#f6e6e2",
      title: "Please pick another time",
      intro: `Sorry, ${esc(b.client.name)}, we couldn't fit you in at this time. Choose another one and we'll get back to you quickly.`,
      rows: details(b),
      buttons: [{ label: "Book another time", href: bookUrl, style: "primary" }],
    }),
  };
}

/** To the customer: their booking was cancelled. */
export function customerCancelledEmail(b: TemplateBooking, bookUrl: string): Email {
  const when = formatWhen(b.startsAt);
  return {
    subject: `Your appointment is cancelled · Level-Up Hair Salon`,
    text: `Hi ${b.client.name}, your ${b.serviceName} on ${when} is cancelled. Book again any time: ${bookUrl}`,
    html: shell({
      preheader: "Your appointment has been cancelled.",
      tag: "Cancelled",
      tagColor: "#f6e6e2",
      title: "Your booking is cancelled",
      intro: `No problem, ${esc(b.client.name)}. Book again whenever you're ready.`,
      rows: details(b),
      buttons: [{ label: "Book again", href: bookUrl, style: "primary" }],
    }),
  };
}
