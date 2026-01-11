import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://solflightech.org", priority: 1.0 },
    { url: "https://solflightech.org/projects", priority: 0.9 },
    { url: "https://solflightech.org/services", priority: 0.8 },
    { url: "https://solflightech.org/about", priority: 0.7 },
    { url: "https://solflightech.org/contact", priority: 0.6 },
  ];
}
