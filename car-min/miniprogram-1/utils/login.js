import {http} from './http.js'
const loginurl ="/api/v1/login/minipro"
export default function login(param){
  return http({
    url: loginurl,
    data: param,
    errBack:true
  })
}
