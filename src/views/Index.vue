<template>
  <a-layout class="h100vh">
    <a-layout-sider theme="dark" class="l-layout-sider" v-model="collapsed">
      <div class="l-layout-sider-image-header">
        <img v-show="!collapsed" class="l-layout-sider-image-header-logo" src="/img/logo_symbol.svg" alt="">
        <img v-show="collapsed" class="l-layout-sider-image-header-logo" src="/img/logo_symbol_small.svg" alt="">
        <!--        <h3 v-show="!collapsed">EZGO</h3>-->
      </div>
      <a-menu
        :defaultSelectedKeys="selectKeys"
        :defaultOpenKeys="tabKeys"
        mode="inline"
        theme="dark"
        :inlineCollapsed="collapsed"
      >
        <!--        <a-menu-item :key="menuMain.title">-->
        <!--          <router-link :to="menuMain.link">-->
        <!--            <a-icon :type="menuMain.icon"/>-->
        <!--            <span>{{menuMain.title}}</span>-->
        <!--          </router-link>-->
        <!--        </a-menu-item>-->
        <a-sub-menu :key="item.title" v-for="item of computed_menuItems">
          <span slot="title"><a-icon :type="item.icon"/><span>{{item.title}}</span></span>
          <a-menu-item :key="child.link" v-for="child of item.children">
            <router-link :to="child.link">{{child.title}}</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>

    </a-layout-sider>
    <a-layout>
      <a-layout-header class="pa-0px l-layout-header">
        <div class="container-fluid d-flex justify-content-between align-items-center">
          <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggleCollapsed"/>
          <div class="d-flex">
            <a-dropdown class="l-layout-header-dropwon">
            <span class="action ant-dropdown-link user-dropdown-menu">
              <a-icon type="user"/>
              <span class="ml-12px">{{info?info.cn_name:''}}</span>
            </span>
              <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
                <a-menu-item key="3">
                  <a href="javascript:;" @click="handleLogout">
                    <a-icon type="logout"/>
                    <span class="ml-12px">登出</span>
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>
      <router-view v-if="configsetting"></router-view>
    </a-layout>


  </a-layout>
</template>

<script>
  import Vue from 'vue'
  import {mapState} from 'vuex'
  // let menuMain = {
  //   icon: 'mail',
  //   title: '後台總覽',
  //   children: [],
  //   link: '/'
  // }
  let menuItems = [
    {
      icon: 'lock',
      title: '權限管理',
      permission: 'permission_role_manage',
      children: [{
        title: '帳號管理',
        link: '/manager'
      }, {
        title: '權限管理',
        link: '/permission'
      }]
    },
    {
      icon: 'user',
      title: '會員管理',
      permission: 'permission_member_manage',
      children: [{
        title: '會員列表',
        link: '/member'
      }]
    }
    ,
    {
      icon: 'shopping-cart',
      title: '訂單管理',
      permission: 'permission_order_manage',
      children: [{
        title: '訂單列表',
        link: '/order'
      }]
    },
    {
      icon: 'form',
      title: '文案管理',
      permission: 'permission_banner_manage',
      children: [{
        title: '首頁大圖管理',
        link: '/banner'
      }]
    },
    {
      icon: 'tags',
      title: '分類管理',
      permission: 'permission_catalog_manage',
      children: [{
        title: '主分類管理',
        link: '/category'
      }, {
        title: '品牌分類管理',
        link: '/brand'
      }, {
        title: '自定義標籤管理',
        link: '/tags'
      }]
    },
    {
      icon: 'inbox',
      title: '商品管理',
      permission: 'permission_product_manage',
      children: [{
        title: '商品列表',
        link: '/products'
      }]
    },
    {
      icon: 'pay-circle',
      title: '優惠管理',
      permission: 'permission_coupon_manage',
      children: [{
        title: '運費管理',
        link: '/free_shipping'
      }, {
        title: '優惠券管理',
        link: '/coupon'
      }, {
        title: '忠誠點數管理',
        link: '/reward'
      }, {
        title: '買就送活動管理',
        link: '/activity'
      }]
    }
  ]
  export default {
    data() {
      return {
        collapsed: false,
        // menuMain,
        menuItems,
        selectKeys: [],
        tabKeys: []
      }
    },
    computed: {
      ...mapState('manager', {
        info: state => state.info
      }),
      ...mapState('configsetting', {
        configsetting: state => state.item
      }),
      computed_menuItems() {
        let ret = []
        for (let el of this.menuItems) {
          if (this.info && (
            this.info.permission_highest_permission || parseInt(this.info[el.permission]) >= 1
          )) {
            ret.push(el)
          }
        }
        return ret
      },
    },
    methods: {
      handleLogout() {
        Vue.ls.set('token', null)
        this.$router.push('/login')
      },
      initMenuSelect() {
        // let item = this.menuMain
        // if (item.link && item.link === this.$route.path) {
        //   this.selectKeys = [item.title]
        //   this.tabKeys = [item.title]
        //   return
        // }

        for (let item of menuItems) {
          for (let child of item.children) {
            if (child.link === this.$route.path) {
              this.selectKeys = [child.link]
              this.tabKeys = [item.title]
              break
            }
          }
        }
      },
      toggleCollapsed() {
        this.collapsed = !this.collapsed
      }
    },
    created() {
      this.initMenuSelect()
      this.$store.dispatch('manager/getInfo')
      this.$store.dispatch('configsetting/getList')
    }
  }
</script>
