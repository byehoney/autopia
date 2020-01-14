import Vuex from 'vuex'
import Vue from 'vue'
import test from '@/store/modules/test'
import user from '@/store/modules/user'
import getters from '@/store/getters'

Vue.use(Vuex)


const store = new Vuex.Store({
    modules: {
        test,
        user
    },
    getters
})
export default store