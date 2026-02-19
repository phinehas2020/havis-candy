"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/#story", label: "Our Story" },
  { href: "/#craft", label: "Made With Care" },
  { href: "/#where-to-buy", label: "Where To Buy" },
  { href: "/products", label: "Products" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const menuId = "mobile-nav-panel";

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="site-mobile-nav lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mobile-nav-toggle"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-controls={menuId}
      >
        <span className={`hamburger-line ${open ? "hamburger-line-1-open" : ""}`} />
        <span className={`hamburger-line ${open ? "hamburger-line-2-open" : ""}`} />
        <span className={`hamburger-line ${open ? "hamburger-line-3-open" : ""}`} />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="mobile-nav-backdrop"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            id={menuId}
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
        </>
      )}
    </div>
  );
}
