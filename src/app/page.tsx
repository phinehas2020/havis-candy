import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLocations, getProducts, getSiteSettings, getTestimonials } from "@/lib/data/content";
import { buildFaqSchema, buildLocalBusinessSchema, buildProductsSchema } from "@/lib/seo/schemas";

export default async function HomePage() {
  const [settings, products, locations, testimonials] = await Promise.all([
    getSiteSettings(),
    getProducts(),
    getLocations(),
    getTestimonials(),
  ]);

  const featuredProducts = products.filter((product) => product.featured);
  const heroProducts = featuredProducts.length ? featuredProducts : products;
  const showcaseProducts = heroProducts.slice(0, 3);
  const heroProduct = heroProducts[0];
  const spotlightTestimonial = testimonials[0];

  return (
    <>
      <JsonLd data={buildLocalBusinessSchema(locations)} />
      <JsonLd data={buildProductsSchema(showcaseProducts)} />
      <JsonLd data={buildFaqSchema()} />

      <SiteHeader />

      <main className="min-h-dvh">
        {/* ═══════════════════════════════════════════════════════════════════
            HERO — "The Marquee"
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="section-lg candy-counter-bg">
          <div className="container">
            {/* Starburst Badge */}
            <div className="flex justify-center mb-6">
              <div className="heritage-badge animate-in animate-float">
                <span className="heritage-badge-label">Handmade</span>
                <span className="heritage-badge-year">2019</span>
                <span className="heritage-badge-text">Waco, Texas</span>
              </div>
            </div>

            {/* Main Hero Content */}
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 relative z-1">
              <h1 className="display-heading mb-5 sm:mb-8">
                Uniquely flavored,<br />
                <em>handmade</em> hard caramels.
              </h1>
              <p className="lead-text max-w-2xl mx-auto mb-6 sm:mb-10">
                Small-batch sweets made from scratch with all-natural ingredients
                and old-fashioned care. Born on a family farm in Central Texas.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                <Link href="/products" className="btn btn-primary">
                  Shop The Collection
                </Link>
                <a href="#where-to-buy" className="btn btn-secondary">
                  Find Us In Waco
                </a>
              </div>
            </div>

            {/* Featured Product Hero Card */}
            {heroProduct && (
              <div className="max-w-5xl mx-auto relative z-1">
                <div className="grid md:grid-cols-2 gap-0 bg-[var(--color-butter)] border-3 border-[var(--color-dark)] shadow-[var(--shadow-lg)] sm:shadow-[var(--shadow-xl)] overflow-hidden rounded-[var(--radius-md)] md:rotate-[-1deg]">
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] sm:aspect-square md:aspect-auto">
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                      <div className="ribbon-label">Signature</div>
                    </div>
                    <Image
                      src={heroProduct.imageUrl}
                      alt={heroProduct.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center">
                    <span className="overline-simple mb-3 sm:mb-4">Featured Flavor</span>
                    <h2 className="section-heading mb-3 sm:mb-4">{heroProduct.title}</h2>
                    <p className="body-text mb-6 sm:mb-8">{heroProduct.shortDescription}</p>

                    <div className="flex items-end justify-between border-t-2 border-dashed border-[var(--color-border)] pt-4 sm:pt-6">
                      <div className="price">
                        <span className="price-currency">$</span>
                        <span className="price-amount">{heroProduct.price.toFixed(2)}</span>
                      </div>
                      <Link href="/products" className="btn btn-primary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Scalloped Wave Divider */}
        <div className="flourish-divider" />

        {/* ═══════════════════════════════════════════════════════════════════
            PRODUCT SHOWCASE — "The Penny Candy Counter"
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="section pattern-checkerboard">
          <div className="container relative z-1">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div>
                <span className="overline mb-4 block">Best-Selling Flavors</span>
                <h2 className="section-heading">
                  A classic candy counter,<br className="hidden md:block" /> reimagined.
                </h2>
              </div>
              <Link href="/products" className="btn btn-secondary hidden md:inline-flex">
                Browse All Flavors
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {showcaseProducts.map((product, index) => (
                <article
                  key={product.id}
                  className={`product-card animate-in animate-delay-${index + 1}`}
                  id={product.slug}
                >
                  {product.badge && (
                    <div className="product-card-badge">
                      <div className="ribbon-label-gold ribbon-label">{product.badge}</div>
                    </div>
                  )}
                  <div className="product-card-media">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>
                  <div className="product-card-content">
                    <h3 className="product-card-name">{product.title}</h3>
                    <p className="product-card-description">{product.shortDescription}</p>
                    <div className="product-card-footer">
                      <div className="price">
                        <span className="price-currency">$</span>
                        <span className="price-amount">{product.price.toFixed(2)}</span>
                      </div>
                      <span className="status-available">In Stock</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 text-center md:hidden">
              <Link href="/products" className="btn btn-primary">
                Browse All Flavors
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            OUR STORY — "The Chalkboard"
            ═══════════════════════════════════════════════════════════════════ */}
        <section id="story" className="section-lg section-dark">
          <div className="container">
            <div className="grid md:grid-cols-12 gap-8 md:gap-16 items-center">
              {/* Story Content */}
              <div className="md:col-span-7 space-y-6 sm:space-y-8">
                <span className="overline">Our Story</span>
                <h2 className="section-heading">{settings.storyHeading}</h2>
                <p className="lead-text">{settings.storyBody}</p>

                <div className="ornament-rule">
                  <div className="ornament-dots"><span></span></div>
                </div>

                <p className="body-text">
                  From Dry Creek Road to kitchens across Central Texas, each batch reflects
                  the same thoughtful craft that started it all—real ingredients, real care,
                  and a genuine love for making something special.
                </p>
              </div>

              {/* Heritage Card — Postcard style */}
              <div className="md:col-span-5">
                <div className="card-framed bg-[var(--color-dark-surface)]! border-[var(--color-amber)]!">
                  <div className="text-center mb-8 relative z-10">
                    <div className="heritage-stamp mx-auto border-[var(--color-amber)]!">
                      <span className="heritage-stamp-text text-[var(--color-amber)]!">Est. 2019 &middot; Waco, TX</span>
                    </div>
                  </div>
                  <h3 className="subheading text-center mb-4 relative z-10 text-[var(--color-cream)]!">Made with old-fashioned care</h3>
                  <p className="body-text-sm text-center relative z-10 text-[var(--color-cream)]/80!">{settings.philosophyBody}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            THE CRAFT — "The Recipe Cards"
            ═══════════════════════════════════════════════════════════════════ */}
        <section id="craft" className="section-lg pattern-dots">
          <div className="container relative z-1">
            <div className="max-w-2xl mb-8 sm:mb-16">
              <span className="overline mb-4 block">Made With Care</span>
              <h2 className="section-heading">
                Hand-poured. Hand-wrapped.<br className="hidden sm:block" /> Never rushed.
              </h2>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              {[
                {
                  title: "Handcrafted Quality",
                  description:
                    "Every caramel is made from scratch with all-natural ingredients\u2014real butter, pure cane sugar, farm-fresh cream.",
                  number: "01",
                },
                {
                  title: "Farm-Grown Sorghum",
                  description:
                    "Our signature sorghum syrup comes from the family farm, giving Havi\u2019s most-loved caramel its distinct, nostalgic taste.",
                  number: "02",
                },
                {
                  title: "Distinctive Flavors",
                  description:
                    "Sorghum, chai, coffee, and seasonal releases\u2014each one crafted to feel familiar yet never ordinary.",
                  number: "03",
                },
              ].map((item, index) => (
                <article
                  key={item.title}
                  className={`craft-card animate-in animate-delay-${index + 1}`}
                >
                  <span
                    className="block font-[family-name:var(--font-heading)] text-3xl text-[var(--color-coral-light)] mb-5"
                    aria-hidden="true"
                  >
                    {item.number}
                  </span>
                  <h3 className="subheading mb-4">{item.title}</h3>
                  <p className="body-text-sm">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            TESTIMONIAL — "The Neon Sign"
            ═══════════════════════════════════════════════════════════════════ */}
        {spotlightTestimonial && (
          <section className="section-lg section-dark">
            <div className="container">
              <div className="testimonial">
                <blockquote className="testimonial-quote neon-flicker">
                  {spotlightTestimonial.quote}
                </blockquote>
                <p className="testimonial-author">{spotlightTestimonial.author}</p>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            WHERE TO BUY — "The Map Board" (Mint section)
            ═══════════════════════════════════════════════════════════════════ */}
        <section id="where-to-buy" className="section-lg section-mint pattern-awning">
          <div className="container relative z-1 pt-4">
            <div className="max-w-2xl mb-8 sm:mb-16">
              <span className="overline mb-4 block">Where To Buy</span>
              <h2 className="section-heading">Find us across the Waco area.</h2>
              <p className="body-text mt-4">
                Shop online for delivery anywhere, or visit one of our local retail partners.
              </p>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-3 pt-4">
              {locations.map((location, index) => (
                <article
                  key={location.id}
                  className={`location-card animate-in animate-delay-${index + 1}`}
                >
                  <div className="flex flex-col h-full">
                    <h3 className="subheading mb-3">{location.name}</h3>
                    <p className="body-text-sm text-[var(--color-mocha)] mb-6 flex-grow">
                      {location.streetAddress}
                      <br />
                      {location.city}, {location.region} {location.postalCode}
                    </p>
                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost w-full"
                    >
                      Open Map
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CONTACT — "The Postcard"
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="section pattern-lined">
          <div className="container container-narrow relative z-1">
            <div className="postcard">
              <div className="grid md:grid-cols-2 gap-10 relative z-10">
                <div>
                  <span className="overline-simple block mb-4">Get In Touch</span>
                  <h2 className="subheading mb-4">Let&apos;s make gift-giving sweeter.</h2>
                  <p className="body-text-sm">
                    For wholesale inquiries, custom orders, events, or product questions,
                    we&apos;d love to hear from you.
                  </p>
                </div>
                <div className="space-y-5 body-text-sm">
                  <p>
                    <span className="font-semibold text-[var(--color-chocolate)]">Email</span>
                    <br />
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="hover:text-[var(--color-coral)] transition-colors"
                    >
                      {settings.contactEmail}
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--color-chocolate)]">Phone</span>
                    <br />
                    <a
                      href={`tel:${settings.contactPhone?.replace(/\D/g, "")}`}
                      className="hover:text-[var(--color-coral)] transition-colors"
                    >
                      {settings.contactPhone}
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--color-chocolate)]">Mailing</span>
                    <br />
                    {settings.mailingAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
