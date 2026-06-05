import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Coffee,
  PackageCheck,
  Store,
  Truck,
  Utensils,
  X,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/Logo";
import { Intro } from "./Intro";
import { content, type Lang } from "./content";

import { categoryImages } from "./categories";

const heroImg = "/assets/hero/hero-arrangement.jpg";
const aboutImg = "/assets/library/hero-packaging.jpg";
const saudiMap = "/assets/maps/saudi-map.jpg";

const clientLogos = [
  { name: "BTC Basamh Trading Company", url: "/assets/clients/btc.jpg" },
  { name: "Subbie", url: "/assets/clients/subbie.png" },
  { name: "Circle Section", url: "/assets/clients/circle-section.png" },
  { name: "Fornia", url: "/assets/clients/fornia.jpg" },
  { name: "Prepd", url: "/assets/clients/prepd.jpg" },
  { name: "Evolve", url: "/assets/clients/evolve.jpg" },
  { name: "Tasting Spoon Catering Co.", url: "/assets/clients/tasting-spoon.jpg" },
  { name: "Sprout", url: "/assets/clients/sprout.jpg" },
  { name: "Sushiah", url: "/assets/clients/sushiiah.jpg" },
  { name: "Goodies Selections", url: "/assets/clients/goodies.jpg" },
  { name: "Byblos Xpress", url: "/assets/clients/byblos-xpress.jpg" },
  { name: "Ashi Sushi and Takoyaki", url: "/assets/clients/ashi.jpg" },
];
const marqueeLogos = [...clientLogos, ...clientLogos];
const featuredProductIndexes = [0, 1, 4, 5, 6, 7, 8, 11, 12, 21];

const workImages = categoryImages;
const whatsappNumber = "966531585759";
const solutionIcons = [Coffee, ChefHat, Store, Utensils, PackageCheck, Truck];

