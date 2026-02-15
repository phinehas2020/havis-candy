import Link from "next/link";
import { CartButton } from "./cart-button";
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
        <div className="flex items-center justify-between gap-4 min-w-0">
          {/* Logo with Candy Jar — shrinks on mobile to prevent overflow */}
          <Link href="/" className="logo logo-header group flex-shrink min-w-0">
            <span className="candy-jar candy-jar-header" aria-hidden="true">
              <span className="candy-piece"></span>
              <span className="candy-piece"></span>
              <span className="candy-piece"></span>
            </span>
            <span className="logo-main logo-header-text">
              Havi&apos;s Candy Co.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-10 flex-shrink-0">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Cart, CTA, and mobile menu — never shrink */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* CTA — visible only on desktop (lg+) to avoid mobile cramping */}
            <Link href="/products" className="btn btn-primary btn-sm hidden lg:inline-flex">
              Shop Caramels
            </Link>

            <CartButton />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
