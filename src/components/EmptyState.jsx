export function EmptyState({ icon = '🎭', title, text, action, onAction }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon">{icon}</div>
      <p className="empty-state__title">{title}</p>
      {text && <p className="empty-state__text">{text}</p>}
      {action && (
        <button className="empty-state__btn" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  )
}
