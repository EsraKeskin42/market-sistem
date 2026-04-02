const electron = require('electron')
const { app, BrowserWindow } = electron
const path = require('path')

if (!app || !BrowserWindow) {
  throw new Error(
    `Electron API not available. require('electron') returned: ${typeof electron} ${JSON.stringify(electron)}`,
  )
}

function getCityFromArgs() {
  const arg = process.argv.find((a) => a.startsWith('--city='))
  if (arg) return arg.split('=')[1] || 'GAZİANTEP'
  const envCity = process.env.MARKET_CITY
  if (envCity && envCity.trim()) return envCity.trim()
  return 'GAZİANTEP'
}

function createWindow() {
  const city = getCityFromArgs()
  const win = new BrowserWindow({
    width: 1365,
    height: 768,
    backgroundColor: '#f2efe8',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      additionalArguments: [`--city=${city}`],
    },
  })

  win.once('ready-to-show', () => win.show())

  const devUrl = process.env.ELECTRON_RENDERER_URL || 'http://localhost:5173'
  win.loadURL(devUrl)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

