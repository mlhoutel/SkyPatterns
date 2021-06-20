const appRouter = function (app, fs, port) {
  // Loaders
  const launcherRoutes = require('./launcher.js')
  const statusRoutes = require('./status.js')
  const resultsRoutes = require('./results.js')
  const datasetsRoutes = require('./datasets.js')

  // Root
  app.get('/', (req, res) => {
    res.send(
      `<div style="text-align: center; vertical-align: middle; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;"><div style="flex: 0 0 500px; font-size:1.4em;">Skypattern api is listening on port ${port}</div></div>`,
    )
  })

  // Ping request
  app.get('/ping', (req, res) => {
    console.log('ping')
    res.status(200).json('pong')
  })

  launcherRoutes(app, fs)
  statusRoutes(app, fs)
  resultsRoutes(app, fs)
  datasetsRoutes(app, fs)
}

module.exports = appRouter
