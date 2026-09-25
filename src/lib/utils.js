export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join('')
}

export function capitalize(value = '') {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function generateJoinCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const numbers = '23456789'

  let result = 'AQ-'

  for (let index = 0; index < 3; index += 1) {
    result += letters[Math.floor(Math.random() * letters.length)]
  }

  result += numbers[Math.floor(Math.random() * numbers.length)]

  return result
}

export function formatTime(seconds) {
  const safe = Math.max(0, Number(seconds) || 0)
  const minutes = Math.floor(safe / 60)
  const remaining = safe % 60

  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}
