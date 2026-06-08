import { useState } from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '../../contexts/AuthContext'
import ConfirmModal from '../ui/ConfirmModal'

export default function Sidebar({ panels, activePanel, onPanelChange, brandText = 'PowerCalc', brandSub = 'Gestión Energética' }) {
  const { logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-top">
            <div className="brand-icon">⚡</div>
            <h2>{brandText}</h2>
          </div>
          <span className="brand-sub">{brandSub}</span>
        </div>
        <ul className="sidebar-menu">
          {panels.map((p) => (
            <li key={p.id}>
              <a className={activePanel === p.id ? 'active' : ''} onClick={() => onPanelChange(p.id)}>
                {p.icon} {p.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={() => setShowLogoutModal(true)}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <ConfirmModal
        open={showLogoutModal}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar la sesión actual?"
        confirmLabel="Cerrar Sesión"
        variant="danger"
        onConfirm={() => { setShowLogoutModal(false); logout() }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  )
}

Sidebar.propTypes = {
  panels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
  })).isRequired,
  activePanel: PropTypes.string.isRequired,
  onPanelChange: PropTypes.func.isRequired,
  brandText: PropTypes.string,
  brandSub: PropTypes.string,
}
