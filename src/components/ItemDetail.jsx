import { formatLocation } from '../models/location.js'

function ItemDetail({ item, itemId, onBack, onEdit, onDelete }) {
  if (item === null) {
    return (
      <div className="item-detail-not-found" role="status">
        <h3>Item not found</h3>
        <p>
          {`The item${itemId ? ` with ID "${itemId}"` : ''} could not be found.`}
        </p>
        <button
          className="item-form-cancel detail-back-button"
          type="button"
          onClick={onBack}
        >
          Back to inventory
        </button>
      </div>
    )
  }

  return (
    <div className="item-detail">
      <button
        className="item-form-cancel detail-back-button"
        type="button"
        onClick={onBack}
      >
        Back to inventory
      </button>

      <div className="item-detail-heading">
        <div>
          <p className="eyebrow">ITEM DETAILS</p>
          <h3>{item.name}</h3>
        </div>
      </div>

      <dl className="item-detail-fields">
        <div>
          <dt>Category</dt>
          <dd>{item.category}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>
            {formatLocation(item.locationParent, item.locationChild ?? '')}
          </dd>
        </div>
        <div>
          <dt>Quantity</dt>
          <dd>{item.quantity}</dd>
        </div>
        <div>
          <dt>ID</dt>
          <dd>{item.id}</dd>
        </div>
        {typeof item.notes === 'string' && item.notes.trim() !== '' && (
          <div className="item-detail-notes">
            <dt>Notes</dt>
            <dd>{item.notes}</dd>
          </div>
        )}
      </dl>

      <div className="item-detail-actions">
        <button
          className="item-form-submit"
          type="button"
          onClick={onEdit}
        >
          Edit item
        </button>
        <button
          className="item-delete-button"
          type="button"
          onClick={onDelete}
        >
          Delete item
        </button>
      </div>
    </div>
  )
}

export default ItemDetail
