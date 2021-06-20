const launcher = function (app, fs) {
  const file = require('./file.js')
  const pathJar = __dirname + '/../'

  const update_status = function (name, status) {
    file.readFile(fs, function (data) {
      let object = JSON.parse(data)
      const target = object.status.find((o) => {
        return o.name == name
      })
      if (target == undefined) {
        object.status.push({ name: name, status: status, date: new Date().toLocaleDateString() })
      } else {
        target.status = status
      }
      file.writeFile(fs, JSON.stringify(object, null, 2), () => {})
    })
  }

  const pattern_mesure = function (value) {
    let mesures = ''
    for (const mesure of value) {
      switch (mesure) {
        case 'length':
          mesures += 'l'
          break
        case 'frequency':
          mesures += 'f'
          break
        case 'area':
          mesures += 'a'
          break
        case 'growth-rate':
          mesures += 'g'
          break
        default:
          throw `pattern_mesure parameter ${mesure} is not recognised`
      }
    }
    return mesures
  }

  const time_limit = function (value) {
    return value * 3600 // Hours in seconds
  }

  const attribute_measures = function (value) {
    let mesures = ''
    for (const mesure of value) {
      switch (mesure) {
        case 'min':
          mesures += 'm'
          break
        case 'max':
          mesures += 'M'
          break
        case 'mean':
          mesures += 'n'
          break
        case 'sum':
          mesures += 'u'
          break
        default:
          throw `pattern_mesure parameter ${mesure} is not recognised`
      }
    }
    return mesures
  }

  const strategy = function (value) {
    const strategies = ['occ', 'minfreq', 'maxfreq', 'mincov', 'minval', 'maxval', 'minnorm', 'maxnorm', 'inpord']
    const strat = value.toLowerCase()

    if (!strategies.includes(strat)) {
      throw `strategy parameter ${value} is not recognised`
    }

    return strat
  }

  const pattern_type = function (value) {
    const pattern_types = ['closedsky', 'sky', 'closed']
    const pattern = value.toLowerCase()

    if (!pattern_types.includes(pattern)) {
      throw `pattern_type parameter ${value} is not recognised`
    }

    return pattern
  }

  const bitset_type = function (value) {
    const biteset_types = ['sparse', 'classic']
    const type = value.toLowerCase()

    if (!biteset_types.includes(type)) {
      throw `byteset_type parameter ${value} is not recognised`
    }

    return type
  }

  const minimum_frequency = function (value, name) {
    // TODO => transformer le % en valeur absolue
    fileBuffer = fs.readFileSync(`./datasets/${name}.dat`)
    split_lines = fileBuffer.toString().split('\n')
    const count = split_lines.length - 1
    return Math.round(count * (value / 100))
  }

  const launch = function (callback, body) {
    const { exec, spawn } = require('child_process')
    console.log('launched...')
    // 1 - feed all received valid parameters to the program

    let command = ''
    let parameters = []
    let source = ''
    let name = ''

    try {
      if ('path' in body) {
        name = body['path']
        source = `-d datasets/${body['path']}.dat`
      }

      if ('command' in body) {
        name += `_${body['command']}`
        command = body['command']
      }

      name += '['

      if ('pattern_measures' in body) {
        const pattern = pattern_mesure(body['pattern_measures'])
        name += `${pattern}`
        parameters.push(`-m ${pattern}`)
      }

      if ('attribute_measures' in body) {
        const attributes = attribute_measures(body['attribute_measures'])
        name += `${attributes}`
        parameters.push(`-v ${attributes}`)
      }

      name += ']'

      if ('transactional' in body) {
        if (body['transactional']) {
          name += `_dat`
          parameters.push(`--dat`)
        }
      }

      if ('noclasses' in body) {
        if (body['noclasses']) {
          name += `_nc`
          parameters.push(`--nc`)
        }
      }

      if ('time_limit' in body) {
        const time = time_limit(body['time_limit'])
        name += `_tl${time}`
        parameters.push(`--tl ${time}s`)
      }

      if ('pattern_type' in body) {
        const pattern = pattern_type(body['pattern_type'])
        name += `_pt${pattern}`
        parameters.push(`--pt ${pattern}`)
      }

      if ('strategy' in body) {
        const strat = strategy(body['strategy'])
        name += `_str${strat}`
        parameters.push(`--str ${strat}`)
      }

      if ('minimum_frequency' in body) {
        const minf = minimum_frequency(body['minimum_frequency'], body['path'])
        name += `_fmin${minf}`
        parameters.push(`--cst fmin=${minf}`)
      }

      if ('minimum_length' in body) {
        name += `_lmin${body['minimum_length']}`
        parameters.push(`--cst lmin=${body['minimum_length']}`)
      }

      if ('bitset_type' in body) {
        const type = bitset_type(body['bitset_type'])
        name += `_bst${type}`
        parameters.push(`--bst ${type}`)
      }

      if (!command) {
        throw `wrong command (${command} given)`
      } else {
        const cmds = ['cpsky', 'closedsky']

        const cmd = command.toLowerCase()
        if (!cmds.includes(cmd)) {
          throw `wrong command (${command} given)`
        }
      }

      // `java -jar ${pathJar}skypattern.jar`

      // name += `_${parameters.join('_')}`.replace(/\s-/g, '') // remove whitespaces
      parameters = [command, source, `--sp`, `--json results/${name}.json`, ...parameters]

      console.log(`java -jar ${pathJar}skypattern.jar ${parameters.join(' ')}`)
      console.log(parameters)

      update_status(name, 'ONGOING')
      exec(`java -jar ${pathJar}skypattern.jar ${parameters.join(' ')}`, [], function (error, stdout, stderr) {
        if (error) {
          console.error(stderr)
          update_status(name, 'STOPPED')
        } else {
          console.log(stdout)
          update_status(name, 'COMPLETE')
        }
      })
      callback()
    } catch (err) {
      console.error(err)
      callback(err)
    }
  }

  app.post('/analysis/new', function (req, res) {
    launch(function (err) {
      if (err) {
        res.status(400).send(err)
      } else {
        res.status(201).send('Created')
      }
    }, req.body)
  })
}

module.exports = launcher
