import Link from "next/link";
import { MobileNav } from "./mobile-nav";

const navItems = [
  { href: "/#story", label: "Our Story" },
  { href: "/#craft", label: "Made With Care" },
  { href: "/#where-to-buy", label: "Where To Buy" },
  { href: "/products", label: "Products" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-vanilla-cream)] border-b-3 border-[var(--color-dark)] pattern-awning">
      <div className="container py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo with Candy Jar */}
          <Link href="/" className="logo group">
            <span className="candy-jar" aria-hidden="true">
              <span className="candy-piece"></span>
              <span className="candy-piece"></span>
              <span className="candy-piece"></span>
            </span>
            <span className="logo-main">
              Havi&apos;s Candy Co.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* CTA Button — hidden on small mobile, visible from sm up */}
            <Link href="/products" className="btn btn-primary btn-sm hidden sm:inline-flex">
              Shop Caramels
            </Link>

            {/* Mobile Hamburger */}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
