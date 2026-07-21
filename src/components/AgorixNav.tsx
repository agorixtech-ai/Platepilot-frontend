import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { LOGO_ALT, LOGO_SRC } from "@/components/AppLogo";

const themes = {
  light: {
    bg: "#F6FAF7",
    ink: "#FFFFFF",
    text: "#152019",
    nav: "#66736B",
    border: "rgba(21,32,25,0.1)",
    borderStrong: "rgba(21,32,25,0.2)",
    dropdownBg: "#FFFFFF",
    dropdownBorder: "#DDE7E1",
    dropdownItem: "#152019",
    dropdownHover: "#E8F7ED",
    solidBg: "#16A34A",
    solidHover: "#15803D",
    solidColor: "#FFFFFF",
  },
  dark: {
    bg: "#071A14",
    ink: "#FFFFFF",
    text: "#fff",
    nav: "rgba(255,255,255,0.72)",
    border: "rgba(255,255,255,0.08)",
    borderStrong: "rgba(255,255,255,0.22)",
    dropdownBg: "rgba(17, 17, 19, 0.96)",
    dropdownBorder: "rgba(255, 255, 255, 0.12)",
    dropdownItem: "rgba(255, 255, 255, 0.75)",
    dropdownHover: "rgba(255, 255, 255, 0.06)",
    solidBg: "#16A34A",
    solidHover: "#15803D",
    solidColor: "#FFFFFF",
  },
} as const;

const btnBase = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
  textDecoration: "none",
  lineHeight: 1,
  whiteSpace: "nowrap" as const,
};

type NavItem =
  | { label: string; href: string }
  | { label: string; dropdown: { label: string; href: string }[] };

const productDropdown = [{ label: "Restaurant IQ", href: "/restaurant-iq" }];

const defaultLinks: NavItem[] = [
  { label: "Product", dropdown: productDropdown },
  { label: "Pricing", href: "/#contact" },
];

type AgorixNavProps = {
  links?: NavItem[];
  insetClass?: string;
  sticky?: boolean;
  /** Landing uses light; RestaurantIQ/Demo stay dark. */
  variant?: "light" | "dark";
};

