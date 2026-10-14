function ItemCard({ item, onEdit, onDelete }) {
  return (
    <article className="item-card">
      <div className="item-card-heading">
        <h3>{item.name}</h3>
        <div className="item-card-actions">
          <span className="item-category">{item.category}</span>
          <button
            className="item-edit-button"
            type="button"
            aria-label={`Edit ${item.name}`}
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="item-delete-button"
            type="button"
            aria-label={`Delete ${item.name}`}
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
      <dl className="item-details">
        <div>
          <dt>Location</dt>
          <dd>{item.location}</dd>
        </div>
        <div>
          <dt>Quantity</dt>
          <dd>{item.quantity}</dd>
        </div>
      </dl>
    </article>
  )
}

export default ItemCard
