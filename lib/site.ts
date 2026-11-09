// The salon's facts in one place. Anything not yet confirmed says "to confirm",
// and the SEO check scripts refuse to publish while that text is on a page.

export const site = {
  name: "Level-Up Hair Salon",
  shortName: "Level-Up",
  // Keep false until launch: tells Google not to index the preview site.
  // Flip to true only when the real domain is live and "to confirm" text is gone.
  indexable: false,
  // Decided at launch. Used for canonical links, the sitemap and Google data.
  siteUrl: "https://www.leveluphairsalon.com",
  description:
    "Level-Up is a family-owned unisex hair salon on Pico Blvd in Rancho Park, Los Angeles. Haircuts, colour, blow-drys, styling and perms for women, men and kids.",
  phone: "to confirm",
  address: {
    street: "10962 W Pico Blvd",
    city: "Los Angeles",
    region: "CA",
    postalCode: "90064",
    neighborhood: "Rancho Park",
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=10962+W+Pico+Blvd+Los+Angeles+CA+90064",
  mapsEmbedUrl: "https://maps.google.com/maps?q=10962%20W%20Pico%20Blvd%2C%20Los%20Angeles%2C%20CA%2090064&z=15&output=embed",
  hours: [
    { days: "Mon to Wed", time: "9am to 6pm", schema: ["Monday", "Tuesday", "Wednesday"], opens: "09:00", closes: "18:00" },
    { days: "Thu and Fri", time: "9am to 7pm", schema: ["Thursday", "Friday"], opens: "09:00", closes: "19:00" },
    { days: "Saturday", time: "9am to 6pm", schema: ["Saturday"], opens: "09:00", closes: "18:00" },
    { days: "Sunday", time: "Closed", schema: [], opens: "", closes: "" },
  ],
  social: {
    instagram: "https://www.instagram.com/level_uphairsalon/",
    facebook: "https://www.facebook.com/p/LEVEL-UP-HAIR-SALON-Unisex-61573299486993/",
    yelp: "https://www.yelp.com/biz/level-up-hair-salon-los-angeles",
  },
};

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;