export function AgorixNav({
  links = defaultLinks,
  insetClass = "agorix-nav__inset",
  sticky = false,
  variant = "light",
}: AgorixNavProps) {
  const T = themes[variant];
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const btnOutlineSm = {
    ...btnBase,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.06em",
    height: 40,
    padding: "0 18px",
    color: "#16A34A",
    border: "1px solid #16A34A",
    borderRadius: 12,
    background: "#FFFFFF",
  };

  const btnSolidSm = {
    ...btnOutlineSm,
    color: T.solidColor,
    border: "none",
    background: T.solidBg,
    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.22)",
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mobileLinks = links.flatMap((item) => ("dropdown" in item ? item.dropdown : [item]));

  return (
    <>
      <style>{`
        .agorix-nav__inset {
          max-width: 1305px;
          margin-inline: auto;
          padding-inline: clamp(20px, 3vw, 40px);
          padding-left: calc(clamp(20px, 3vw, 40px) + clamp(16px, 4vw, 72px));
        }
        .agorix-hero__inset.agorix-nav__inset {
          max-width: 1305px;
          margin-inline: auto;
          padding-inline: var(--hero-pad, clamp(20px, 3vw, 40px));
          padding-left: calc(var(--hero-pad, clamp(20px, 3vw, 40px)) + var(--hero-shift, clamp(16px, 4vw, 72px)));
        }
        .agorix-nav__item {
          position: relative;
        }
        .agorix-nav__dropdown {
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 180px;
          padding: 0.4rem 0;
          background: ${T.dropdownBg};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${T.dropdownBorder};
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(7, 26, 20, 0.12);
          z-index: 70;
        }
        .agorix-nav__dropdown-item {
          display: block;
          padding: 0.65rem 1.1rem;
          font-size: 0.82rem;
          color: ${T.dropdownItem};
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .agorix-nav__dropdown-item:hover {
          background: ${T.dropdownHover};
          color: ${T.text};
        }
        .agorix-nav__toggle {
          display: none;
        }
        .agorix-nav__mobile-panel {
          display: none;
        }
        @media (max-width: 900px) {
          .agorix-nav__links {
            display: none !important;
          }
          .agorix-nav__buttons {
            display: none !important;
          }
          .agorix-nav__toggle {
            display: inline-flex !important;
          }
          .agorix-nav__mobile-panel.open {
            display: flex;
          }
        }
        .agorix-nav__mobile-panel {
          flex-direction: column;
          gap: 4px;
          padding: 8px clamp(20px, 3vw, 40px) 20px;
          border-top: 1px solid ${T.border};
        }
        .agorix-nav__mobile-link {
          padding: 0.85rem 0.25rem;
          font-size: 0.95rem;
          color: ${T.nav};
          text-decoration: none;
          border-bottom: 1px solid ${T.border};
        }
        .agorix-nav__mobile-buttons {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }
        .agorix-nav__mobile-buttons a {
          flex: 1;
        }
      `}</style>

      <div ref={navRef}>
        <header
          className={insetClass}
          style={{
            position: sticky ? "sticky" : "relative",
            top: sticky ? 0 : undefined,
            zIndex: 50,
            paddingTop: 28,
            paddingBottom: 32,
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 24,
            background: sticky ? T.bg : undefined,
            borderBottom: sticky ? `1px solid ${T.border}` : undefined,
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              justifySelf: "start",
              textDecoration: "none",
            }}
          >
            <img
              src={LOGO_SRC}
              alt={LOGO_ALT}
              width={36}
              height={36}
              style={{ display: "block", flexShrink: 0, borderRadius: 10, objectFit: "cover" }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: ".14em",
                lineHeight: 1,
                color: T.text,
              }}
            >
              Plate Pielet
            </span>
          </Link>

          <nav
            className="agorix-nav__links"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              fontSize: 14.5,
              color: T.nav,
              justifySelf: "center",
            }}
          >
            {links.map((item) => {
              if ("dropdown" in item) {
                return (
                  <div key={item.label} className="agorix-nav__item">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown(openDropdown === item.label ? null : item.label)
                      }
                      style={{
                        cursor: "pointer",
                        lineHeight: 1,
                        background: "none",
                        border: "none",
                        color: "inherit",
                        font: "inherit",
                        padding: 0,
                      }}
                    >
                      {item.label}
                    </button>
                    {openDropdown === item.label && (
                      <div className="agorix-nav__dropdown">
                        {item.dropdown.map((dropItem) => (
                          <Link
                            key={dropItem.label}
                            to={dropItem.href}
                            className="agorix-nav__dropdown-item"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {dropItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isHash = item.href.startsWith("#");
              if (isHash) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    style={{
                      cursor: "pointer",
                      lineHeight: 1,
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  style={{
                    cursor: "pointer",
                    lineHeight: 1,
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10, justifySelf: "end" }}>
            <div
              className="agorix-nav__buttons"
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <a href="/demo" style={btnOutlineSm}>
                Get Demo
              </a>
              <a href="/login" style={btnSolidSm}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.solidHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.solidBg;
                }}
              >
                login
              </a>
            </div>
            <button
              type="button"
              className="agorix-nav__toggle"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 9999,
                border: `1px solid ${T.borderStrong}`,
                background: "transparent",
                color: T.text,
                cursor: "pointer",
                padding: 0,
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        <div
          className={`agorix-nav__mobile-panel${mobileOpen ? " open" : ""}`}
          style={{ background: T.bg }}
        >
          {mobileLinks.map((item) =>
            item.href.startsWith("#") ? (
              <a
                key={item.label}
                href={item.href}
                className="agorix-nav__mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className="agorix-nav__mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ),
          )}
          <div className="agorix-nav__mobile-buttons">
            <a href="/demo" style={btnOutlineSm} onClick={() => setMobileOpen(false)}>
              Get Demo
            </a>
            <a href="/login" style={btnSolidSm} onClick={() => setMobileOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.solidHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.solidBg;
              }}
            >
              login
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
