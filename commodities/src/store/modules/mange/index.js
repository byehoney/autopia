export default {
    namespaced: true,
    state: {
        showDrawLeft:false,
    },
    mutations: {
        changeDrawLeft(state,data){
            state.showDrawLeft = data;
        }
    },
    actions: {
    },
    getters: {
    }

}