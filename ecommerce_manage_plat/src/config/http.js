import {
  baseUrl
} from './env'
import {
  Loading
} from 'element-ui';
import axios from './axios'

export function get(url, data = {}) {
  let loadingInstance = Loading.service({
    fullscreen: true
  });
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: data
    }).then(response => {
      loadingInstance.close();
      if (response.data) {
        if (response.data.code == 0) {
          
          return resolve(response.data)
        } else {
          // this.$message.error(response.message)
          return resolve(response.data)
        }
      }
      return reject("none")
    }).catch(err => {
      loadingInstance.close();
      reject(err)
    })
  })
}

export async function post(url, data = {}) {
  let loadingInstance = Loading.service({
    fullscreen: true
  });
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        loadingInstance.close();
        if (response.data.code == 0) {
          return resolve(response.data)
        } else {
          return resolve(response.data)
          // this.$message.error(response.message)
        }
        return reject("none")
      })
      .catch(err => {
        loadingInstance.close();
        reject(err)
      })
  })
}
