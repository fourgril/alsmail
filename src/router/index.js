import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import email from '@/components/email'
import main from '@/components/Main'
import uploadAnswer from '@/components/uploadAnswer'
import rpaLog from '@/components/rpaLog'
import error from '@/components/404'
Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/email',
      name: 'email',
      component: email
    },
    {
      path: '/',
      redirect: '/email'
    },
    {
      path: '/main',
      name: 'main',
      component: main
    },
    {
      path: '/uploadAnswer',
      name: 'uploadAnswer',
      component: uploadAnswer
    },
    {
      path: '/rpaLog',
      name: 'rpaLog',
      component: rpaLog
    },
    {
      path: '*',
      name: 'error',
      component: error,
      hidden: true
    }
]
})
