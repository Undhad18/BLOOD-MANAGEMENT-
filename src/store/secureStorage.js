// Extremely simple XOR-based obfuscation for demo only (not real security)
const KEY = 113

export function encryptString(plain) {
  try {
    const bytes = Array.from(new TextEncoder().encode(plain)).map(b=> b ^ KEY)
    return btoa(String.fromCharCode(...bytes))
  } catch {
    return plain
  }
}

export function decryptString(cipher) {
  try {
    const bytes = atob(cipher).split('').map(c=> c.charCodeAt(0) ^ KEY)
    return new TextDecoder().decode(new Uint8Array(bytes))
  } catch {
    return cipher
  }
}

export function setSecureItem(name, value) {
  localStorage.setItem(name, encryptString(JSON.stringify(value)))
}

export function getSecureItem(name, fallback) {
  const raw = localStorage.getItem(name)
  if (!raw) return fallback
  try { return JSON.parse(decryptString(raw)) } catch { return fallback }
}


