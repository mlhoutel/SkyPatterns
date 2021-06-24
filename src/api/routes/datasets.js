const datasets = function (app, fs) {
  const file = require('./file.js')
  const pathDatasets = __dirname + '/../datasets/'
  const dataExtention = 'dat'

  const noClassesPath = './config/noclasses.json'

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

  app.get('/datasets/:name/noclasses', (req, res) => {
    file.readFile(
      fs,
      function (data) {
        const name = req.params['name']
        console.log(name)
        console.log(data)
        if (name in data) {
          res.send({ noclasses: data[name].noclasses })
        } else {
          res.send({ noclasses: false })
        }
      },
      true,
      noClassesPath,
    )
  })
}

module.exports = datasets
