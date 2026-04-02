const { contextBridge } = require('electron')

function getCityFromArgs() {
  const arg = process.argv.find((a) => a.startsWith('--city='))
  if (!arg) return null
  const value = arg.split('=')[1]
  return value || null
}

const city = getCityFromArgs()

contextBridge.exposeInMainWorld('market', {
  version: '0.0.0',
  city,
})

