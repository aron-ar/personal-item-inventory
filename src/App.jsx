import { useEffect, useState } from 'react'
import ItemDetail from './components/ItemDetail.jsx'
import ItemForm from './components/ItemForm.jsx'
import ItemList from './components/ItemList.jsx'
import { INVENTORY_CATEGORIES } from './constants/inventory.js'
import { useInventory } from './hooks/useInventory.js'

function App() {
  const { items, addItem, updateItem, deleteItem, getItemById } = useInventory()
  const [isItemFormOpen, setIsItemFormOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)
  const [viewingItemId, setViewingItemId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [feedback, setFeedback] = useState(null)
  const editingItem = items.find((item) => item.id === editingItemId) ?? null
  const isFormOpen = isItemFormOpen || editingItem !== null
  const locations = [...new Set(items.map((item) => item.location))].sort(
    (firstLocation, secondLocation) =>
      firstLocation.localeCompare(secondLocation),
  )
  const viewedItem =
    viewingItemId === null ? null : getItemById(viewingItemId)
  const summaryCards = [
    {
      label: 'Items tracked',
      detail: 'Your personal collection',
      value: items.length,
    },
    { label: 'Categories', detail: 'A little order, at a glance', value: '—' },
    {
      label: 'Recently updated',
      detail: 'Your latest changes',
      value: '—',
    },
  ]

  useEffect(() => {
    if (feedback === null) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setFeedback(null), 3000)
    return () => window.clearTimeout(timeoutId)
  }, [feedback])

  function showFeedback(message) {
    setFeedback({ message })
  }

  function handleSaveItem(fields) {
    if (editingItemId !== null) {
      const updatedItem = updateItem(editingItemId, fields)

      if (updatedItem === null) {
        throw new Error('The item could not be found.')
      }

      setEditingItemId(null)
      showFeedback('Item updated successfully')
      return
    }

    addItem(fields)
    setIsItemFormOpen(false)
    showFeedback('Item created successfully')
  }

  function handleDeleteItem(item) {
    const confirmed = window.confirm(`Delete "${item.name}" from your inventory?`)

    if (!confirmed) {
      return
    }

    if (deleteItem(item.id)) {
      if (editingItemId === item.id) {
        setEditingItemId(null)
      }

      if (viewingItemId === item.id) {
        setViewingItemId(null)
      }

      showFeedback('Item deleted successfully')
    }
  }

  function handleToggleItemForm() {
    if (editingItem !== null) {
      setEditingItemId(null)
      setViewingItemId(null)
      setIsItemFormOpen(true)
      return
    }

    if (isItemFormOpen) {
      setIsItemFormOpen(false)
      return
    }

    setViewingItemId(null)
    setIsItemFormOpen(true)
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Personal Inventory home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M6 11.5 16 6l10 5.5v10L16 27l-10-5.5v-10Z" />
              <path d="m6.5 11.8 9.5 5.4 9.5-5.4M16 17.5V27M11 8.8l10 5.7" />
            </svg>
          </span>
          <span className="brand-name">Keepsake</span>
        </a>
        <div className="workspace-label">
          <span className="workspace-indicator" aria-hidden="true" />
          Personal workspace
        </div>
      </header>

      {feedback !== null && (
        <div className="feedback-message" role="status" aria-live="polite">
          <span>{feedback.message}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setFeedback(null)}
          >
            ×
          </button>
        </div>
      )}

      <main className="page-content">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">YOUR SPACE, WELL KEPT</p>
          <h1 id="page-title">Everything you own,<br />in one thoughtful place.</h1>
          <p className="intro-copy">
            Keep a clear view of your belongings and make the most of the things
            that matter to you.
          </p>
        </section>

        <section className="summary-grid" aria-label="Inventory summary">
          {summaryCards.map((card) => (
            <article className="summary-card" key={card.label}>
              <p className="summary-label">{card.label}</p>
              <p className="summary-value">{card.value}</p>
              <p className="summary-detail">{card.detail}</p>
            </article>
          ))}
        </section>

        <section className="inventory-panel" aria-labelledby="inventory-title">
          <div className="inventory-heading">
            <div>
              <p className="eyebrow">YOUR COLLECTION</p>
              <h2 id="inventory-title">Inventory</h2>
            </div>
            <button
              className="add-item-button"
              type="button"
              aria-expanded={isFormOpen}
              aria-controls={isFormOpen ? 'item-form' : undefined}
              onClick={handleToggleItemForm}
            >
              {editingItem !== null
                ? 'Add item instead'
                : isItemFormOpen
                  ? 'Close form'
                  : 'Add item'}
            </button>
          </div>

          {viewingItemId === null && !isFormOpen && (
            <div className="toolbar-shell">
              <span className="toolbar-dot" aria-hidden="true" />
              <p>Add the things you own to keep your collection up to date.</p>
            </div>
          )}

          {isFormOpen ? (
            <div id="item-form">
              <ItemForm
                key={editingItem?.id ?? 'new-item'}
                item={editingItem}
                onItemSaved={handleSaveItem}
                onCancel={() => {
                  setEditingItemId(null)
                  setIsItemFormOpen(false)
                }}
              />
            </div>
          ) : viewingItemId !== null ? (
            <ItemDetail
              item={viewedItem}
              itemId={viewingItemId}
              onBack={() => setViewingItemId(null)}
              onEdit={() => {
                setEditingItemId(viewingItemId)
                setIsItemFormOpen(false)
              }}
              onDelete={() => {
                if (viewedItem !== null) {
                  handleDeleteItem(viewedItem)
                }
              }}
            />
          ) : (
            <ItemList
              items={items}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              categories={INVENTORY_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectedCategoryChange={setSelectedCategory}
              locations={locations}
              selectedLocation={selectedLocation}
              onSelectedLocationChange={setSelectedLocation}
              onViewItem={setViewingItemId}
              onEditItem={(id) => {
                setEditingItemId(id)
                setIsItemFormOpen(false)
              }}
              onDeleteItem={handleDeleteItem}
            />
          )}
        </section>
      </main>

      <footer className="site-footer">
        <span>Made for the things that make a place yours.</span>
        <span className="footer-mark">KEEPSAKE <span aria-hidden="true">·</span> PERSONAL INVENTORY</span>
      </footer>
    </div>
  )
}

export default App
