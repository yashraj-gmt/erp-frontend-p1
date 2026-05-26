// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, ShieldCheck,
  ChevronLeft, ChevronRight, LogOut, User,
} from 'lucide-react'
import { useUIStore }     from '@/store/uiStore'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth }        from '@/hooks/useAuth'
import { ROUTES }         from '@/constants/routes'
import { ROLE_LABELS }    from '@/constants/roles'
import { cn }             from '@/utils/cn'
import { ENV }            from '@/config/env'

// Profile lives in the bottom section, not in the main nav list
const NAV_ITEMS = [
  { label: 'Dashboard',  icon: LayoutDashboard, route: ROUTES.DASHBOARD },
  { label: 'Products',   icon: Package,          route: ROUTES.PRODUCTS },
  { label: 'Categories', icon: Tag,              route: ROUTES.CATEGORIES },
  { label: 'Roles',      icon: ShieldCheck,      route: ROUTES.ROLES },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore()
  const { canAccess } = usePermissions()
  const { user, logout } = useAuth()

  // Shared class builder — uses .sidebar-link (defined in index.css)
  // "active" class triggers the active CSS rule automatically via NavLink
  const navLinkClass = ({ isActive }) =>
    cn(
      'sidebar-link flex items-center py-2.5 rounded-lg text-sm w-full',
      sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
      isActive && 'active'
    )

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-full flex flex-col z-50 transition-all duration-300',
        // Mobile: slide in/out; desktop: always visible
        'lg:translate-x-0',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
      style={{
        width:      sidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)',
        background: 'var(--color-sidebar-bg)',
      }}
    >
      {/* ── Logo / collapse toggle ───────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 h-16 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        {!sidebarCollapsed && (
          <span
            className="font-bold text-lg tracking-tight truncate pr-2"
            style={{ color: 'var(--color-text-inverse)' }}
          >
            {ENV.APP_NAME}
          </span>
        )}

        {/* Desktop — collapse toggle */}
        <button
          onClick={toggleCollapsed}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'sidebar-icon-btn hidden lg:flex p-1.5 rounded-md shrink-0',
            sidebarCollapsed ? 'mx-auto' : 'ml-auto'
          )}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Mobile — close button */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close menu"
          className="sidebar-icon-btn lg:hidden ml-auto p-1.5 rounded-md shrink-0"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* ── Main Navigation ──────────────────────────────────────────────── */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.filter((item) => canAccess(item.route)).map(({ label, icon: Icon, route }) => (
          <NavLink
            key={route}
            to={route}
            className={navLinkClass}
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!sidebarCollapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom: Profile + Logout ─────────────────────────────────────── */}
      <div
        className="p-2 space-y-1 shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Profile link */}
        {canAccess(ROUTES.PROFILE) && (
          <NavLink
            to={ROUTES.PROFILE}
            className={navLinkClass}
            title={sidebarCollapsed ? (user?.fullName ?? 'Profile') : undefined}
          >
            {/* Avatar circle */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(37,99,235,0.20)',   /* --color-primary at 20% */
                border:     '1px solid rgba(37,99,235,0.40)',
              }}
            >
              <User size={14} style={{ color: 'var(--color-accent-light)' }} />
            </div>

            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p
                  className="text-sm font-medium leading-none truncate"
                  style={{ color: 'var(--color-text-inverse)' }}
                >
                  {user?.fullName}
                </p>
                <p
                  className="text-xs mt-0.5 truncate"
                  style={{ color: 'var(--color-sidebar-text)' }}
                >
                  {ROLE_LABELS[user?.role] ?? user?.role}
                </p>
              </div>
            )}
          </NavLink>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          title={sidebarCollapsed ? 'Logout' : undefined}
          className={cn(
            'sidebar-logout flex items-center py-2.5 rounded-lg text-sm w-full',
            sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}