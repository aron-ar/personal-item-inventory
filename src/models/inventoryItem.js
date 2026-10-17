import { INVENTORY_CATEGORIES } from '../constants/inventory.js'

export function getItemValidationError(item) {
  if (item === null || typeof item !== 'object') {
    return 'Item data must be an object.'
  }

  if (typeof item.name !== 'string' || item.name.trim().length === 0) {
    return 'Item name cannot be empty.'
  }

  if (
    typeof item.locationParent !== 'string' ||
    item.locationParent.trim().length === 0
  ) {
    return 'Parent location cannot be empty.'
  }

  if (
    item.locationChild !== undefined &&
    typeof item.locationChild !== 'string'
  ) {
    return 'Child location must be a string.'
  }

  if (!INVENTORY_CATEGORIES.includes(item.category)) {
    return 'Item category must be one of the predefined categories.'
  }

  if (!Number.isInteger(item.quantity) || item.quantity < 1) {
    return 'Item quantity must be an integer greater than or equal to 1.'
  }

  if (item.notes !== undefined && typeof item.notes !== 'string') {
    return 'Item notes must be a string.'
  }

  return null
}
