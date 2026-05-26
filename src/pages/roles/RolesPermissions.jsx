// src/pages/roles/RolesPermissions.jsx
import { ROLES, ROLE_LABELS, ROLE_COLORS } from '@/constants/roles'
import { ROUTE_PERMISSIONS } from '@/utils/permissions'
import { ROUTES } from '@/constants/routes'

const ROUTE_LABELS = {
  [ROUTES.DASHBOARD]:    'Dashboard',
  [ROUTES.PRODUCTS]:     'Products',
  [ROUTES.CATEGORIES]:   'Categories',
  [ROUTES.ROLES]:        'Roles & Permissions',
  [ROUTES.PROFILE]:      'Profile',
}

export default function RolesPermissions() {
  const roleList  = Object.values(ROLES)
  const routeList = Object.keys(ROUTE_PERMISSIONS)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
        Roles & Permissions
      </h1>

      <div className="rounded-xl overflow-auto shadow-sm"
        style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--color-surface-2)' }}>
            <tr>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                Route / Module
              </th>
              {roleList.map((role) => (
                <th key={role} className="text-center px-4 py-3 font-semibold"
                  style={{ color: 'var(--color-text-muted)' }}>
                  {ROLE_LABELS[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routeList.map((route) => (
              <tr key={route} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                <td className="px-4 py-3 font-medium">{ROUTE_LABELS[route] ?? route}</td>
                {roleList.map((role) => {
                  const allowed = ROUTE_PERMISSIONS[route]?.includes(role)
                  return (
                    <td key={role} className="px-4 py-3 text-center">
                      <span className={`inline-block w-5 h-5 rounded-full text-xs leading-5 font-bold ${
                        allowed ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {allowed ? '✓' : '—'}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}