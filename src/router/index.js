import Vue from 'vue'
import VueRouter from 'vue-router'
import Banner from '@/views/Banner.vue'
import Test from '@/views/Test.vue'
import Login from '@/views/Login.vue'
import Permission from "@/views/Permission"
import Category from "@/views/Category"
import Brand from "@/views/Brand"
import FreeShipping from "@/views/FreeShipping"
import Manager from "@/views/Manager"
import Member from "@/views/Member"
import NewProducts from "@/views/NewProducts"
import Order from "@/views/Order"
import Products from "@/views/Products"
import Reward from "@/views/Reward"
import Ship from "@/views/Ship"
import Tags from "@/views/Tags"
import Index from "@/views/Index"
import Coupon from "@/views/Coupon"
import NoPermission from "@/views/NoPermission"
import ProductEdit from "@/views/ProductEdit"
import Activity from "@/views/Activity"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
    redirect: '/order',
    children: [
      {
        path: '/banner',
        name: 'banner',
        component: Banner
      },
      {
        path: '/activity',
        name: 'activity',
        component: Activity
      },
      {
        path: '/coupon',
        name: 'coupon',
        component: Coupon
      },
      {
        path: '/permission',
        name: 'permission',
        component: Permission
      },
      {
        path: '/category',
        name: 'category',
        component: Category
      },
      {
        path: '/brand',
        name: 'brand',
        component: Brand
      },
      {
        path: '/free_shipping',
        name: 'free_shipping',
        component: FreeShipping
      },
      {
        path: '/manager',
        name: 'manager',
        component: Manager
      },
      {
        path: '/member',
        name: 'member',
        component: Member
      },
      {
        path: '/new_products',
        name: 'new_products',
        component: NewProducts
      },
      {
        path: '/order',
        name: 'order',
        component: Order
      },
      {
        path: '/products',
        name: 'products',
        component: Products,
      },
      {
        path: '/reward',
        name: 'reward',
        component: Reward
      },
      {
        path: '/ship',
        name: 'ship',
        component: Ship
      },
      {
        path: '/tags',
        name: 'tags',
        component: Tags
      },
      {
        path: '/nopermission',
        name: 'nopermission',
        component: NoPermission
      },
      {
        path: '/products/create',
        name: 'product_edit_create',
        component: ProductEdit
      },
      {
        path: '/products/:id',
        name: 'product_edit',
        component: ProductEdit
      },
    ]
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
