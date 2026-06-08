import PropTypes from 'prop-types'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout({ panels, activePanel, onPanelChange, title, userName, avatarIcon, brandText, brandSub, children }) {
  return (
    <div className="app-layout">
      <Sidebar
        panels={panels}
        activePanel={activePanel}
        onPanelChange={onPanelChange}
        brandText={brandText}
        brandSub={brandSub}
      />
      <main className="main-workspace">
        <Topbar title={title} userName={userName} avatarIcon={avatarIcon} />
        {children}
      </main>
    </div>
  )
}

AppLayout.propTypes = {
  panels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
  })).isRequired,
  activePanel: PropTypes.string.isRequired,
  onPanelChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  avatarIcon: PropTypes.string,
  brandText: PropTypes.string,
  brandSub: PropTypes.string,
  children: PropTypes.node,
}
