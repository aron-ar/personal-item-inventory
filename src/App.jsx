import { useState } from 'react'
import ItemDetail from './components/ItemDetail.jsx'
import ItemForm from './components/ItemForm.jsx'
import ItemList from './components/ItemList.jsx'
import { useInventory } from './hooks/useInventory.js'

function App() {
  const { items, addItem, updateItem, deleteItem, getItemById } = useInventory()
  const [isItemFormOpen, setIsItemFormOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)
  const [viewingItemId, setViewingItemId] = useState(null)
  const editingItem = items.find((item) => item.id === editingItemId) ?? null
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

  function handleSaveItem(fields) {
    if (editingItemId !== null) {
      const updatedItem = updateItem(editingItemId, fields)

      if (updatedItem === null) {
        throw new Error('The item could not be found.')
      }

      setEditingItemId(null)
      return
    }

    addItem(fields)
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
    }
  }

  function handleToggleItemForm() {
    if (viewingItemId !== null) {
      setViewingItemId(null)
    }

    if (editingItem !== null) {
      setEditingItemId(null)
      setIsItemFormOpen(true)
      return
    }

    setIsItemFormOpen((isOpen) => !isOpen)
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
              aria-expanded={isItemFormOpen || editingItem !== null}
              aria-controls="item-form"
              onClick={handleToggleItemForm}
            >
              {editingItem !== null
                ? 'Add item instead'
                : isItemFormOpen
                  ? 'Close form'
                  : 'Add item'}
            </button>
          </div>

          {viewingItemId === null && (
            <div className="toolbar-shell">
              <span className="toolbar-dot" aria-hidden="true" />
              <p>Add the things you own to keep your collection up to date.</p>
            </div>
          )}

          {viewingItemId === null &&
            (isItemFormOpen || editingItem !== null) && (
              <div id="item-form">
                <ItemForm
                  key={editingItem?.id ?? 'new-item'}
                  item={editingItem}
                  onItemSaved={handleSaveItem}
                  onCancel={() => setEditingItemId(null)}
                />
              </div>
            )}

          {viewingItemId !== null ? (
            <ItemDetail
              item={viewedItem}
              itemId={viewingItemId}
              onBack={() => setViewingItemId(null)}
              onEdit={() => {
                setEditingItemId(viewingItemId)
                setIsItemFormOpen(false)
                setViewingItemId(null)
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
