import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  Calculator,
  ChefHat,
  ChevronDown,
  Coffee,
  CreditCard,
  FileSpreadsheet,
  LayoutDashboard,
  Menu,
  PieChart,
  Plug,
  ShoppingCart,
  Sparkles,
  Store,
  Table2,
  TrendingUp,
  Upload,
  Users,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from "lucide-react";
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
    iconBg: "#E8F7ED",
    iconColor: "#16A34A",
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
    iconBg: "rgba(255, 255, 255, 0.08)",
    iconColor: "#4ADE80",
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

type MegaLink = { label: string; href: string; icon: LucideIcon };
type MegaColumn = { title: string; href: string; links: MegaLink[] };
type NavItem = { label: string; href: string } | { label: string; mega: MegaColumn[] };

/* Marketing IA. The /product, /solutions, /integrations, /pricing, /resources
   and /company routes don't exist yet — these links are the target structure
   and 404 until those pages land. */
const defaultLinks: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Product",
    mega: [
      {
        title: "Analytics",
        href: "/product",
        links: [
          { label: "Dashboard", href: "/product/dashboard", icon: LayoutDashboard },
          { label: "Sales Analytics", href: "/product/sales-analytics", icon: TrendingUp },
          { label: "Branch Performance", href: "/product/branch-performance", icon: BarChart3 },
          { label: "Alerts & Insights", href: "/product/alerts-insights", icon: Bell },
          { label: "Data Upload", href: "/product/data-upload", icon: Upload },
        ],
      },
      {
        title: "Intelligence",
        href: "/product",
        links: [
          {
            label: "Inventory Intelligence",
            href: "/product/inventory-intelligence",
            icon: Boxes,
          },
          { label: "Food Cost Analysis", href: "/product/food-cost-analysis", icon: PieChart },
          { label: "Menu Performance", href: "/product/menu-performance", icon: UtensilsCrossed },
          {
            label: "Purchase Suggestions",
            href: "/product/purchase-suggestions",
            icon: ShoppingCart,
          },
          { label: "PlatePilot AI", href: "/product/ai", icon: Sparkles },
        ],
      },
      {
        title: "Solutions",
        href: "/solutions",
        links: [
          { label: "Multi-Branch Restaurants", href: "/solutions/multi-branch", icon: Building2 },
          { label: "Independent Restaurants", href: "/solutions/independent", icon: Store },
          { label: "Cafes", href: "/solutions/cafes", icon: Coffee },
          { label: "Cloud Kitchens", href: "/solutions/cloud-kitchens", icon: ChefHat },
          { label: "Restaurant Groups", href: "/solutions/restaurant-groups", icon: Users },
        ],
      },
      {
        title: "Integrations",
        href: "/integrations",
        links: [
          { label: "POS Systems", href: "/integrations#pos-systems", icon: CreditCard },
          { label: "Tally", href: "/integrations#tally", icon: BookOpen },
          { label: "CSV Upload", href: "/integrations#csv-upload", icon: FileSpreadsheet },
          { label: "Excel Upload", href: "/integrations#excel-upload", icon: Table2 },
          {
            label: "Accounting Systems",
            href: "/integrations#accounting-systems",
            icon: Calculator,
          },
          { label: "API Integrations", href: "/integrations#api-integrations", icon: Plug },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Company", href: "/company" },
];

type AgorixNavProps = {
  links?: NavItem[];
  insetClass?: string;
  sticky?: boolean;
  /** Landing uses light; Demo stays dark. */
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
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const mobileLink = (item: { label: string; href: string }) =>
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
    );

  return (
    <>
      <style>{`
        /* Same container geometry as .sw-section / .agorix-hero__inset so the
           logo and buttons line up with the hero copy and every section below */
        .agorix-nav__inset {
          max-width: 1280px;
          margin-inline: auto;
          padding-inline: clamp(20px, 3vw, 40px);
        }
        /* The trigger stays position:static so the panel's containing block is
           the header — that's what lets it span the full content column
           instead of hanging off the trigger. */
        .agorix-nav__item {
          position: static;
        }
        .agorix-nav__trigger {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 0;
          background: none;
          border: none;
          color: inherit;
          font: inherit;
          line-height: 1;
          cursor: pointer;
        }
        .agorix-nav__chevron {
          transition: transform 0.2s ease;
        }
        .agorix-nav__trigger[aria-expanded="true"] .agorix-nav__chevron {
          transform: rotate(180deg);
        }
        .agorix-nav__mega {
          position: absolute;
          top: 100%;
          left: clamp(20px, 3vw, 40px);
          right: clamp(20px, 3vw, 40px);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          padding: 6px;
          background: ${T.dropdownBg};
          border: 1px solid ${T.dropdownBorder};
          border-radius: 18px;
          box-shadow: 0 24px 60px rgba(7, 26, 20, 0.14);
          z-index: 70;
        }
        .agorix-nav__mega-col {
          display: flex;
          flex-direction: column;
          padding: 26px 22px 30px;
        }
        .agorix-nav__mega-col + .agorix-nav__mega-col {
          border-left: 1px solid ${T.dropdownBorder};
        }
        .agorix-nav__mega-title {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          font-size: 0.95rem;
          font-weight: 600;
          color: ${T.text};
          text-decoration: none;
        }
        .agorix-nav__mega-title svg {
          transition: transform 0.2s ease;
        }
        .agorix-nav__mega-title:hover svg {
          transform: translateX(3px);
        }
        .agorix-nav__mega-link {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 7px 10px;
          margin-inline: -10px;
          border-radius: 10px;
          font-size: 0.85rem;
          line-height: 1.35;
          color: ${T.dropdownItem};
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .agorix-nav__mega-link:hover {
          background: ${T.dropdownHover};
          color: ${T.text};
        }
        .agorix-nav__mega-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: ${T.iconBg};
          color: ${T.iconColor};
        }
        .agorix-nav__toggle {
          display: none;
        }
        .agorix-nav__mobile-panel {
          display: none;
        }
        /* 1100px, not 900 — seven top-level items plus the logo and both
           buttons stop fitting on one row well before the old breakpoint */
        @media (max-width: 1100px) {
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
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }
        .agorix-nav__mobile-group {
          padding: 1.1rem 0.25rem 0.4rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${T.nav};
          opacity: 0.7;
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
            gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
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
              if ("mega" in item) {
                const open = openDropdown === item.label;
                return (
                  <div key={item.label} className="agorix-nav__item">
                    <button
                      type="button"
                      className="agorix-nav__trigger"
                      onClick={() => setOpenDropdown(open ? null : item.label)}
                      aria-haspopup="true"
                      aria-expanded={open}
                    >
                      {item.label}
                      <ChevronDown className="agorix-nav__chevron" size={15} strokeWidth={2.2} />
                    </button>
                    {open && (
                      <div className="agorix-nav__mega">
                        {item.mega.map((col) => (
                          <div key={col.title} className="agorix-nav__mega-col">
                            <Link
                              to={col.href}
                              className="agorix-nav__mega-title"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {col.title}
                              <ArrowRight size={15} strokeWidth={2.2} />
                            </Link>
                            {col.links.map(({ label, href, icon: Icon }) => (
                              <Link
                                key={label}
                                to={href}
                                className="agorix-nav__mega-link"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <span className="agorix-nav__mega-icon">
                                  <Icon size={16} strokeWidth={2} />
                                </span>
                                {label}
                              </Link>
                            ))}
                          </div>
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
              <a
                href="/login"
                style={btnSolidSm}
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
          {links.map((item) =>
            "mega" in item
              ? item.mega.map((col) => (
                  <div key={col.title} style={{ display: "flex", flexDirection: "column" }}>
                    <div className="agorix-nav__mobile-group">{col.title}</div>
                    {col.links.map(mobileLink)}
                  </div>
                ))
              : mobileLink(item),
          )}
          <div className="agorix-nav__mobile-buttons">
            <a href="/demo" style={btnOutlineSm} onClick={() => setMobileOpen(false)}>
              Get Demo
            </a>
            <a
              href="/login"
              style={btnSolidSm}
              onClick={() => setMobileOpen(false)}
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
