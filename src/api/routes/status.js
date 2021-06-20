const status = function (app, fs) {
  const file = require('./file.js')

  // Create
  /*
  app.post('/analysis/status', function (req, res) {
    file.readFile(
      fs,
      function (data) {
        let object = data
        object.status.push(req.body)
        file.writeFile(fs, JSON.stringify(object, null, 2), function () {
          res.status(200).send('Created')
        })
      },
      true,
    )
  })
  */

  // Read
  app.get('/analysis/status', (req, res) => {
    file.readFile(
      fs,
      function (data) {
        res.send(data.status)
      },
      true,
    )
  })

  // Read
  app.get('/analysis/status/:name', (req, res) => {
    const name = req.params['name']
    file.readFile(
      fs,
      function (data) {
        const id = object.status.findIndex((e) => {
          return e['name'] == name
        })
        if (id == -1) {
          res.status(404).send(`name:${name} ot found`)
        } else {
          res.send(data.status[id])
        }
      },
      true,
    )
  })

  // Update
  /*
  app.put('/analysis/status/:id', function (req, res) {
    file.readFile(fs, function (data) {
      let object = JSON.parse(data)
      const id = req.params['id']
      object.status[id] = req.body
      file.writeFile(fs, JSON.stringify(object, null, 2), function () {
        res.status(200).send(`list id:${id} updated`)
      })
    })
  })
  */

  // Delete
  app.delete('/analysis/status/:name', function (req, res) {
    file.readFile(fs, function (data) {
      let object = JSON.parse(data)
      const name = req.params['name']
      let array = object.status
      const id = object.status.findIndex((e) => {
        return e['name'] == name
      })
      if (id == -1) {
        res.status(404).send(`name:${name} not found`)
      } else {
        array.splice(id, 1)
        const resultPath = `./results/${name}.json`
        if (fs.existsSync(resultPath)) {
          try {
            fs.unlinkSync(resultPath)
            //file removed
          } catch (err) {
            console.log(err)
            res.status(404).send(`file:${resultPath} can't be deleted`)
          }
        }
        file.writeFile(fs, JSON.stringify(object, null, 2), function () {
          res.status(200).send(`list id:${id} removed`)
        })
      }
    })
  })
}

module.exports = status
