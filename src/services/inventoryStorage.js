import {
  INVENTORY_STORAGE_KEY,
} from '../constants/inventory.js'
import { getItemValidationError } from '../models/inventoryItem.js'

function isInventoryItem(item) {
  return (
    item !== null &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    getItemValidationError(item) === null
  )
}

function isInventory(items) {
  if (!Array.isArray(items) || !items.every(isInventoryItem)) {
    return false
  }

  return new Set(items.map((item) => item.id)).size === items.length
}

export function loadInventory() {
  const storedValue = window.localStorage.getItem(INVENTORY_STORAGE_KEY)

  if (storedValue === null) {
    return []
  }

  try {
    const items = JSON.parse(storedValue)

    if (isInventory(items)) {
      return items
    }
  } catch (error) {
    console.warn('Saved inventory data is corrupted and was ignored.', error)
    return []
  }

  console.warn('Saved inventory data has an invalid format and was ignored.')
  return []
}

export function saveInventory(items) {
  window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items))
}
