const colors = function (app, fs) {
  const file = require('./file.js')
  const pathColors = __dirname + '/../config/colors.json'

  app.get('/colors', (req, res) => {
    file.readFile(
      fs,
      function (data) {
        res.send(data)
      },
      true,
      pathColors,
    )
  })
}

module.exports = colors
