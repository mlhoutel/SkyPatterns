const dataPath = './data/status.json'
module.exports = {
  readFile: function (fs, callback = () => {}, returnJson = false, filePath = dataPath, encoding = 'utf8') {
    fs.readFile(filePath, encoding, function (err, data) {
      if (err) {
        throw err
      }
      callback(returnJson ? JSON.parse(data) : data)
    })
  },

  writeFile: function (fs, fileData, callback, filePath = dataPath, encoding = 'utf8') {
    fs.writeFile(filePath, fileData, encoding, function (err) {
      if (err) {
        throw err
      }
      callback()
    })
  },
}
