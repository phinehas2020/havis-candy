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
    <header className="site-header pattern-awning">
      <div className="container site-header-inner">
        <div className="site-header-row">
          <Link
            href="/"
            className="logo site-header-brand"
            aria-label="Havi's Candy Co. home"
          >
            <Image
              src="/logo-candy.png"
              alt="Havi's Candy Co. logo"
              width={628}
              height={412}
              sizes="(max-width: 640px) 72px, (max-width: 1024px) 86px, 103px"
              priority
              className="logo-image site-header-logo-image"
            />
          </Link>

          <nav aria-label="Primary" className="site-header-nav">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-header-actions">
            <CartButton />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
