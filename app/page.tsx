import About from "@/components/About";
import Counters from "@/components/Counters";
import Feature from "@/components/Feature";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Promos from "@/components/Promos";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Feature />
      <Promos />
      <Testimonials />
      <Counters />
    </>
  );
}
