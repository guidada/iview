import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 10000;

axios.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data)
    config.headers = {
      'Content-Type' : 'application/x-www-form-urlencoded'
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}