export function PakmanSite({ lang }: { lang: Lang }) {
  const c = content[lang];
  const isRTL = c.dir === "rtl";
  const [showIntro, setShowIntro] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productCarouselRef = useRef<HTMLDivElement>(null);

  // Sticky shrink on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal observer for .reveal elements
  useEffect(() => {
    if (typeof window === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lang, showIntro]);

  // Apply dir to <html>
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const prevDir = html.getAttribute("dir");
    const prevLang = html.getAttribute("lang");
    html.setAttribute("dir", c.dir);
    html.setAttribute("lang", c.htmlLang);
    return () => {
      if (prevDir) html.setAttribute("dir", prevDir);
      else html.removeAttribute("dir");
      if (prevLang) html.setAttribute("lang", prevLang);
      else html.removeAttribute("lang");
    };
  }, [c.dir, c.htmlLang]);

  useEffect(() => {
    if (!productsOpen || typeof document === "undefined") return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProductsOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [productsOpen]);

  const handleQuoteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lines = [
      "Pakman quote request",
      `${c.quote.fields.name}: ${form.get("name") ?? ""}`,
      `${c.quote.fields.company}: ${form.get("company") ?? ""}`,
      `${c.quote.fields.type}: ${form.get("type") ?? ""}`,
      `${c.quote.fields.phone}: ${form.get("phone") ?? ""}`,
      `${c.quote.fields.email}: ${form.get("email") ?? ""}`,
      `${c.quote.fields.products}: ${form.get("products") ?? ""}`,
      `${c.quote.fields.qty}: ${form.get("qty") ?? ""}`,
      `${c.quote.fields.message}: ${form.get("message") ?? ""}`,
    ];
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const productItems = c.products.list.map((name, i) => ({
    name,
    image: categoryImages[i] ?? categoryImages[categoryImages.length - 1],
    number: String(i + 1).padStart(2, "0"),
  }));
  const featuredProductItems = featuredProductIndexes
    .map((index) => productItems[index])
    .filter((item) => Boolean(item));
  const viewAllProductsLabel = lang === "en" ? "View All Products" : "عرض كل المنتجات";
  const closeProductsLabel = lang === "en" ? "Close products" : "إغلاق المنتجات";

  const scrollProducts = (direction: "prev" | "next") => {
    const carousel = productCarouselRef.current;
    if (!carousel) return;
    const amount = carousel.clientWidth * 0.86;
    carousel.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-charcoal text-canvas" dir={c.dir}>
      {showIntro && <Intro tagline={c.introTagline} onDone={() => setShowIntro(false)} />}

      {/* Nav — fixed; transparent over dark hero, light blur after scroll */}
      <nav
        className={`site-nav fixed top-0 inset-x-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? "backdrop-blur-xl bg-charcoal/85 border-b border-white/8 shadow-[0_4px_24px_-12px_oklch(0_0_0/0.5)]"
            : "bg-transparent border-b border-transparent"
        } text-canvas`}
      >
        <div
          className={`site-nav-inner container-x flex items-center justify-between gap-6 transition-all duration-500 ${
            scrolled ? "h-[72px] md:h-20" : "h-20 md:h-28"
          }`}
        >
          <a href={lang === "en" ? "/" : "/ar"} className="flex items-center">
            <Logo
              className={`site-logo logo-on-dark w-auto object-contain transition-all duration-500 ${scrolled ? "h-16 md:h-20" : "h-[76px] md:h-28"}`}
            />
          </a>
          <div className="hidden lg:flex items-center gap-10 text-sm text-canvas/85">
            <a className="hover:text-champagne transition-colors" href="#about">
              {c.nav.about}
            </a>
            <a className="hover:text-champagne transition-colors" href="#products">
              {c.nav.products}
            </a>
            <a className="hover:text-champagne transition-colors" href="#solutions">
              {c.nav.solutions}
            </a>
            <a className="hover:text-champagne transition-colors" href="#work">
              {c.nav.work}
            </a>
            <a className="hover:text-champagne transition-colors" href="#clients">
              {c.nav.clients}
            </a>
            <a className="hover:text-champagne transition-colors" href="#contact">
              {c.nav.contact}
            </a>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <a
              href={c.nav.switchHref}
              lang={lang === "en" ? "ar" : "en"}
              dir={lang === "en" ? "rtl" : "ltr"}
              className={`text-xs text-canvas/80 hover:text-champagne transition-colors ${
                lang === "en" ? "font-arabic" : "tracking-[0.18em] uppercase"
              }`}
            >
              {c.nav.switchLang}
            </a>
            <Button
              size="sm"
              asChild
              className="hidden sm:inline-flex bg-canvas text-charcoal hover:bg-champagne"
            >
              <a href="#quote">{c.nav.cta}</a>
            </Button>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="mobile-menu-toggle lg:hidden inline-flex items-center justify-center size-11 rounded-full border border-white/30 text-canvas hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] bg-charcoal/95 backdrop-blur-xl border-t border-white/10 ${
            mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container-x py-5 flex flex-col gap-1 text-base">
            <Logo className="logo-on-dark mb-4 h-20 w-auto self-start object-contain" />
            {[
              ["#about", c.nav.about],
              ["#products", c.nav.products],
              ["#solutions", c.nav.solutions],
              ["#work", c.nav.work],
              ["#clients", c.nav.clients],
              ["#contact", c.nav.contact],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="py-3 border-b border-white/10 text-canvas hover:text-champagne transition-colors"
              >
                {label}
              </a>
            ))}
            <Button size="lg" asChild className="mt-6 bg-canvas text-charcoal hover:bg-champagne">
              <a href="#quote" onClick={() => setMobileOpen(false)}>
                {c.nav.cta}
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero — DARK cinematic, packaging arrangement on the right */}
      <section className="hero-section relative overflow-hidden dark-section">
        <div className="hero-container container-x relative pt-28 sm:pt-32 md:pt-44 pb-16 md:pb-32 grid gap-10 lg:gap-16 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 fade-up">
            <h1 className="display-1 text-canvas">
              {c.hero.title1}
              <br />
              <span className="text-canvas/55">{c.hero.title2}</span>
            </h1>
            <p className="body-lg mt-8 max-w-xl text-canvas/75">{c.hero.sub}</p>
            <div className="hero-actions mt-10 flex flex-wrap gap-3">
              <Button
                size="lg"
                asChild
                className="bg-canvas text-charcoal hover:bg-champagne hover:text-charcoal"
              >
                <a href="#quote">{c.hero.ctaPrimary}</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-canvas/30 text-canvas hover:bg-canvas hover:text-charcoal hover:border-canvas"
              >
                <a href="#products">{c.hero.ctaSecondary}</a>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-7 reveal">
            <div className="hero-image-card relative aspect-[16/11] overflow-hidden rounded-2xl shadow-[0_40px_120px_-40px_oklch(0_0_0/0.7)] border border-white/5">
              <img
                src={heroImg}
                alt=""
                width={1920}
                height={1320}
                className="hero-product-image absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-[1.04]"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(120deg, oklch(0 0 0 / 0.25), transparent 40%, transparent 60%, oklch(0 0 0 / 0.25))",
                }}
              />
            </div>
          </div>
        </div>
        <div className="gold-rule absolute bottom-0 inset-x-0 opacity-50" />
      </section>

      {/* Clients — DARK premium cards */}
      <section id="clients" className="dark-section border-y border-white/5">
        <div className="container-x py-20 md:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-end mb-12 reveal">
            <div className="lg:col-span-7">
              <h2 className="display-2 text-canvas">{c.clients.title}</h2>
            </div>
            <p className="lg:col-span-5 body-lg text-canvas/70">{c.clients.text}</p>
          </div>
          <div className="client-marquee reveal" aria-label={c.clients.title}>
            <div className="client-marquee-track">
              {marqueeLogos.map((logo, i) => (
                <div
                  key={`${logo.name}-${i}`}
                  className="client-logo-card"
                  aria-hidden={i >= clientLogos.length ? "true" : undefined}
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    loading="eager"
                    decoding="async"
                    draggable="false"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About — packaging image + dark feature pillars sidebar */}
      <section id="about" className="section-y dark-section">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-10 reveal">
            <div className="lg:col-span-5">
              <h2 className="display-2 text-canvas">{c.about.title}</h2>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <p className="body-lg text-canvas/75">{c.about.body1}</p>
              <p className="body-lg text-canvas/75">{c.about.body2}</p>
            </div>
          </div>

          <div className="mt-20 grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            <div className="about-image-card lg:col-span-8 reveal relative min-h-[320px] overflow-hidden rounded-xl border border-white/5 md:min-h-[520px]">
              <img
                src={aboutImg}
                alt=""
                loading="lazy"
                className="mobile-contain-image absolute inset-0 w-full h-full object-cover transition-transform duration-[1600ms] ease-out hover:scale-[1.05]"
              />
            </div>
            <div className="lg:col-span-4 reveal dark-card p-6 md:p-10 flex flex-col gap-6 justify-between md:min-h-[520px]">
              {[
                {
                  t: lang === "en" ? "Founded in Jeddah, 2024" : "تأسست في جدة عام 2024",
                  d:
                    lang === "en"
                      ? "A Saudi company built for the local hospitality scene."
                      : "شركة سعودية بنيت لخدمة قطاع الضيافة المحلي.",
                },
                {
                  t: lang === "en" ? "Specialized in Food Packaging" : "متخصصون في تغليف الأغذية",
                  d:
                    lang === "en"
                      ? "Restaurants, cafés, bakeries, catering and food brands."
                      : "للمطاعم والمقاهي والمخابز وشركات الإعاشة.",
                },
                {
                  t: lang === "en" ? "Premium Quality Materials" : "خامات بجودة عالية",
                  d:
                    lang === "en"
                      ? "Food safe and finished to a luxury standard."
                      : "آمنة للأغذية وبتشطيب فاخر.",
                },
                {
                  t: lang === "en" ? "Support Idea to Delivery" : "دعم من الفكرة إلى التسليم",
                  d:
                    lang === "en"
                      ? "Design, prototyping, print and reliable supply."
                      : "تصميم ونماذج وطباعة وتوريد موثوق.",
                },
              ].map((f, i) => (
                <div key={f.t} className="flex gap-4 items-start">
                  <span
                    className="mt-1 size-8 rounded-full flex items-center justify-center text-[10px] font-display tracking-[0.18em]"
                    style={{
                      background: "oklch(from var(--champagne) l c h / 0.18)",
                      color: "var(--champagne)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-display text-canvas text-[15px] leading-tight">{f.t}</h4>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-canvas/65">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products — DARK luxury carousel */}
      <section id="products" className="section-y dark-section relative overflow-hidden">
        <div className="container-x relative">
          <div className="grid lg:grid-cols-12 gap-10 items-end reveal">
            <div className="lg:col-span-8">
              <h2 className="display-2 max-w-3xl text-canvas">{c.products.title}</h2>
            </div>
            <div
              className={`lg:col-span-4 flex flex-wrap gap-3 ${isRTL ? "lg:justify-start" : "lg:justify-end"}`}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setProductsOpen(true)}
                className="border-canvas/30 text-canvas hover:bg-canvas hover:text-charcoal hover:border-canvas"
              >
                {viewAllProductsLabel}
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-canvas text-charcoal hover:bg-champagne hover:text-charcoal"
              >
                <a href="#quote">{c.nav.cta}</a>
              </Button>
            </div>
          </div>

          <div className="mt-10 md:mt-14 flex items-center justify-between gap-4 reveal">
            <div className="flex items-center gap-2" dir="ltr">
              <button
                type="button"
                aria-label={lang === "en" ? "Previous products" : "المنتجات السابقة"}
                onClick={() => scrollProducts("prev")}
                className="inline-flex size-11 items-center justify-center rounded-full border border-canvas/20 text-canvas transition-colors hover:border-canvas/50 hover:bg-canvas/10"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label={lang === "en" ? "Next products" : "المنتجات التالية"}
                onClick={() => scrollProducts("next")}
                className="inline-flex size-11 items-center justify-center rounded-full border border-canvas/20 text-canvas transition-colors hover:border-canvas/50 hover:bg-canvas/10"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          <div className="product-carousel-shell mt-5 md:mt-7 reveal">
            <div
              ref={productCarouselRef}
              className="product-carousel"
              aria-label={c.products.title}
              dir="ltr"
            >
              {featuredProductItems.map((product) => (
                <article
                  key={product.name}
                  className="product-carousel-card group dark-card overflow-hidden"
                  dir={c.dir}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="eager"
                      decoding="async"
                      className="product-card-image absolute inset-0 w-full h-full object-contain transition-transform duration-[1400ms] ease-out"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-60 group-hover:opacity-30"
                      style={{
                        background: "linear-gradient(180deg, transparent 40%, oklch(0 0 0 / 0.55))",
                      }}
                    />
                  </div>
                  <div className="min-h-[76px] px-3 py-4 md:px-4 md:py-5 flex items-start justify-between gap-2">
                    <h3 className="font-display text-[13px] md:text-sm leading-tight text-canvas/90 group-hover:text-champagne transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-[9px] tracking-[0.2em] text-canvas/35 font-display">
                      {product.number}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {productsOpen && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/88 px-4 py-5 backdrop-blur-xl md:px-8 md:py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="products-modal-title"
        >
          <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-xl border border-white/10 bg-charcoal shadow-[0_32px_120px_-44px_oklch(0_0_0/0.95)]">
            <div className="flex items-start justify-between gap-6 border-b border-white/10 px-5 py-5 md:px-8 md:py-6">
              <h2 id="products-modal-title" className="heading-lg text-canvas">
                {c.products.title}
              </h2>
              <button
                type="button"
                aria-label={closeProductsLabel}
                onClick={() => setProductsOpen(false)}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-canvas/20 text-canvas transition-colors hover:border-canvas/50 hover:bg-canvas/10"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-6 md:px-8 md:py-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {productItems.map((product) => (
                  <article
                    key={product.name}
                    className="group dark-card overflow-hidden"
                    dir={c.dir}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="eager"
                        decoding="async"
                        className="product-card-image absolute inset-0 w-full h-full object-contain transition-transform duration-[1400ms] ease-out"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-60 group-hover:opacity-30"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 40%, oklch(0 0 0 / 0.55))",
                        }}
                      />
                    </div>
                    <div className="min-h-[76px] px-3 py-4 md:px-4 md:py-5 flex items-start justify-between gap-2">
                      <h3 className="font-display text-[13px] md:text-sm leading-tight text-canvas/90 group-hover:text-champagne transition-colors">
                        {product.name}
                      </h3>
                      <span className="text-[9px] tracking-[0.2em] text-canvas/35 font-display">
                        {product.number}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Solutions */}
      <section id="solutions" className="section-y dark-section">
        <div className="container-x">
          <div className="max-w-3xl reveal">
            <h2 className="display-2 text-canvas">{c.solutions.title}</h2>
          </div>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {c.solutions.cards.map((card, i) => {
              const Icon = solutionIcons[i % solutionIcons.length];
              return (
                <div
                  key={card.t}
                  className="solution-card reveal dark-card p-6 md:p-10 group"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="solution-card-mark">
                    <Icon className="size-4" aria-hidden="true" strokeWidth={1.7} />
                    <span className="font-display text-[10px] tracking-[0.2em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="heading-lg mt-6 text-canvas group-hover:text-champagne transition-colors">
                    {card.t}
                  </h3>
                  <p className="mt-4 text-sm text-canvas/65 leading-relaxed">{card.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Work / gallery */}
      <section id="work" className="work-section section-y dark-section border-t border-white/5">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-10 items-end reveal">
            <div className="lg:col-span-7">
              <h2 className="display-2 text-canvas">{c.work.title}</h2>
            </div>
            <p className="lg:col-span-5 body-lg text-canvas/70">{c.work.text}</p>
          </div>

          <div className="work-gallery mt-14 md:mt-16 grid grid-cols-6">
            <div className="work-tile work-tile-featured col-span-6 md:col-span-4 relative aspect-[16/10] overflow-hidden rounded-2xl">
              <img
                src={workImages[15]}
                alt=""
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="work-tile col-span-3 md:col-span-2 relative aspect-square overflow-hidden rounded-2xl">
              <img
                src={workImages[0]}
                alt=""
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="work-tile col-span-3 md:col-span-2 relative aspect-square overflow-hidden rounded-2xl">
              <img
                src={workImages[3]}
                alt=""
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="work-tile col-span-3 md:col-span-2 relative aspect-square overflow-hidden rounded-2xl">
              <img
                src={workImages[2]}
                alt=""
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="work-tile col-span-6 md:col-span-2 relative aspect-square overflow-hidden rounded-2xl">
              <img
                src={workImages[12]}
                alt=""
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="work-tile col-span-3 md:col-span-3 relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={workImages[5]}
                alt=""
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="work-tile col-span-3 md:col-span-3 relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={workImages[10]}
                alt=""
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="section-y bg-charcoal text-canvas">
        <div className="container-x grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5">
            <h2 className="display-2 text-canvas">{c.why.title}</h2>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-x-10 gap-y-6">
            {c.why.points.map((p, i) => (
              <div key={p} className="border-t border-white/15 pt-5 flex gap-5">
                <span className="font-display text-warm-gray text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="section-y dark-section">
        <div className="container-x grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5 reveal">
            <h2 className="display-2 text-canvas">{c.quote.title}</h2>
            <p className="body-lg mt-6 text-canvas/70">{c.quote.text}</p>
          </div>
          <form
            onSubmit={handleQuoteSubmit}
            className="lg:col-span-7 reveal dark-card p-6 md:p-10 space-y-7"
          >
            <div className="grid sm:grid-cols-2 gap-7">
              {[
                ["name", c.quote.fields.name],
                ["company", c.quote.fields.company],
                ["type", c.quote.fields.type],
                ["phone", c.quote.fields.phone],
                ["email", c.quote.fields.email],
                ["qty", c.quote.fields.qty],
              ].map(([id, label]) => (
                <div key={id} className="space-y-2">
                  <Label
                    htmlFor={id}
                    className="contact-label text-[10px] uppercase tracking-[0.22em] text-canvas/60"
                  >
                    {label}
                  </Label>
                  <Input
                    id={id}
                    name={id}
                    className="h-12 rounded-none border-0 border-b border-white/15 bg-transparent px-0 text-base text-canvas focus-visible:ring-0 focus-visible:border-champagne placeholder:text-canvas/30"
                    dir={c.dir}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="products"
                className="contact-label text-[10px] uppercase tracking-[0.22em] text-canvas/60"
              >
                {c.quote.fields.products}
              </Label>
              <Input
                id="products"
                name="products"
                className="h-12 rounded-none border-0 border-b border-white/15 bg-transparent px-0 text-base text-canvas focus-visible:ring-0 focus-visible:border-champagne"
                dir={c.dir}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="message"
                className="contact-label text-[10px] uppercase tracking-[0.22em] text-canvas/60"
              >
                {c.quote.fields.message}
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                dir={c.dir}
                className="rounded-none border-0 border-b border-white/15 bg-transparent px-0 text-base text-canvas focus-visible:ring-0 focus-visible:border-champagne resize-none"
              />
            </div>
            <div
              className={`flex flex-wrap items-center justify-between gap-4 pt-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <p className="text-xs text-canvas/55">{c.quote.note}</p>
              <Button
                size="lg"
                type="submit"
                className="w-full bg-canvas text-charcoal hover:bg-champagne sm:w-auto"
              >
                {c.quote.submit}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Location — luxury dark map */}
      <section
        id="location"
        className="dark-section border-t border-white/5 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src={saudiMap}
            alt=""
            loading="eager"
            decoding="async"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-70"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, var(--charcoal) 0%, oklch(from var(--charcoal) l c h / 0.85) 35%, oklch(from var(--charcoal) l c h / 0.35) 65%, transparent 100%)",
            }}
          />
        </div>
        <div className="container-x section-y relative">
          <div className="max-w-xl reveal">
            <h2 className="display-2 text-canvas">{c.locationSection.title}</h2>
            <p className="body-lg mt-6 text-canvas/75">{c.locationSection.sub}</p>
            <div className="mt-10 dark-card p-8 md:p-10">
              <p className="font-display text-xl text-canvas">{c.locationSection.company}</p>
              <div className="mt-5 space-y-1.5 text-canvas/80 font-display text-base leading-relaxed">
                <p>{c.locationSection.city}</p>
                <p>{c.locationSection.district}</p>
                <p>{c.locationSection.area}</p>
              </div>
              <a
                href={c.locationSection.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 bg-canvas text-charcoal px-7 py-3.5 text-sm font-display tracking-wide hover:bg-champagne transition-colors"
              >
                {c.locationSection.cta}
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="dark-section border-t border-white/5">
        <div className="container-x section-y grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5 reveal">
            <h2 className="display-2 text-canvas">{c.contact.title}</h2>
          </div>
          <div className="contact-grid lg:col-span-7 grid sm:grid-cols-2 gap-8">
            <div className="contact-card border-t border-white/10 pt-6">
              <p className="contact-label text-[10px] uppercase tracking-[0.22em] text-champagne">
                {lang === "en" ? "Location" : "الموقع"}
              </p>
              <p className="contact-value mt-3 font-display text-lg text-canvas">
                {c.contact.location}
              </p>
            </div>
            <div className="contact-card border-t border-white/10 pt-6">
              <p className="contact-label text-[10px] uppercase tracking-[0.22em] text-champagne">
                {c.contact.phoneLabel}
              </p>
              <a
                href={`tel:${c.contact.phone.replace(/\s/g, "")}`}
                className="contact-value mt-3 font-display text-lg block text-canvas hover:text-champagne transition-colors"
                dir="ltr"
              >
                {c.contact.phone}
              </a>
            </div>
            <div className="contact-card border-t border-white/10 pt-6">
              <p className="contact-label text-[10px] uppercase tracking-[0.22em] text-champagne">
                {c.contact.emailLabel}
              </p>
              <a
                href={`mailto:${c.contact.email}`}
                className="contact-value mt-3 font-display text-lg block text-canvas hover:text-champagne transition-colors"
                dir="ltr"
              >
                {c.contact.email}
              </a>
            </div>
            <div className="contact-card border-t border-white/10 pt-6">
              <p className="contact-label text-[10px] uppercase tracking-[0.22em] text-champagne">
                {c.contact.whatsapp}
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-value mt-3 inline-flex items-center gap-2 font-display text-lg text-canvas hover:text-champagne transition-colors"
                dir="ltr"
              >
                {c.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-canvas">
        <div className="container-x py-20 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Logo className="logo-on-dark h-24 w-auto self-start object-contain md:h-32" />
            <p className="mt-6 font-display text-xl text-canvas max-w-md">{c.footer.title}</p>
            <p className="mt-4 text-sm text-warm-gray max-w-md leading-relaxed">{c.footer.text}</p>
          </div>
          <div className="lg:col-span-3">
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ["#about", c.nav.about],
                ["#products", c.nav.products],
                ["#solutions", c.nav.solutions],
                ["#work", c.nav.work],
                ["#clients", c.nav.clients],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-warm-gray hover:text-canvas transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <ul className="mt-5 space-y-3 text-sm text-warm-gray">
              <li>{c.contact.location}</li>
              <li dir="ltr">{c.contact.phone}</li>
              <li dir="ltr">{c.contact.email}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container-x py-6 flex flex-wrap justify-between gap-3 text-xs text-concrete">
            <span>{c.footer.rights}</span>
            <a
              href={c.nav.switchHref}
              lang={lang === "en" ? "ar" : "en"}
              dir={lang === "en" ? "rtl" : "ltr"}
              className={`hover:text-canvas transition-colors ${
                lang === "en" ? "font-arabic" : "tracking-[0.18em] uppercase"
              }`}
            >
              {c.nav.switchLang}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
