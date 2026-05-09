import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

// --- ICONS (inline SVGs — no extra library needed) ---
const Icons = {
  Logo: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#6366F1" />
      <text x="14" y="20" textAnchor="middle" fontFamily="'Sora', 'Segoe UI', sans-serif" fontSize="16" fontWeight="600" fill="white">P</text>
    </svg>
  ),
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Sales: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  Agents: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
    </svg>
  ),
  Reports: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Status: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Dot: () => (
    <svg width="6" height="6" viewBox="0 0 6 6">
      <circle cx="3" cy="3" r="3" fill="currentColor" />
    </svg>
  ),
};

// --- NAV ITEMS ---
const navItems = [
  { to: "/",                label: "Leads",          Icon: Icons.Dashboard, badge: null },
  { to: "/sales-agent-view",label: "Sales",          Icon: Icons.Sales,     badge: null },
  { to: "/agents",          label: "Agents",         Icon: Icons.Agents,    badge: null },
  { to: "/reports",         label: "Reports",        Icon: Icons.Reports,   badge: "New" },
  { to: "/status-view",     label: "Lead Status",    Icon: Icons.Status,    badge: null },
];

// --- SIDEBAR COMPONENT ---
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const close = () => setIsOpen(false);

  return (
    <>
      {/* ── Mobile hamburger button ── */}
      <button
        className="prayas-hamburger"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation"
      >
        <Icons.Menu />
      </button>

      {/* ── Backdrop ── */}
      {isOpen && (
        <div className="prayas-backdrop" onClick={close} aria-hidden="true" />
      )}

      {/* ── Sidebar ── */}
      <aside className={`prayas-sidebar ${isOpen ? "prayas-sidebar--open" : ""}`}>

        {/* Top: Logo + Brand */}
        <div className="prayas-sidebar__header">
          <div className="prayas-sidebar__brand">
            <Icons.Logo />
            <div className="prayas-sidebar__brand-text">
              <span className="prayas-sidebar__brand-name">Prayas</span>
              <span className="prayas-sidebar__brand-sub">CRM Platform</span>
            </div>
          </div>
          <button className="prayas-sidebar__close d-md-none" onClick={close} aria-label="Close navigation">
            <Icons.Close />
          </button>
        </div>

        {/* Section label */}
        <div className="prayas-sidebar__section-label">Main Menu</div>

        {/* Nav links */}
        <nav className="prayas-sidebar__nav">
          {navItems.map(({ to, label, Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `prayas-nav-item ${isActive ? "prayas-nav-item--active" : ""}`
              }
              onClick={close}
            >
              <span className="prayas-nav-item__icon">
                <Icon />
              </span>
              <span className="prayas-nav-item__label">{label}</span>
              {badge && (
                <span className="prayas-nav-item__badge">{badge}</span>
              )}
              {/* Active indicator dot */}
              <span className="prayas-nav-item__dot" aria-hidden="true">
                <Icons.Dot />
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom: User / Status card */}
        <div className="prayas-sidebar__footer">
          <div className="prayas-sidebar__status-dot" aria-hidden="true" />
          <div className="prayas-sidebar__footer-text">
            <span className="prayas-sidebar__footer-name">Admin</span>
            <span className="prayas-sidebar__footer-role">System Administrator</span>
          </div>
        </div>
      </aside>

      {/* ── CSS ── */}
      <style>{`
        /* ─── Design tokens ─── */
        :root {
          --prayas-sidebar-w: 240px;
          --prayas-bg:        #0f1117;
          --prayas-bg2:       #1a1d27;
          --prayas-accent:    #6366f1;
          --prayas-accent-dim:#6366f122;
          --prayas-text:      #f1f2f5;
          --prayas-muted:     #7a7f96;
          --prayas-border:    rgba(255,255,255,0.07);
          --prayas-hover:     rgba(255,255,255,0.05);
          --prayas-radius:    10px;
          --prayas-font:      'Sora', 'Segoe UI', sans-serif;
        }

        /* ─── Google Font (Sora) ─── */
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');

        /* ─── Hamburger (mobile only) ─── */
        .prayas-hamburger {
          display: none;
          position: fixed;
          top: 14px;
          left: 14px;
          z-index: 1100;
          background: var(--prayas-bg);
          border: 1px solid var(--prayas-border);
          border-radius: 8px;
          color: var(--prayas-text);
          padding: 8px;
          cursor: pointer;
          line-height: 0;
          transition: background 0.2s;
        }
        .prayas-hamburger:hover { background: var(--prayas-bg2); }

        /* ─── Backdrop ─── */
        .prayas-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 1090;
          backdrop-filter: blur(2px);
        }

        /* ─── Sidebar shell ─── */
        .prayas-sidebar {
          width: var(--prayas-sidebar-w);
          min-width: var(--prayas-sidebar-w);
          height: 100vh;
          position: sticky;
          top: 0;
          background: var(--prayas-bg);
          border-right: 1px solid var(--prayas-border);
          display: flex;
          flex-direction: column;
          font-family: var(--prayas-font);
          overflow: hidden;
          flex-shrink: 0;
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ─── Header ─── */
        .prayas-sidebar__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 16px 16px;
          border-bottom: 1px solid var(--prayas-border);
        }
        .prayas-sidebar__brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .prayas-sidebar__brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .prayas-sidebar__brand-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--prayas-text);
          letter-spacing: -0.01em;
        }
        .prayas-sidebar__brand-sub {
          font-size: 10px;
          color: var(--prayas-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 500;
        }
        .prayas-sidebar__close {
          background: transparent;
          border: none;
          color: var(--prayas-muted);
          cursor: pointer;
          padding: 4px;
          line-height: 0;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
        .prayas-sidebar__close:hover {
          color: var(--prayas-text);
          background: var(--prayas-hover);
        }

        /* ─── Section label ─── */
        .prayas-sidebar__section-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--prayas-muted);
          padding: 20px 20px 8px;
        }

        /* ─── Nav ─── */
        .prayas-sidebar__nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 10px;
          overflow-y: auto;
        }
        .prayas-sidebar__nav::-webkit-scrollbar { width: 4px; }
        .prayas-sidebar__nav::-webkit-scrollbar-track { background: transparent; }
        .prayas-sidebar__nav::-webkit-scrollbar-thumb { background: var(--prayas-border); border-radius: 4px; }

        /* ─── Nav item ─── */
        .prayas-nav-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 12px;
          border-radius: var(--prayas-radius);
          text-decoration: none;
          color: var(--prayas-muted);
          font-size: 13.5px;
          font-weight: 500;
          position: relative;
          transition: color 0.18s, background 0.18s;
          cursor: pointer;
        }
        .prayas-nav-item:hover {
          color: var(--prayas-text);
          background: var(--prayas-hover);
          text-decoration: none;
        }
        .prayas-nav-item--active {
          color: var(--prayas-text);
          background: var(--prayas-accent-dim);
        }
        .prayas-nav-item--active .prayas-nav-item__icon {
          color: var(--prayas-accent);
        }

        .prayas-nav-item__icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          transition: color 0.18s;
        }
        .prayas-nav-item__label {
          flex: 1;
        }

        /* Active dot (right side) */
        .prayas-nav-item__dot {
          display: none;
          color: var(--prayas-accent);
          flex-shrink: 0;
        }
        .prayas-nav-item--active .prayas-nav-item__dot {
          display: flex;
        }

        /* Badge (e.g. "New") */
        .prayas-nav-item__badge {
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          background: var(--prayas-accent);
          color: #fff;
          padding: 2px 7px;
          border-radius: 20px;
          text-transform: uppercase;
        }

        /* ─── Accent left bar on active ─── */
        .prayas-nav-item--active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 3px;
          background: var(--prayas-accent);
          border-radius: 0 3px 3px 0;
        }

        /* ─── Footer user card ─── */
        .prayas-sidebar__footer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px;
          margin: 8px 10px 12px;
          border-radius: var(--prayas-radius);
          background: var(--prayas-bg2);
          border: 1px solid var(--prayas-border);
        }
        .prayas-sidebar__status-dot {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 50%;
          background: var(--prayas-accent-dim);
          border: 1.5px solid var(--prayas-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .prayas-sidebar__status-dot::after {
          content: 'A';
          font-size: 13px;
          font-weight: 600;
          color: var(--prayas-accent);
          font-family: var(--prayas-font);
        }
        .prayas-sidebar__status-dot::before {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 9px;
          height: 9px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid var(--prayas-bg);
        }
        .prayas-sidebar__footer-text {
          display: flex;
          flex-direction: column;
          line-height: 1.3;
          overflow: hidden;
        }
        .prayas-sidebar__footer-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--prayas-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .prayas-sidebar__footer-role {
          font-size: 11px;
          color: var(--prayas-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ─── Mobile responsive ─── */
        @media (max-width: 767px) {
          .prayas-hamburger {
            display: flex;
          }
          .prayas-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1100;
            transform: translateX(-100%);
          }
          .prayas-sidebar--open {
            transform: translateX(0);
          }
          .main-content {
            padding-top: 60px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;