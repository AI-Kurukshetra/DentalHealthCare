"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  Facebook,
  Instagram,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Search,
  Twitter,
  User,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { navLinks } from "../lib/content";
import { supabaseBrowser } from "../lib/supabaseClient";

type NavUser = {
  email: string;
  fullName: string;
  avatarUrl: string;
};

const emptyUser: NavUser = {
  email: "",
  fullName: "",
  avatarUrl: "",
};

const searchItems = [
  {
    label: "Teeth Whitening",
    href: "/services",
    keywords: ["whitening", "stains", "cosmetic"],
  },
  {
    label: "Dental Implants",
    href: "/services",
    keywords: ["implants", "tooth replacement", "restoration"],
  },
  {
    label: "Orthodontics",
    href: "/team",
    keywords: ["braces", "aligners", "straightening"],
  },
  {
    label: "Preventive Care Programs",
    href: "/services",
    keywords: ["hygiene", "cleaning", "prevention"],
  },
  {
    label: "Appointment Scheduling",
    href: "/appointment",
    keywords: ["booking", "calendar", "consultation"],
  },
  {
    label: "Emergency Care",
    href: "/contact",
    keywords: ["urgent", "pain", "same day"],
  },
  {
    label: "Patient Management System",
    href: "/features",
    keywords: ["patients", "records", "profiles"],
  },
  {
    label: "Billing & Insurance",
    href: "/features",
    keywords: ["billing", "claims", "insurance"],
  },
  {
    label: "Blog Insights",
    href: "/blog",
    keywords: ["articles", "insights", "playbooks"],
  },
  {
    label: "Contact the Clinic",
    href: "/contact",
    keywords: ["contact", "phone", "email"],
  },
] as const;

