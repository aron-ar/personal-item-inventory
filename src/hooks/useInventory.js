import { useCallback, useState } from 'react'
import { getItemValidationError } from '../models/inventoryItem.js'
import { loadInventory, saveInventory } from '../services/inventoryStorage.js'

function validateItemFields(item) {
  const validationError = getItemValidationError(item)

  if (validationError) {
    throw new Error(validationError)
  }
}

function createItemId(items) {
  const existingIds = new Set(items.map((item) => item.id))
  let id

  do {
    id =
      typeof globalThis.crypto?.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `item-${Date.now()}-${Math.random().toString(36).slice(2)}`
  } while (existingIds.has(id))

  return id
}

export function useInventory() {
  const [items, setItems] = useState(loadInventory)

  const getItems = useCallback(() => items, [items])

  const getItemById = useCallback(
    (id) => items.find((item) => item.id === id) ?? null,
    [items],
  )

  const addItem = useCallback(
    (itemFields) => {
      validateItemFields(itemFields)

      const newItem = {
        id: createItemId(items),
        name: itemFields.name.trim(),
        category: itemFields.category,
        location: itemFields.location.trim(),
        quantity: itemFields.quantity,
      }
      const updatedItems = [...items, newItem]

      saveInventory(updatedItems)
      setItems(updatedItems)
      return newItem
    },
    [items],
  )

  const updateItem = useCallback(
    (id, itemFields) => {
      const existingItem = items.find((item) => item.id === id)

      if (!existingItem) {
        return null
      }

      const updatedItem = {
        id: existingItem.id,
        name: itemFields.name ?? existingItem.name,
        category: itemFields.category ?? existingItem.category,
        location: itemFields.location ?? existingItem.location,
        quantity: itemFields.quantity ?? existingItem.quantity,
      }
      validateItemFields(updatedItem)

      const updatedItems = items.map((item) =>
        item.id === id ? updatedItem : item,
      )
      saveInventory(updatedItems)
      setItems(updatedItems)
      return updatedItem
    },
    [items],
  )

  const deleteItem = useCallback(
    (id) => {
      const updatedItems = items.filter((item) => item.id !== id)

      if (updatedItems.length === items.length) {
        return false
      }

      saveInventory(updatedItems)
      setItems(updatedItems)
      return true
    },
    [items],
  )

  return { items, getItems, addItem, updateItem, deleteItem, getItemById }
}
