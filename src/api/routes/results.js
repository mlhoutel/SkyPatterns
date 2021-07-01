const results = function (app, fs) {
  const file = require('./file.js')
  app.get('/analysis/result/:id', (req, res) => {
    const id = req.params['id']
    let maximums = []
    let returnedJSON = { title: id, dataset: [] }

    returnedJSON.labels = []
    const values = id.substring(id.lastIndexOf('[') + 1, id.lastIndexOf(']'))

    for (let i = 0; i < values.length; i++) {
      switch (values[i]) {
        case 'l':
          returnedJSON.labels.push('length')
          break
        case 'f':
          returnedJSON.labels.push('frequency')
          break
        case 'a':
          returnedJSON.labels.push('area')
          break
        case 'g':
          returnedJSON.labels.push('growth-rate')
          break
        case 'm':
          returnedJSON.labels.push('min')
          break
        case 'M':
          returnedJSON.labels.push('max')
          break
        case 'n':
          returnedJSON.labels.push('mean')
          break
        case 'u':
          returnedJSON.labels.push('sum')
          break
        default:
          break
      }
    }

    file.readFile(
      fs,
      function (data) {
        // First parsing to compute the maximums and fill in known data
        // into the final pattern
        data.skypatterns.forEach(function (item, index, array) {
          returnedJSON.dataset[index] = {}
          returnedJSON.dataset[index].data = []
          returnedJSON.dataset[index].rdata = []

          returnedJSON.dataset[index].label = '[' + item.items.join() + ']'
          item.measures.forEach(function (val, i, a) {
            if (index === 0) {
              maximums[i] = val
            }
            if (val > maximums[i]) {
              maximums[i] = val
            }
            returnedJSON.dataset[index].data[i] = val
          })
        })

        let angle = maximums.length

        // Second parsing to compute the relative values
        data.skypatterns.forEach(function (item, index, array) {
          let area = 0
          item.measures.forEach(function (val, i, a) {
            if (val > maximums[i]) {
              maximums[i] = val
            }
            returnedJSON.dataset[index].rdata[i] = val / maximums[i]
            if (i > 0) {
              let a = returnedJSON.dataset[index].data[i]
              let b = returnedJSON.dataset[index].data[i - 1]

              area += triArea(a, b, angle)

              if (i == maximums.length - 1) {
                b = returnedJSON.dataset[index].data[i - 1]
                area += triArea(a, b, angle)
              }
            }
          })
          returnedJSON.dataset[index].area = area.toFixed(2)
        })

        console.log('returned results from ' + id)
        res.json(returnedJSON)
      },
      true,
      __dirname + '/../results/' + id + '.json',
    )
  })
}

function triArea(a, b, angle) {
  let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + 2 * a * b * Math.cos(angle))

  let S = 0.5 * (a + b + c)
  // Heron's formula
  return Math.sqrt(S * (S - a) * (S - b) * (S - c))
}

module.exports = results