export function Navbar() {
  const router = useRouter();
  const [supabase] = useState(() => supabaseBrowser());
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [navUser, setNavUser] = useState<NavUser | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);

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
    const syncUser = async () => {
      const client = supabase;
      if (!client) {
        setNavUser(null);
        return;
      }

      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        setNavUser(null);
        return;
      }

      const metadata = user.user_metadata ?? {};
      let nextUser: NavUser = {
        email: user.email ?? emptyUser.email,
        fullName:
          metadata.name ??
          metadata.full_name ??
          user.email?.split("@")[0] ??
          "Patient",
        avatarUrl: metadata.avatar_url ?? "",
      };

      const { data: profile } = await client
        .from("profiles")
        .select("full_name,avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        nextUser = {
          email: user.email ?? nextUser.email,
          fullName: profile.full_name || nextUser.fullName,
          avatarUrl: profile.avatar_url || nextUser.avatarUrl,
        };
      }

      setNavUser(nextUser);
    };

    syncUser();

    if (!supabase) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      syncUser();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const closeSearch = () => {
    setSearchOpen(false);
    window.setTimeout(() => setSearchQuery(""), 180);
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearch();
        setAccountOpen(false);
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const initials = navUser?.fullName
    ? navUser.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "";

  const handleLogout = async () => {
    const client = supabase;
    if (!client) {
      setAccountOpen(false);
      setOpen(false);
      router.push('/login');
      return;
    }

    await client.auth.signOut();
    setAccountOpen(false);
    setOpen(false);
    router.push("/login");
    router.refresh();
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchMatches =
    normalizedQuery.length === 0
      ? searchItems.slice(0, 5)
      : searchItems.filter((item) => {
          const labelMatch = item.label.toLowerCase().includes(normalizedQuery);
          const keywordMatch = item.keywords.some((keyword) =>
            keyword.toLowerCase().includes(normalizedQuery),
          );

          return labelMatch || keywordMatch;
        });

  const commitSearch = (item: (typeof searchItems)[number]) => {
    setSearchQuery(item.label);
    closeSearch();
    router.push(item.href);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    const nextValueNormalized = nextValue.trim().toLowerCase();
    const inputType =
      event.nativeEvent instanceof InputEvent ? event.nativeEvent.inputType : "";

    if (!nextValueNormalized || inputType.startsWith("delete")) {
      setSearchQuery(nextValue);
      return;
    }

    const autofillMatch = searchItems.find((item) =>
      item.label.toLowerCase().startsWith(nextValueNormalized),
    );

    if (!autofillMatch) {
      setSearchQuery(nextValue);
      return;
    }

    setSearchQuery(autofillMatch.label);
    window.requestAnimationFrame(() => {
      searchRef.current?.focus();
      searchRef.current?.setSelectionRange(
        nextValue.length,
        autofillMatch.label.length,
      );
    });
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchMatches.length === 0) return;
    commitSearch(searchMatches[0]);
  };

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
        <Link className="brand nav-item" href="/">
          <span className="brand-mark" aria-hidden="true">
            <img
              src="/images/teethicon.png"
              alt="Dental Clinic"
              width={26}
              height={26}
            />
          </span>
          <span className="brand-text">
            Dental <span>Clinic</span>
          </span>
        </Link>

        <nav className="nav-links nav-item">
          <Link className="nav-link active" href="/">
            Home
          </Link>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-utility nav-item">
          {navUser ? (
            <div ref={accountRef} className="nav-account">
              <button
                className="nav-account-trigger"
                type="button"
                aria-label="Open account menu"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((value) => !value)}
              >
                <span className="nav-account-avatar" aria-hidden="true">
                  {navUser.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={navUser.avatarUrl} alt={navUser.fullName} />
                  ) : (
                    initials || <User size={16} />
                  )}
                </span>
              </button>
              {accountOpen ? (
                <div className="nav-account-menu">
                  <Link
                    href="/dashboard"
                    className="nav-account-link"
                    onClick={() => setAccountOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button
                    className="nav-account-link nav-account-logout"
                    type="button"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link className="btn-ghost nav-login" href="/login">
              Login
            </Link>
          )}
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

      <div ref={menuRef} className="mobile-menu" aria-hidden={!open} data-open={open}>
        <Link className="mobile-link" href="/" onClick={() => setOpen(false)}>
          Home
        </Link>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="mobile-link"
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {navUser ? (
          <>
            <div className="mobile-account-card">
              <div className="mobile-account-head">
                <span
                  className="nav-account-avatar mobile-avatar"
                  aria-hidden="true"
                >
                  {navUser.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={navUser.avatarUrl} alt={navUser.fullName} />
                  ) : (
                    initials || <User size={16} />
                  )}
                </span>
                <div className="mobile-account-copy">
                  <strong>{navUser.fullName}</strong>
                  <span>{navUser.email}</span>
                </div>
              </div>
              <Link
                className="mobile-link mobile-account-link"
                href="/dashboard"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <button
                className="mobile-account-button"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <Link
            className="mobile-link"
            href="/login"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
        )}
      </div>

      <div
        className={`search-overlay ${searchOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!searchOpen}
      >
        <div className="search-backdrop" onClick={closeSearch} />
        <div className="search-panel">
          <div className="search-header">
            <button
              className="search-close"
              onClick={closeSearch}
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-field">
              <span className="search-icon" aria-hidden="true">
                <Search size={18} />
              </span>
              <input
                ref={searchRef}
                type="text"
                list="site-search-suggestions"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for orthodontics, whitening, hygiene..."
                autoComplete="on"
                spellCheck={false}
              />
              <button className="search-submit" type="submit">
                Go
              </button>
            </div>
            <datalist id="site-search-suggestions">
              {searchItems.map((item) => (
                <option key={item.label} value={item.label} />
              ))}
            </datalist>
          </form>
          <p className="search-hint">
            Start typing for autofill, then press Enter to open the best match.
          </p>
          <div className="search-suggestions">
            {searchMatches.length > 0 ? (
              searchMatches.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => commitSearch(item)}
                >
                  {item.label}
                </button>
              ))
            ) : (
              <span className="search-empty">No matching results found.</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}





