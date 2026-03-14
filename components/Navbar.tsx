"use client";

import { useEffect, useRef, useState } from "react";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Search,
  Smile,
  Twitter,
  X,
} from "lucide-react";
import { navLinks } from "../lib/content";
import { gsap } from "gsap";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current.querySelectorAll(".nav-item"),
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" },
    );
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    gsap.to(menuRef.current, {
      autoAlpha: open ? 1 : 0,
      y: open ? 0 : -16,
      duration: 0.4,
      ease: "power2.out",
      pointerEvents: open ? "auto" : "none",
    });
  }, [open]);

  useEffect(() => {
    if (!searchOpen) return;
    const id = window.setTimeout(() => searchRef.current?.focus(), 120);
    return () => window.clearTimeout(id);
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <header ref={navRef} className="navbar">
      <div className="topbar">
        <div className="topbar-shell">
          <div className="topbar-group">
            <div className="topbar-item">
              <span className="topbar-icon" aria-hidden="true">
                <MapPin size={16} />
              </span>
              <span>123, New Lenox Chicago, IL 60606</span>
            </div>
            <div className="topbar-item">
              <span className="topbar-icon" aria-hidden="true">
                <Mail size={16} />
              </span>
              <span>info@yoursite.com</span>
            </div>
          </div>
          <div className="topbar-group">
            <a className="social-link" href="https://x.com" aria-label="X">
              <Twitter size={14} />
            </a>
            <a
              className="social-link"
              href="https://facebook.com"
              aria-label="Facebook"
            >
              <Facebook size={14} />
            </a>
            <a
              className="social-link"
              href="https://instagram.com"
              aria-label="Instagram"
            >
              <Instagram size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="nav-shell">
        <a className="brand nav-item" href="/">
          <span className="brand-mark" aria-hidden="true">
            <Smile size={26} />
          </span>
          <span className="brand-text">
            Dental <span>Clinic</span>
          </span>
        </a>

        <nav className="nav-links nav-item">
          <a className="nav-link active" href="/">
            Home
          </a>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-utility nav-item">
          <button
            className="search-btn"
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={18} />
          </button>
          <button
            className="menu-toggle"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div ref={menuRef} className="mobile-menu" aria-hidden={!open}>
        <a className="mobile-link" href="/" onClick={() => setOpen(false)}>
          Home
        </a>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="mobile-link"
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div
        className={`search-overlay ${searchOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!searchOpen}
      >
        <div className="search-backdrop" onClick={() => setSearchOpen(false)} />
        <div className="search-panel">
          <div className="search-header">
            {/* <div>
              <p className="search-eyebrow">Search the clinic</p>
              <h2>Find services, doctors, or topics</h2>
            </div> */}
            <button
              className="search-close"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>
          <div className="search-field">
            <span className="search-icon" aria-hidden="true">
              <Search size={18} />
            </span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search for orthodontics, whitening, hygiene..."
            />
          </div>
          <div className="search-suggestions">
            <button type="button">Teeth Whitening</button>
            <button type="button">Braces & Aligners</button>
            <button type="button">Dental Implants</button>
            <button type="button">Family Dentistry</button>
            <button type="button">Emergency Care</button>
          </div>
        </div>
      </div>
    </header>
  );
}
