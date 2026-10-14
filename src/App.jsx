import { useState } from 'react'
import ItemForm from './components/ItemForm.jsx'
import ItemList from './components/ItemList.jsx'
import { useInventory } from './hooks/useInventory.js'

function App() {
  const { items, addItem } = useInventory()
  const [isItemFormOpen, setIsItemFormOpen] = useState(false)
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
              aria-expanded={isItemFormOpen}
              aria-controls="add-item-form"
              onClick={() => setIsItemFormOpen((isOpen) => !isOpen)}
            >
              {isItemFormOpen ? 'Close form' : 'Add item'}
            </button>
          </div>

          <div className="toolbar-shell">
            <span className="toolbar-dot" aria-hidden="true" />
            <p>Add the things you own to keep your collection up to date.</p>
          </div>

          {isItemFormOpen && (
            <div id="add-item-form">
              <ItemForm onItemAdded={addItem} />
            </div>
          )}

          <ItemList items={items} />
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
