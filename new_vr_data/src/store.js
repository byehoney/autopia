import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    curIndex:sessionStorage.getItem('curIndex')||0,//默认激活菜单
    curShowSub:sessionStorage.getItem('curShowSub')||-1,
    curSubIndex:sessionStorage.getItem('curSubIndex')||-1,
    size:1,
  },
  mutations: {
    saveCurIndex(state,index){
      sessionStorage.setItem('curIndex',index);
      sessionStorage.setItem('curShowSub',index);
      state.idnex = index;
      state.curShowSub = index;
    },
    saveCurSubIndex(state,index){
      sessionStorage.setItem('curSubIndex',index);
      state.curSubIndex = index
    },
    saveZoom(state,size){
      state.size = size;
    }
  },
  actions: {

  }
})
