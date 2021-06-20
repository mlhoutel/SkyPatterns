const axios = require('axios')

const parametersUrl = (url, params) => {
  const parameters = Object.keys(params).reduce((accumulator, key, index) => {
    const value = JSON.stringify(params[key])
    return index > 0 ? accumulator + '&' + key + '=' + value : accumulator + key + '=' + value
  }, '?')

  return url + parameters
}

async function request(method, url, body) {
  try {
    const response = await method(url, body)
    /*
    if (response.status == 204) {
      return response
    } else {
      return response.data
    }
    */
    return response
  } catch (err) {
    throw new Error(err)
  }
}

const Requests = {
  get(url) {
    return request(axios.get, url)
  },
  post(url, data) {
    return request(axios.post, url, data)
  },
  put(url, data) {
    return request(axios.put, url, data)
  },
  delete(url) {
    return request(axios.delete, url)
  },
  parametersUrl,
}

export default Requests
