import CryptoJS from 'crypto-js'

const BASE_KEY = process.env.NEXT_PUBLIC_AUTH_ENCRYPTION_KEY
export const generateEncryptionKey = (): string => {
  const BASE: string = BASE_KEY as string
  if (typeof window === 'undefined') {
    return CryptoJS.SHA256(BASE).toString()
  }

  const stableFingerprint = {
    // userAgent: navigator.userAgent?.substring(0, 100),
    // platform: navigator.platform,
    // language: navigator.language,
    // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  const fingerprintHash = CryptoJS.SHA256(JSON.stringify(stableFingerprint)).toString()

  return CryptoJS.SHA256(BASE + fingerprintHash).toString()
}

export const generateCanvasFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return 'no-canvas'

    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Device fingerprint', 2, 2)
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.fillRect(100, 5, 80, 20)

    return canvas.toDataURL().slice(-50)
  } catch {
    return 'canvas-error'
  }
}

export const getOrCreateSessionKey = (): string => {
  let sessionKey = sessionStorage.getItem('_device_session')
  if (!sessionKey) {
    sessionKey = CryptoJS.lib.WordArray.random(128 / 8).toString()
    sessionStorage.setItem('_device_session', sessionKey)
  }
  return sessionKey
}

export const getCreationTime = (): string => {
  let creationTime = localStorage.getItem('_auth_creation')
  if (!creationTime) {
    creationTime = Date.now().toString()
    localStorage.setItem('_auth_creation', creationTime)
  }
  return creationTime
}

export const getDeviceInfo = (): Record<string, unknown> => {
  if (typeof window === 'undefined') return {}

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenWidth: screen.width,
    screenHeight: screen.height,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    hardwareConcurrency: navigator.hardwareConcurrency,
    maxTouchPoints: navigator.maxTouchPoints,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}

export const encrypt = (text: string): string => {
  try {
    const key = generateEncryptionKey()
    const encrypted = CryptoJS.AES.encrypt(text, key).toString()

    const timestamp = Date.now().toString(36)
    return `${timestamp}:${encrypted}`
  } catch {
    return text
  }
}

export const decrypt = (encryptedText: string): string => {
  try {
    const parts = encryptedText.split(':')
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted format')
    }

    const [timestampStr, encryptedData] = parts
    const timestamp = parseInt(timestampStr, 36)

    const maxAge = 30 * 24 * 60 * 60 * 1000
    if (Date.now() - timestamp > maxAge) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('_auth_creation')
      return ''
    }

    const key = generateEncryptionKey()
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key)
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8)

    if (!decryptedText) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('_auth_creation')
      return ''
    }

    try {
      const parsed = JSON.parse(decryptedText)
      if (!parsed.state || typeof parsed.state !== 'object') {
        throw new Error('Invalid auth data structure')
      }
    } catch {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('_auth_creation')
      return ''
    }

    return decryptedText
  } catch {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('_auth_creation')
    return ''
  }
}