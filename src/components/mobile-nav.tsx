"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/#story", label: "Our Story" },
  { href: "/#craft", label: "Made With Care" },
  { href: "/#where-to-buy", label: "Where To Buy" },
  { href: "/products", label: "Products" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="mobile-nav-toggle"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <span className={`hamburger-line ${open ? "hamburger-line-1-open" : ""}`} />
        <span className={`hamburger-line ${open ? "hamburger-line-2-open" : ""}`} />
        <span className={`hamburger-line ${open ? "hamburger-line-3-open" : ""}`} />
      </button>

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="mobile-nav-panel"
        >
          <Link
            href="/products"
            className="btn btn-primary w-full mb-4"
            onClick={() => setOpen(false)}
          >
            Shop Caramels
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav-link"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
