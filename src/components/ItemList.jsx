import { useState } from 'react'
import ItemCard from './ItemCard.jsx'

function ItemList({ items, onEditItem, onDeleteItem }) {
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const matchingItems = items.filter((item) =>
    item.name.toLowerCase().includes(normalizedQuery),
  )

  return (
    <>
      <SearchField
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
      {items.length === 0 ? (
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
      ) : matchingItems.length === 0 ? (
        <div className="search-empty-state" role="status">
          <h3>No results</h3>
          <p>
            No items match “{searchQuery}”. Try a different name or clear the
            search.
          </p>
        </div>
      ) : (
        <div className="item-list" aria-label="Inventory items">
          {matchingItems.map((item) => (
            <ItemCard
              item={item}
              key={item.id}
              onEdit={() => onEditItem(item.id)}
              onDelete={() => onDeleteItem(item)}
            />
          ))}
        </div>
      )}
    </>
  )
}

function SearchField({ searchQuery, onSearchQueryChange }) {
  return (
    <div className="item-search">
      <label htmlFor="item-search-input">Search items</label>
      <div className="item-search-control">
        <input
          id="item-search-input"
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search by name"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange('')}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

export default ItemList
