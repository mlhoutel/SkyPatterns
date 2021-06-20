const datasets = function (app, fs) {
  const file = require('./file.js')
  const pathDatasets = './datasets/'
  const dataExtention = 'dat'

  app.get('/datasets', (req, res) => {
    fs.readdir(pathDatasets, (err, files) => {
      const datasetsList = []
      files.forEach((file) => {
        const name_ext = file.split('.')
        if (name_ext[1] == dataExtention) {
          datasetsList.push(name_ext[0])
        }
      })
      res.send(datasetsList)
    })
  })
}

module.exports = datasets
