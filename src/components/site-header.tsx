import Link from "next/link";

const navItems = [
  { href: "/#story", label: "Our Story" },
  { href: "/#craft", label: "Made With Care" },
  { href: "/#where-to-buy", label: "Where To Buy" },
  { href: "/products", label: "Products" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-vanilla-cream)]/95 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="logo group">
            <span className="logo-main group-hover:text-[var(--color-coral)] transition-colors">
              Havi&apos;s Candy Co.
            </span>
            <span className="logo-tagline">Handmade in Waco, Texas</span>
          </Link>

          {/* Navigation */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <Link href="/products" className="btn btn-primary btn-sm">
            Shop Caramels
          </Link>
        </div>
      </div>
    </header>
  );
}
