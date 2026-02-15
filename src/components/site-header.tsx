import Image from "next/image";
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
          {/* Brand Logo */}
          <Link
            href="/"
            className="logo group flex-shrink min-w-0"
            aria-label="Havi's Candy Co. home"
          >
            <Image
              src="/logo-candy.png"
              alt="Havi's Candy Co. logo"
              width={628}
              height={412}
              sizes="(max-width: 640px) 130px, 190px"
              priority
              className="logo-image"
            />
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
