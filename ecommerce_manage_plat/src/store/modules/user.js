import { resolve } from "path";
import { userLogin } from "@/api/getData"
import { getToken, setToken, removeToken } from '@/utils/auth'

//初始化数据
const state = {
    userinfo: {
        type: '',
        expire_in: '',
        token: '',
        logintime: ''
    },
    headerIcon: 'default.jpg',
    menu: []
}

//事件  同步、异步
//第一个参数{commit}或是同步异步的提交方式 dispatch
const actions = {
    loginUser({ commit }, userinfo) {
        
        return new Promise((resolve, reject) => {
            userLogin({
                user_name: userinfo.username,
                password: userinfo.password
            }).then(response => {
                
                if (response.code == 0 && response.data) {
                    commit('SET_TOKEN', response.data.token)
                    setToken(response.data)
                    resolve()
                } else {
                    reject(response.message)
                }
            }).catch(error => {
                
                reject(error)
            })
        })
    },
    // 前端 登出
    FedLogOut({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
        })
    },
}
//更改状态的逻辑，是一些操作数据的js逻辑
const mutations = {
    SET_TOKEN(state, data) {
        
        state.userinfo = {
            token: data,
            isLogin: true
        }
    },
    SET_MENU(state, menu) {
        state.menu = menu
    }
}
const getters = {
    token:state=>state.userinfo.token
}

export default {
    state,
    // getters,
    actions,
    mutations,
    getters
}