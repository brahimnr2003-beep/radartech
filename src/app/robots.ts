import type { MetadataRoute } from "next";
import { URL_WEB } from "@/lib/proyecto";

export default function robots(): MetadataRoute.Robots {
  return {
    // El panel y las rutas internas no deben aparecer en los buscadores
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${URL_WEB}/sitemap.xml`,
  };
}
