export function formatLocation(locationParent, locationChild = '') {
  const parent = locationParent.trim()
  const child = locationChild.trim()

  return child ? `${parent} > ${child}` : parent
}

function getLocationPathSegments(location) {
  return location
    .split('>')
    .map((segment) => segment.trim())
    .filter(Boolean)
}

export function getLocationFilterOptions(items) {
  const locations = items.flatMap((item) => {
    const parentSegments = getLocationPathSegments(item.locationParent)
    const parentPaths = parentSegments.map((_, index) =>
      parentSegments.slice(0, index + 1).join(' > '),
    )
    const child = item.locationChild ?? ''
    const fullLocation = formatLocation(item.locationParent, child)

    return [...parentPaths, child, fullLocation].filter(Boolean)
  })

  return [...new Set(locations)].sort((first, second) =>
    first.localeCompare(second),
  )
}

export function locationMatchesFilter(item, selectedLocation) {
  if (selectedLocation === '') {
    return true
  }

  const selectedSegments = getLocationPathSegments(selectedLocation)
  const parentSegments = getLocationPathSegments(item.locationParent)
  const child = item.locationChild ?? ''
  const fullLocationSegments = [
    ...parentSegments,
    ...getLocationPathSegments(child),
  ]
  const matchesPathPrefix =
    selectedSegments.length <= fullLocationSegments.length &&
    selectedSegments.every(
      (segment, index) => segment === fullLocationSegments[index],
    )

  return matchesPathPrefix || child === selectedLocation
}
