import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

/* ── Icons ── */
const Icons = {
  Logo: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#6366F1" />
      <text x="14" y="20" textAnchor="middle" fontFamily="'Sora','Segoe UI',sans-serif" fontSize="16" fontWeight="600" fill="white">P</text>
    </svg>
  ),
  Dashboard: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  Sales: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  Agents: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/>
    </svg>
  ),
  Reports: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Status: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Close: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Sun: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Dot: () => (
    <svg width="6" height="6" viewBox="0 0 6 6">
      <circle cx="3" cy="3" r="3" fill="currentColor"/>
    </svg>
  ),
};

const navItems = [
  { to: "/",                 label: "Leads",       Icon: Icons.Dashboard, badge: null  },
  { to: "/sales-agent-view", label: "Sales",       Icon: Icons.Sales,     badge: null  },
  { to: "/agents",           label: "Agents",      Icon: Icons.Agents,    badge: null  },
  { to: "/reports",          label: "Reports",     Icon: Icons.Reports,   badge: "New" },
  { to: "/status-view",      label: "Lead Status", Icon: Icons.Status,    badge: null  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const close = () => setIsOpen(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button className="psb-hamburger" onClick={() => setIsOpen(true)} aria-label="Open navigation">
        <Icons.Menu />
      </button>

      {/* Backdrop */}
      {isOpen && <div className="psb-backdrop" onClick={close} aria-hidden="true" />}

      {/* Sidebar */}
      <aside className={`psb-sidebar ${isOpen ? "psb-sidebar--open" : ""}`}>

        {/* Header */}
        <div className="psb-header">
          <div className="psb-brand">
            <Icons.Logo />
            <div className="psb-brand-text">
              <span className="psb-brand-name">Prayas</span>
              <span className="psb-brand-sub">CRM Platform</span>
            </div>
          </div>
          <button className="psb-close psb-mobile-only" onClick={close} aria-label="Close">
            <Icons.Close />
          </button>
        </div>

        {/* Section label */}
        <div className="psb-section-label">Main Menu</div>

        {/* Nav links */}
        <nav className="psb-nav">
          {navItems.map(({ to, label, Icon, badge }) => (
            <NavLink
              key={to} to={to} end={to === "/"}
              className={({ isActive }) => `psb-item ${isActive ? "psb-item--active" : ""}`}
              onClick={close}
            >
              <span className="psb-item-icon"><Icon /></span>
              <span className="psb-item-label">{label}</span>
              {badge && <span className="psb-item-badge">{badge}</span>}
              <span className="psb-item-dot" aria-hidden="true"><Icons.Dot /></span>
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle */}
        <div className="psb-theme-wrap">
          <button className="psb-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="psb-theme-track">
              <span className={`psb-theme-thumb ${isDark ? "psb-thumb-right" : "psb-thumb-left"}`}>
                {isDark ? <Icons.Moon /> : <Icons.Sun />}
              </span>
            </span>
            <span className="psb-theme-label">
              {isDark ? "Dark Mode" : "Light Mode"}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="psb-footer">
          <div className="psb-avatar">A</div>
          <div className="psb-footer-text">
            <span className="psb-footer-name">Admin</span>
            <span className="psb-footer-role">System Administrator</span>
          </div>
        </div>
      </aside>

      <style>{`
        .psb-sidebar {
          width: 240px; min-width: 240px; height: 100vh;
          position: sticky; top: 0;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          font-family: 'Sora','Segoe UI',sans-serif;
          overflow: hidden; flex-shrink: 0;
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1), background 0.25s, border-color 0.25s;
        }
        .psb-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 16px 16px; border-bottom: 1px solid var(--border);
          transition: border-color 0.25s;
        }
        .psb-brand { display: flex; align-items: center; gap: 10px; }
        .psb-brand-text { display: flex; flex-direction: column; line-height: 1.2; }
        .psb-brand-name { font-size: 15px; font-weight: 600; color: var(--text); letter-spacing: -0.01em; transition: color 0.25s; }
        .psb-brand-sub  { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500; }
        .psb-close { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; line-height: 0; border-radius: 6px; transition: color 0.15s, background 0.15s; }
        .psb-close:hover { color: var(--text); background: var(--hover); }

        .psb-section-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); padding: 20px 20px 8px; }

        .psb-nav { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: 0 10px; overflow-y: auto; }
        .psb-nav::-webkit-scrollbar { width: 4px; }
        .psb-nav::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        .psb-item {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px; border-radius: 10px;
          text-decoration: none; color: var(--text-muted);
          font-size: 13.5px; font-weight: 500; position: relative;
          transition: color 0.18s, background 0.18s;
        }
        .psb-item:hover { color: var(--text); background: var(--hover); text-decoration: none; }
        .psb-item--active { color: var(--text); background: var(--accent-dim); }
        .psb-item--active .psb-item-icon { color: var(--accent); }
        .psb-item--active::before { content: ''; position: absolute; left: 0; top: 20%; height: 60%; width: 3px; background: var(--accent); border-radius: 0 3px 3px 0; }
        .psb-item-icon { display: flex; align-items: center; flex-shrink: 0; transition: color 0.18s; }
        .psb-item-label { flex: 1; }
        .psb-item-dot { display: none; color: var(--accent); flex-shrink: 0; }
        .psb-item--active .psb-item-dot { display: flex; }
        .psb-item-badge { font-size: 9.5px; font-weight: 600; letter-spacing: 0.04em; background: var(--accent); color: #fff; padding: 2px 7px; border-radius: 20px; text-transform: uppercase; }

        /* Theme toggle */
        .psb-theme-wrap { padding: 6px 10px; }
        .psb-theme-btn {
          width: 100%; display: flex; align-items: center; gap: 10px;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 10px; padding: 9px 12px; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .psb-theme-btn:hover { border-color: var(--accent); }
        .psb-theme-track {
          width: 36px; height: 20px; background: var(--accent-dim);
          border: 1.5px solid var(--accent); border-radius: 20px;
          position: relative; flex-shrink: 0;
        }
        .psb-theme-thumb {
          position: absolute; top: 1px;
          width: 16px; height: 16px; border-radius: 50%;
          background: var(--accent); color: white;
          display: flex; align-items: center; justify-content: center;
          transition: left 0.22s cubic-bezier(0.4,0,0.2,1);
        }
        .psb-thumb-left  { left: 1px; }
        .psb-thumb-right { left: 17px; }
        .psb-theme-label { font-size: 13px; font-weight: 500; color: var(--text-muted); font-family: 'Sora',sans-serif; }

        /* Footer */
        .psb-footer {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px; margin: 4px 10px 12px;
          border-radius: 10px; background: var(--surface2);
          border: 1px solid var(--border);
          transition: background 0.25s, border-color 0.25s;
        }
        .psb-avatar {
          width: 32px; height: 32px; min-width: 32px; border-radius: 50%;
          background: var(--accent-dim); border: 1.5px solid var(--accent);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600; color: var(--accent);
          font-family: 'Sora',sans-serif; position: relative; flex-shrink: 0;
        }
        .psb-avatar::after {
          content: ''; position: absolute; bottom: 0; right: 0;
          width: 9px; height: 9px; background: #22c55e;
          border-radius: 50%; border: 2px solid var(--surface2);
        }
        .psb-footer-text { display: flex; flex-direction: column; line-height: 1.3; overflow: hidden; }
        .psb-footer-name { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.25s; }
        .psb-footer-role { font-size: 11px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* Hamburger */
        .psb-hamburger {
          display: none; position: fixed; top: 14px; left: 14px; z-index: 1100;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; color: var(--text); padding: 8px;
          cursor: pointer; line-height: 0; transition: background 0.2s;
        }
        .psb-hamburger:hover { background: var(--surface2); }

        /* Backdrop */
        .psb-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 1090; backdrop-filter: blur(2px); }

        /* Mobile */
        @media (max-width: 767px) {
          .psb-hamburger { display: flex; }
          .psb-sidebar { position: fixed; top: 0; left: 0; z-index: 1100; transform: translateX(-100%); }
          .psb-sidebar--open { transform: translateX(0); }
          .psb-mobile-only { display: flex !important; }
          .main-content { padding-top: 60px; }
        }
        @media (min-width: 768px) {
          .psb-mobile-only { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;