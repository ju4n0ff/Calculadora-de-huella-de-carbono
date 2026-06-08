import PropTypes from 'prop-types'

export default function TerminalOutput({ text }) {
  return (
    <div>
      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ld-blue)', display: 'block', marginBottom: 8 }}>
        Terminal de Diagnóstico:
      </label>
      <div className="terminal-box">{text}</div>
    </div>
  )
}

TerminalOutput.propTypes = {
  text: PropTypes.string.isRequired,
}
