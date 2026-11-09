// Words and numbers shown on the homepage. Services come from the salon's
// Yelp listing (verified by the business). Prices are not known yet.

export type ServiceIcon = "scissors" | "color" | "dryer" | "curl";

export const services: { title: string; text: string; icon: ServiceIcon; image: string }[] = [
  { title: "Haircuts", text: "Cuts for women, men and kids, shaped to suit you.", icon: "scissors", image: "/images/ai/service-haircut.webp" },
  { title: "Colour", text: "Cut and colour, from a refresh to something new.", icon: "color", image: "/images/ai/service-color.webp" },
  { title: "Blowouts & styling", text: "Blow-drys and styling for every day or a big night.", icon: "dryer", image: "/images/ai/service-styling.webp" },
  { title: "Perms & treatments", text: "Perms and chemical treatments, done with care.", icon: "curl", image: "/images/ai/service-treatment.webp" },
];

export const priceGroups = [
  {
    label: "Cut & colour",
    items: [
      { name: "Haircut", note: "Women, men and kids", price: "to confirm" },
      { name: "Cut and colour", note: "Colour with a finished cut", price: "to confirm" },
      { name: "Hair styling", note: "Styled for the day or an event", price: "to confirm" },
    ],
  },
  {
    label: "Style & treatment",
    items: [
      { name: "Blow-dry", note: "Smooth, full and long-lasting", price: "to confirm" },
      { name: "Perm", note: "Soft waves to defined curls", price: "to confirm" },
      { name: "Chemical treatment", note: "Ask us what suits your hair", price: "to confirm" },
    ],
  },
];

// Real reviews from the salon's Yelp page, quoted word for word (some trimmed,
// marked with an ellipsis). Read Sunday 8 November 2026.
export const reviews = [
  { name: "Dalia D.", date: "May 2026", text: "I got my haircut by Norma, and it was hands down one of the best haircuts I've ever gotten! She was so attentive and knew exactly how to achieve the look I wanted." },
  { name: "Ally S.", date: "May 2026", text: "Love this place. I've been coming for two years now. Norma always does an amazing job. Fast service and great quality!!!" },
  { name: "Alejandra J.", date: "December 2025", text: "Isabella is amazing, love my hair! Tone and blowout was excellent, such a great experience overall, will definitely be coming back to her." },
  { name: "Johann S.", date: "October 2024", text: "Haircut was good! Great pricing. Nice ambience. I asked for a fade and trim on the top. Blend was smooth, and my barber paid great attention to detail." },
  { name: "Daniel S.", date: "December 2024", text: "Norma it's the best. She always does a great job cutting my hair. The salon is very relaxing great vibes." },
  { name: "Vanessa C.", date: "August 2024", text: "Sara has great skill and friendly. Her fee is very reasonable. Anyone needs a haircut should try her." },
  { name: "Peachee K.", date: "July 2024", text: "What I like best of all is she gets it--you tell her what you like and she will deliver. She will ask questions to make sure she's on the same page as you." },
];

export type GalleryCategory = "Cuts" | "Colour" | "Styling" | "Salon";

export const gallery: { src: string; alt: string; category: GalleryCategory; tall?: boolean }[] = [
  { src: "/images/ai/gallery-balayage.webp", alt: "Long hair with a warm honey balayage and loose waves", category: "Colour", tall: true },
  { src: "/images/ai/service-haircut.webp", alt: "Stylist giving a woman a precise shoulder-length cut", category: "Cuts" },
  { src: "/images/ai/gallery-fade.webp", alt: "Clean skin fade being finished with clippers", category: "Cuts", tall: true },
  { src: "/images/ai/salon-interior.webp", alt: "Salon floor with black chairs and brass mirrors", category: "Salon" },
  { src: "/images/ai/gallery-curls.webp", alt: "Voluminous natural curls, freshly styled", category: "Styling", tall: true },
  { src: "/images/ai/service-color.webp", alt: "Colourist painting colour onto foiled sections", category: "Colour" },
  { src: "/images/ai/gallery-kids.webp", alt: "Smiling girl getting her hair trimmed", category: "Cuts", tall: true },
  { src: "/images/ai/service-styling.webp", alt: "Blowout with a round brush for volume", category: "Styling" },
  { src: "/images/ai/gallery-bob.webp", alt: "Sleek chin-length bob in profile", category: "Cuts", tall: true },
  { src: "/images/ai/salon-wash.webp", alt: "Client relaxing at the wash basin", category: "Salon" },
  { src: "/images/ai/gallery-updo.webp", alt: "Braided updo pinned for an event", category: "Styling", tall: true },
  { src: "/images/ai/service-treatment.webp", alt: "Soft defined curls after a perm", category: "Styling" },
  { src: "/images/ai/salon-tools.webp", alt: "Shears, comb and brush on a walnut counter", category: "Salon" },
];

// Stats in the template's style. The salon supplies the real numbers;
// until then each shows "to confirm" (null), which blocks publishing.
export const counters: { value: number | null; suffix: string; label: string }[] = [
  { value: null, suffix: "+", label: "Years of experience" },
  { value: null, suffix: "+", label: "Haircuts per week" },
  { value: null, suffix: "+", label: "Colour services per week" },
  { value: null, suffix: "+", label: "Happy clients" },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
