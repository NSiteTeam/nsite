// These are pure functions for strings

export function removeBadChars(stringWithBadChars: string) {
  return stringWithBadChars
    .replace(/[<>{}%`\[\]~#^:'’"/\\|?*]/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function replaceElementInArray(array: Array<any>, oldEl: any, newEl: any) {
  const arrayCopy = array
  const index = arrayCopy.indexOf(oldEl)

  // If the element is not in the provided array, return the array unchanged
  if (index == -1) {
    console.warn(`Element ${oldEl} in array not found`)
    return arrayCopy
  }
  arrayCopy[index] = newEl
  return arrayCopy
}

export function deleteElementInArray(array: Array<any>, elToRemove: any) {
  let arrayCopy = [... array]
  
  arrayCopy = arrayCopy.filter(el => {
    console.log(el == elToRemove)
    return elToRemove != el
  })

  return arrayCopy
}
