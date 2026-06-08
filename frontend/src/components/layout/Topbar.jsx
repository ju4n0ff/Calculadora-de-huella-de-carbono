import PropTypes from 'prop-types'

export default function Topbar({ title, userName, avatarIcon = '⚡' }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>{title}</h2>
      </div>
      <div className="user-profile">
        <span>{userName}</span>
        <div className="user-avatar">{avatarIcon}</div>
      </div>
    </header>
  )
}

Topbar.propTypes = {
  title: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  avatarIcon: PropTypes.string,
}
