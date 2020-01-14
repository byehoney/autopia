import axios from 'axios'
import qs from 'qs'
axios.defaults.timeout = 12000 // 请求超时时间
// axios.defaults.baseURL = process.env.VUE_APP_BASE_API
// axios.defaults.baseURL = 'http://bigdata.chetuobang.com'
axios.defaults.baseURL = 'http://tbigdata.chetuobang.com/'
axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded;charset=UTF-8' // post请求头的设置
// axios 请求拦截器
axios.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.error(error)
    }
)
// axios respone拦截器
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误 结合自身业务和后台返回的接口状态约定写respone拦截器
        if (response.status === 200) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    error => {
        const responseCode = error.response.status
        return Promise.reject(error.response)
    }
)
/**
 * 封装get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function get (url, params = {}) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params
            })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                
            })
    })
    // 或者return axios.get();
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function post (url, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, qs.stringify(params))
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                
            })
    })
    //  或者return axios.post();
}
//上传图片的方法
function upload(Url, data,handle) {
    let instance = axios.create({
        withCredentials: false,
        baseURL: '',
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    instance.post(Url, data).then(res => {
        handle(res.data);
    }).catch(error => {
        console.log(error)
    })
};
export { get, post ,upload}
