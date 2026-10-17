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

function migrateLocation(item) {
  if (item === null || typeof item !== 'object' || Array.isArray(item)) {
    return item
  }

  const { location, ...rest } = item

  if (typeof item.locationParent === 'string') {
    return {
      ...rest,
      locationChild:
        typeof item.locationChild === 'string' ? item.locationChild : '',
    }
  }

  if (typeof item.location !== 'string') {
    return item
  }

  return { ...rest, locationParent: location, locationChild: '' }
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

  let storedItems
  try {
    storedItems = JSON.parse(storedValue)
  } catch (error) {
    console.warn('Saved inventory data is corrupted and was ignored.', error)
    return []
  }

  const items = Array.isArray(storedItems)
    ? storedItems.map(migrateLocation)
    : storedItems

  if (!isInventory(items)) {
    console.warn('Saved inventory data has an invalid format and was ignored.')
    return []
  }

  if (JSON.stringify(items) !== JSON.stringify(storedItems)) {
    saveInventory(items)
  }

  return items
}

export function saveInventory(items) {
  window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items))
}
