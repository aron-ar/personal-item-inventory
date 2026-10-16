import { useState } from 'react'
import { INVENTORY_CATEGORIES } from '../constants/inventory.js'

const INITIAL_FIELDS = {
  name: '',
  category: '',
  location: '',
  quantity: '1',
}

function validateFields(fields) {
  const errors = {}

  if (fields.name.trim().length === 0) {
    errors.name = 'Enter an item name.'
  }

  if (!INVENTORY_CATEGORIES.includes(fields.category)) {
    errors.category = 'Select a category.'
  }

  if (fields.location.trim().length === 0) {
    errors.location = 'Enter a location.'
  }

  const quantity = Number(fields.quantity)
  if (!Number.isInteger(quantity) || quantity < 1) {
    errors.quantity = 'Enter a whole number of 1 or more.'
  }

  return errors
}

function ItemForm({ item = null, onItemSaved, onCancel }) {
  const [fields, setFields] = useState(() =>
    item
      ? {
          name: item.name,
          category: item.category,
          location: item.location,
          quantity: String(item.quantity),
        }
      : INITIAL_FIELDS,
  )
  const [errors, setErrors] = useState({})
  const [saveError, setSaveError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFields((currentFields) => ({ ...currentFields, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    setSaveError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validateFields(fields)
    setErrors(validationErrors)
    setSaveError('')

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      onItemSaved({
        ...fields,
        name: fields.name.trim(),
        location: fields.location.trim(),
        quantity: Number(fields.quantity),
      })
      if (item === null) {
        setFields(INITIAL_FIELDS)
      }
      setErrors({})
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? `Unable to save the item: ${error.message}`
          : 'Unable to save the item. Please try again.',
      )
    }
  }

  return (
    <form className="item-form" onSubmit={handleSubmit} noValidate>
      <h3 className="item-form-heading">
        {item === null ? 'Add an item' : `Edit ${item.name}`}
      </h3>
      <div className="item-form-fields">
        <div className="form-field">
          <label htmlFor="item-name">Name</label>
          <input
            id="item-name"
            name="name"
            type="text"
            value={fields.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'item-name-error' : undefined}
            required
          />
          {errors.name && (
            <span className="form-error" id="item-name-error">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="item-category">Category</label>
          <select
            id="item-category"
            name="category"
            value={fields.category}
            onChange={handleChange}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? 'item-category-error' : undefined
            }
            required
          >
            <option value="">Select a category</option>
            {INVENTORY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="form-error" id="item-category-error">
              {errors.category}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="item-location">Location</label>
          <input
            id="item-location"
            name="location"
            type="text"
            value={fields.location}
            onChange={handleChange}
            aria-invalid={Boolean(errors.location)}
            aria-describedby={
              errors.location ? 'item-location-error' : undefined
            }
            required
          />
          {errors.location && (
            <span className="form-error" id="item-location-error">
              {errors.location}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="item-quantity">Quantity</label>
          <input
            id="item-quantity"
            name="quantity"
            type="number"
            min="1"
            step="1"
            value={fields.quantity}
            onChange={handleChange}
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={
              errors.quantity ? 'item-quantity-error' : undefined
            }
            required
          />
          {errors.quantity && (
            <span className="form-error" id="item-quantity-error">
              {errors.quantity}
            </span>
          )}
        </div>
      </div>

      {saveError && (
        <p className="form-save-error" role="alert">
          {saveError}
        </p>
      )}

      <div className="item-form-actions">
        <button
          className="item-form-cancel"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button className="item-form-submit" type="submit">
          {item === null ? 'Save item' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

export default ItemForm
