// app/sitemap.ts
import type { MetadataRoute } from "next";
import { services, cities } from "@/lib/solovoro";

// use env or default
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://solovoro.ca";

// generate statically
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  // Homepage
  urls.push({
    url: SITE,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  });

  // /{city}/{service}
  cities.forEach((city) => {
    services.forEach((service) => {
      urls.push({
        url: `${SITE}/${city.slug}/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  });

  // /{service}
  services.forEach((service) => {
    urls.push({
      url: `${SITE}/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  });

  return urls;
}
