// These are pure functions for strings

export function removeBadChars(stringWithBadChars: string) {
  return stringWithBadChars
    .replace(/[<>{}%`\[\]~#^:'’"/\\|?*]/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function replaceElementInArray(
  array: Array<any>,
  oldEl: any,
  newEl: any,
) {
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
  let arrayCopy = [...array]

  arrayCopy = arrayCopy.filter((el) => {
    console.log(el == elToRemove)
    return elToRemove != el
  })

  return arrayCopy
}

export function checkInclusion(array: Array<any>, subSet: Array<any>): boolean {
  return array.some((letter) => subSet.includes(letter))
}

export function getElementsInArrayByKeyValue(
  array: Array<any>,
  key: any,
  value: any,
): any {
  return array.filter((element) => {
    return element[key] == value
  })
}

// Thanks to https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
export function isEmail(email: string): boolean {
  return !!String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
}

export function uniqueArray(array: any[]): any[] {
  return [... new Set(array)]
}

export function maxLength(sentence: string, maxLength: number): string {
  if (sentence.length > maxLength) return sentence.slice(0, maxLength) + ' ...'
  else return sentence
}

type strengthIndicator = [number, string, string]

export function evaluatePassword(value: string): strengthIndicator {
  let strength = 0
  let tip = ''

  if (value.length >= 6) {
    strength += 1
  } else if (!tip) {
    tip = 'Le mot de passe doit contenir au moins 6 caractères.'
  }

  if (value.match(/[a-z]/)) {
    strength += 1
  } else if (!tip) {
    tip = 'Le mot de passe doit contenir au moins une lettre minuscule.'
  }

  if (value.match(/[A-Z]/)) {
    strength += 1
  } else if (!tip) {
    tip = 'Le mot de passe doit contenir au moins une lettre majuscule.'
  }

  if (value.match(/[0-9]/)) {
    strength += 1
  } else if (!tip) {
    tip = 'Le mot de passe doit contenir au moins un chiffre.'
  }

  if (value.match(/[^a-zA-Z0-9]/)) {
    strength += 1
  } else if (!tip) {
    tip = 'Le mot de passe doit contenir au moins un caractère spécial.'
  }

  if (value.length > 12) {
    strength += 1
  }

  let strengthMessage = ''
  switch (strength) {
    case 0:
      strengthMessage = '😕 Très faible.'
      break
    case 1:
      strengthMessage = '😑 Faible.'
      break
    case 2:
      strengthMessage = '😐 Moyen.'
      break
    case 3:
      strengthMessage = '😊 Bon.'
      break
    case 4:
      strengthMessage = '🙂 Très bon.'
      break
    case 5:
      strengthMessage = '😁 Excellent.'
      break
    case 6:
      strengthMessage = '🤩 Wow.'
      break
  }

  return [strength, strengthMessage, tip]
}
