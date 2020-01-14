import { default } from './RegisterActor.vue';
<template>
  <div class="scan">
    
  </div>
</template>

<script>
  export default{
    data(){
      return{
        fullName:'',
        firstName:'',
        lastName:'',
        user:{
          name:'libai',
          isLogin:false
        }
      }
    },
    computed: {
      fullName:{
        get:function(){
          return this.fullName =  this.firstName + this.lastName;
        },
        set:function(newValue){
          var names = newValue.split('');
          this.firstName = names[0];
          this.lastName = names[1];
        }
      }
    },
    watch: {
      'user.isLogin':function(newValue,oldValue){//监听对象中的某个属性
        this.fullName = newValue;
      },
      'user':{//监听整个对象
        handler:function(newValue,oldValue){

        },
        deep:true,
        immediate:true//当值第一次进行绑定的时候不会触发watch immediate 可以在绑定的时候就触发执行
      }
    },
  }
</script>
<style lang="scss">
  
</style>
 
