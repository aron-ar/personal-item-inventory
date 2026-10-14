function ItemCard({ item }) {
  return (
    <article className="item-card">
      <div className="item-card-heading">
        <h3>{item.name}</h3>
        <span className="item-category">{item.category}</span>
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
