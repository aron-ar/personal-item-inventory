import ItemCard from './ItemCard.jsx'

function ItemList({ items, onEditItem, onDeleteItem }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-illustration" aria-hidden="true">
          <svg viewBox="0 0 80 80" fill="none">
            <path d="m14 28 26-14 26 14v28L40 70 14 56V28Z" />
            <path d="m15 28 25 14 25-14M40 42v27M27 21l26 15" />
            <path d="M31 49h18" />
          </svg>
        </div>
        <h3>Your inventory starts here</h3>
        <p>
          This is your space for the things you own. Your collection will take
          shape here as you add your items.
        </p>
      </div>
    )
  }

  return (
    <div className="item-list" aria-label="Inventory items">
      {items.map((item) => (
        <ItemCard
          item={item}
          key={item.id}
          onEdit={() => onEditItem(item.id)}
          onDelete={() => onDeleteItem(item)}
        />
      ))}
    </div>
  )
}

export default ItemList
