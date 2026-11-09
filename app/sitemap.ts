import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/services", "/gallery", "/about", "/contact"].map((path) => ({
    url: `${site.siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path ? 0.8 : 1,
  }));
}
