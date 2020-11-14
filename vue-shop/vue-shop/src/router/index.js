import Vue from 'vue'
import VueRouter from 'vue-router'


const login =()=>import('../components/login.vue')
const Home =()=>import('../components/Home.vue')
const welcome =()=>import('../components/welcome.vue')
const user =()=>import('../components/users/user.vue')
const Rights =()=>import( '../components/rights/Rights.vue')
const Roles =()=>import('../components/rights/roles.vue')
const Cate =()=>import('../components/goods/Cate.vue')
const Params =()=>import('../components/goods/Params.vue')
const List =()=>import('../components/goods/List.vue')
const AddGoods =()=>import( '../components/goods/Add.vue')
const Orders =()=>import('../components/orders/Orders.vue')
const Report =()=>import('../components/report/Report.vue')

Vue.use(VueRouter)

  const routes = [
  {path:'',component:login},
  {path:'/login',component:login},
  {path:'/home',component:Home,
  redirect:'/welcome',
  children:[
    {path:'/welcome',component:welcome},
    {path:'/users',component:user},
    {path:'/rights',component:Rights},
    {path:'/roles',component:Roles},
    {path:'/categories',component:Cate},
    {path:'/params',component:Params},
    {path:'/goods',component:List},
    {path:'/goods/add',component:AddGoods},
    {path:'/orders',component:Orders},
    {path:'/reports',component:Report}
  ]
}
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  // console.log(window.sessionStorage.getItem('token'))
  if(to.path=='/login'){
    return next()
  }
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr){
    return next('/login')
  }
  next()
})

export default router
