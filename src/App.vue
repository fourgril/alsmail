<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--<router-link to="/"> 登陆</router-link>-->
    <!--这里的router-link 就是将组件渲染到这里，实际是一个a标签，to写的是path路径，和index.js中是一致的。-->
    <!--<router-link to="/myEmail"> email</router-link>-->
    <ul >
      <li id="email">
        <a class="active"><router-link to="/email"><i class="el-icon-news"></i> <b>Mail</b></router-link></a>
      </li>

      <li id="train">
        <a><router-link to="/uploadAnswer"><i class="el-icon-document"></i><b>Train</b></router-link></a>
      </li>
      <li id="rpaLog">
        <a><router-link to="/rpaLog"><i class="el-icon-tickets"><b>RPALog</b></i></router-link></a>
      </li>
    </ul>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{isRouterAlive:true}
  },
  methods:{
    reload(){
      this.isRouterAlive=false;
      this.$nextTick(function (){
        this.isRouterAlive = true;
      })
    }
  }
}
$(function(){
  $("#email a").click(function() {
    $(this).parent().siblings().children('a').removeClass('active');//方法2
    $(this).addClass('active');
  });
  $("#train a").click(function() {
    $(this).parent().siblings().children('a').removeClass('active');//方法2
    $(this).addClass('active');
  });
  $("#rpaLog a").click(function() {
    $(this).parent().siblings().children('a').removeClass('active');//方法3
    $(this).addClass('active');
  });
});
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
ul{
  list-style-type: none;
  padding: 0;
  width: 100px;
  /**background-color: #f1f1f1;**/
  /**border: 1px solid #909399;**/
  margin-left: 93px;
  margin-bottom: -132px
}
li a {
  display: block;
  color: #000;
  padding: 5px 10px;
  text-decoration: none;

}

/* 鼠标移动到选项上修改背景颜色 */
li a:hover {
  background-color: #b0b8bb;
  color: white;
}
a:visited{
  background:#b0b8bb;
}
a.active{
  background:#b0b8bb;
}
li {
  text-align: center;
  /**border-bottom: 1px solid #909399;**/
}
li:last-child {
  border-right: none;
}
a:after {
  content: '';
  display: block;
  position: absolute;
  background-color: orange;

}
</style>
