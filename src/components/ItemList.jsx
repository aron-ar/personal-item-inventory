import ItemCard from './ItemCard.jsx'

function ItemList({
  items,
  searchQuery,
  onSearchQueryChange,
  categories,
  selectedCategory,
  onSelectedCategoryChange,
  locations,
  selectedLocation,
  onSelectedLocationChange,
  onViewItem,
  onEditItem,
  onDeleteItem,
}) {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const matchingItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(normalizedQuery) &&
      (selectedCategory === '' || item.category === selectedCategory) &&
      (selectedLocation === '' || item.location === selectedLocation),
  )
  const activeFilters = [
    normalizedQuery ? `name “${searchQuery}”` : '',
    selectedCategory ? `category ${selectedCategory}` : '',
    selectedLocation ? `location ${selectedLocation}` : '',
  ].filter(Boolean)
  const noResultsMessage = `No items match ${activeFilters.join(
    ', ',
  )}. Try different filters or clear them.`

  return (
    <>
      <div className="item-filters">
        <SearchField
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
        />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectedCategoryChange={onSelectedCategoryChange}
        />
        <LocationFilter
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectedLocationChange={onSelectedLocationChange}
        />
      </div>
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
          <p>{noResultsMessage}</p>
        </div>
      ) : (
        <div className="item-list" aria-label="Inventory items">
          {matchingItems.map((item) => (
            <ItemCard
              item={item}
              key={item.id}
              onView={() => onViewItem(item.id)}
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
    <div className="item-filter-field">
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

function CategoryFilter({
  categories,
  selectedCategory,
  onSelectedCategoryChange,
}) {
  return (
    <div className="item-filter-field">
      <label htmlFor="item-category-filter">Filter by category</label>
      <select
        id="item-category-filter"
        value={selectedCategory}
        onChange={(event) => onSelectedCategoryChange(event.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  )
}

function LocationFilter({
  locations,
  selectedLocation,
  onSelectedLocationChange,
}) {
  return (
    <div className="item-filter-field">
      <label htmlFor="item-location-filter">Filter by location</label>
      <select
        id="item-location-filter"
        value={selectedLocation}
        onChange={(event) => onSelectedLocationChange(event.target.value)}
      >
        <option value="">All locations</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ItemList
