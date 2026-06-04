import { createFileRoute } from "@tanstack/react-router";
import { PakmanSite } from "@/components/pakman/PakmanSite";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pakman Packaging Solutions — Premium Packaging for Restaurants and Cafés" },
      {
        name: "description",
        content:
          "Pakman is a Saudi company founded in Jeddah in 2024 providing complete custom packaging solutions for restaurants, cafés, bakeries, catering companies and food brands.",
      },
      { property: "og:title", content: "Pakman Packaging Solutions" },
      {
        property: "og:description",
        content: "Premium packaging for restaurants and cafés. Founded in Jeddah, 2024.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "alternate", hrefLang: "ar", href: "/ar" },
    ],
  }),
  component: () => <PakmanSite lang="en" />,
});
