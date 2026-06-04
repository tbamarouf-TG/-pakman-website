import { createFileRoute } from "@tanstack/react-router";
import { PakmanSite } from "@/components/pakman/PakmanSite";

export const Route = createFileRoute("/ar")({
  head: () => ({
    meta: [
      { title: "باكمان لحلول التغليف — تغليف احترافي للمطاعم والمقاهي" },
      {
        name: "description",
        content:
          "باكمان شركة سعودية تأسست في جدة عام 2024 تقدم حلول تغليف مخصصة ومتكاملة للمطاعم والمقاهي والمخابز وشركات الإعاشة والعلامات الغذائية.",
      },
      { property: "og:title", content: "باكمان لحلول التغليف" },
      {
        property: "og:description",
        content: "تغليف احترافي للمطاعم والمقاهي. تأسست في جدة عام 2024.",
      },
      { property: "og:url", content: "/ar" },
    ],
    links: [
      { rel: "canonical", href: "/ar" },
      { rel: "alternate", hrefLang: "en", href: "/" },
    ],
  }),
  component: () => <PakmanSite lang="ar" />,
});
