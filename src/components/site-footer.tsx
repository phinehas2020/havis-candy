import Image from "next/image";
import Link from "next/link";

const footerNav = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/products#sorghum-caramels", label: "Sorghum Caramels" },
      { href: "/products#chai-caramels", label: "Chai Caramels" },
      { href: "/products#coffee-caramels", label: "Coffee Caramels" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/#story", label: "Our Story" },
      { href: "/#craft", label: "Made With Care" },
      { href: "/#where-to-buy", label: "Find In Waco" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "mailto:hello@haviscandy.com", label: "Email Us" },
      { href: "https://facebook.com", label: "Facebook" },
      { href: "https://instagram.com", label: "Instagram" },
    ],
  },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Brand Column */}
        <div>
          <Link
            href="/"
            className="logo-stacked inline-flex mb-6 rounded-[var(--radius-sm)] border-2 border-[var(--color-amber)] bg-[var(--color-vanilla-cream)] p-2"
            aria-label="Havi's Candy Co. home"
          >
            <Image
              src="/logo-candy.png"
              alt="Havi's Candy Co. logo"
              width={628}
              height={412}
              sizes="160px"
              className="footer-logo-image"
            />
          </Link>
          <p className="footer-description">
            Small-batch caramels, handmade with old-fashioned care on Dry Creek Road
            in Central Texas. Each piece reflects three generations of sweet-making tradition.
          </p>

          {/* Heritage Stamp in Footer */}
          <div className="mt-8 inline-flex items-center gap-3 py-2 px-4 border-3 border-[var(--color-amber)] relative z-1">
            <span className="text-[var(--color-amber)] text-sm font-bold tracking-wide uppercase">
              Est. 2019 &middot; Waco, TX
            </span>
          </div>
        </div>

        {/* Nav Columns */}
        {footerNav.map((section) => (
          <div key={section.title}>
            <h3 className="footer-heading">{section.title}</h3>
            <nav aria-label={section.title} className="footer-links">
              {section.links.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="footer-divider" />

      {/* Bottom Row */}
      <div className="footer-bottom">
        <p className="footer-legal">
          &copy; {currentYear} Havi&apos;s Candy Co. All rights reserved.
        </p>
        <p className="footer-legal">
          Handcrafted in Waco, Texas with &hearts; and sorghum
        </p>
      </div>
    </footer>
  );
}
