export const isElectron = () => {
  return typeof window !== 'undefined' && window.process && window.process.versions && window.process.versions.electron
}

export const getPlatform = () => {
  return isElectron() ? 'desktop' : 'web'
}
