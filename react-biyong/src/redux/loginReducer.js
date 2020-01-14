import * as types from './action-type.js';
const initialState = {
    userId: '',
    openId: '',
    avatar: '',
    nickName: '',
    from: '',
    province: '北京市',
    city: '北京市',
    todayFirstLogin: '',
    address:''
}

export default function login(state = initialState, action) {
    switch (action.type) {
        case types.LOGIN:
            return  Object.assign({}, state, {
                userId: action.user.userId,
                openId: action.user.openId,
                avatar: action.user.avatar,
                nickName: action.user.nickName,
                from: action.user.from,
                todayFirstLogin: action.user.todayFirstLogin,
                address:""
              })
        case types.SAVE_LOCATION:
            return  Object.assign({}, state, {
                province: action.locate.province,
                city: action.locate.city
              })
        case types.LOGOUT:
            return  Object.assign({}, state, {
                userId: '',
                avatar: '',
                nickName: ''
              })
        case types.CHANGE_FIRST:
              return Object.assign({}, state, {
                todayFirstLogin: action.first
              })
        case types.ADDRESS:
              return  Object.assign({}, state, {
                address: action.num
              })
        default:
            return state
    }
}