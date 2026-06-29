# 美多商城前端 Vue 2 CLI 升级开发文档

## 一、项目现状分析

### 1.1 当前技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 2.5.16 | 前端框架 |
| jQuery | 1.12.4 | DOM 操作、轮播图 |
| axios | 0.18.0 | HTTP 请求 |
| 原生 HTML/CSS | - | 页面结构 |

### 1.2 当前架构特点

- **多页面应用（MPA）**：每个页面独立一个 HTML 文件，各自创建 Vue 实例
- **无构建工具**：直接通过 `<script>` 标签引入 Vue、axios、jQuery
- **无组件化**：每个页面的 Vue 实例直接挂载到 `#app`，没有拆分组件
- **模板语法**：使用 `[[ ]]` 作为插值分隔符（避免与 Django 模板冲突）
- **全局变量依赖**：`host`、`getCookie`、`generateUUID` 等全局变量/函数
- **无路由管理**：页面跳转通过 `location.href` 实现
- **无状态管理**：用户状态通过 Cookie / sessionStorage / localStorage 管理

### 1.3 当前页面清单

| 页面 | HTML 文件 | JS 文件 | 功能说明 |
|------|-----------|---------|----------|
| 首页 | index.html | index.js | 轮播图、商品分类、楼层展示、购物车 |
| 登录 | login.html | login.js | 用户名密码登录、QQ 第三方登录 |
| 注册 | register.html | register.js | 用户名/密码/手机号/短信验证码/图片验证码 |
| 商品详情 | detail.html | detail.js | 商品信息、加入购物车、浏览历史、评价 |
| 商品列表 | list.html | list.js | 分类筛选、排序、分页 |
| 搜索 | search.html | search.js | 关键字搜索、分页 |
| 购物车 | cart.html | cart.js | 商品增删改、全选、结算 |
| 下单 | place_order.html | place_order.js | 地址选择、支付方式、提交订单 |
| 订单成功 | order_success.html | order_success.js | 订单信息展示、支付跳转 |
| 用户信息 | user_center_info.html | user_center_info.js | 个人信息、邮箱绑定、浏览历史 |
| 用户地址 | user_center_site.html | user_center_site.js | 地址增删改、省市区三级联动 |
| 修改密码 | user_center_pass.html | user_center_pass.js | 旧密码/新密码/确认密码 |
| 用户订单 | user_center_order.html | user_center_order.js | 订单列表 |
| QQ 回调 | oauth_callback.html | oauth_callback.js | QQ 登录回调处理、绑定手机号 |
| 商品评价 | goods_judge.html | goods_judge.js | 星级评分 |
| 邮箱验证 | success_verify_email.html | - | 邮箱验证成功提示 |
| 支付成功 | pay_success.html | - | 支付成功提示 |

---

## 二、升级方案概述

### 2.1 升级目标

1. 使用 Vue CLI 4/5 脚手架搭建标准化 Vue 2 项目
2. 引入 Vue Router 管理路由，实现 SPA 单页面应用
3. 引入 Vuex 管理全局状态
4. 组件化重构所有页面
5. 使用 webpack 构建工具（Vue CLI 内置）
6. 保留 Vue 2 Options API 风格，降低迁移难度

### 2.2 技术选型

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | ^2.7.16 | Vue 2 最新版，支持 Composition API |
| Vue CLI | ^5.0.0 | 脚手架工具 |
| Vue Router | ^3.6.0 | 路由管理（Vue 2 对应 3.x 版本） |
| Vuex | ^3.6.0 | 状态管理（Vue 2 对应 3.x 版本） |
| Axios | ^1.6.0 | HTTP 请求 |
| jQuery | ^3.7.0 | 保留用于轮播图（可选后续移除） |
| vue-lazyload | ^1.3.0 | 图片懒加载（可选） |

### 2.3 为什么选择 Vue 2 CLI 而非 Vue 3

| 对比项 | Vue 2 CLI | Vue 3 + Vite |
|--------|-----------|--------------|
| 学习成本 | 低，Options API 保持不变 | 高，需学习 Composition API |
| 代码迁移量 | 小，语法基本不变 | 大，需重写所有逻辑 |
| 生态兼容性 | 成熟稳定，第三方库兼容好 | 部分库尚未适配 |
| 团队适应 | 快速上手 | 需要培训 |
| 长期维护 | 官方已停止更新（2023.12.31） | 官方推荐，长期支持 |

> **建议**：如果团队对 Vue 2 更熟悉、希望快速完成迁移，可先升级到 Vue 2 CLI 标准化项目，后续再考虑升级到 Vue 3。

---

## 三、升级步骤详解

### 步骤 1：安装 Vue CLI

```bash
# 全局安装 Vue CLI
npm install -g @vue/cli

# 验证安装
vue --version
```

### 步骤 2：创建 Vue 2 项目

```bash
# 1. 创建项目
cd d:\MyProject\meiduoshop
vue create meiduoshop_web_v2

# 2. 手动选择配置
# ? Please pick a preset: Manually select features
# ? Check the features needed for your project:
#   ◉ Babel
#   ◉ Router
#   ◉ Vuex
#   ◉ CSS Pre-processors（可选，如需使用 Sass/Less）
#   ◉ Linter / Formatter
#
# ? Choose a version of Vue.js that you want to start the project with
#   ❯ 2.x
#
# ? Use history mode for router? Yes
# ? Pick a CSS pre-processor: Sass/SCSS (with dart-sass) 或 不选
# ? Pick a linter / formatter config: ESLint + Prettier
# ? Pick additional lint features: Lint on save
# ? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
# ? Save this as a preset for future projects? No

# 3. 进入项目并安装依赖
cd meiduoshop_web_v2
npm install

# 4. 安装额外依赖
npm install axios jquery
npm install vue-lazyload  # 可选：图片懒加载

# 5. 启动开发服务器
npm run serve
```

### 步骤 3：项目目录重构

```
meiduoshop_web_v2/
├── public/                          # 静态资源（不经过 webpack）
│   ├── index.html                   # HTML 入口
│   └── images/                      # 图片资源
│       ├── goods/
│       ├── logo.png
│       ├── banner01.jpg
│       └── ...
├── src/
│   ├── assets/                      # webpack 处理的资源
│   │   ├── css/
│   │   │   ├── reset.css            # 样式重置
│   │   │   └── main.css             # 全局主样式
│   │   └── images/
│   ├── components/                  # 公共组件
│   │   ├── AppHeader.vue            # 头部导航
│   │   ├── AppFooter.vue            # 底部
│   │   ├── SearchBar.vue            # 搜索栏
│   │   ├── CartDropdown.vue         # 购物车下拉
│   │   ├── Pagination.vue           # 分页组件
│   │   └── SlideShow.vue            # 轮播图组件
│   ├── views/                       # 页面视图
│   │   ├── HomeView.vue             # 首页
│   │   ├── LoginView.vue            # 登录页
│   │   ├── RegisterView.vue         # 注册页
│   │   ├── GoodsDetailView.vue      # 商品详情
│   │   ├── GoodsListView.vue        # 商品列表
│   │   ├── SearchView.vue           # 搜索页
│   │   ├── CartView.vue             # 购物车
│   │   ├── PlaceOrderView.vue       # 下单页
│   │   ├── OrderSuccessView.vue     # 订单成功
│   │   ├── PaySuccessView.vue       # 支付成功
│   │   ├── UserCenter/
│   │   │   ├── UserInfoView.vue     # 用户信息
│   │   │   ├── UserSiteView.vue     # 用户地址
│   │   │   ├── UserPassView.vue     # 修改密码
│   │   │   └── UserOrderView.vue    # 用户订单
│   │   ├── OAuthCallbackView.vue    # QQ 回调
│   │   ├── GoodsJudgeView.vue       # 商品评价
│   │   └── EmailVerifyView.vue      # 邮箱验证成功
│   ├── mixins/                      # 混入
│   │   ├── authMixin.js             # 认证相关混入（退出登录等）
│   │   └── cartMixin.js             # 购物车混入
│   ├── store/                       # Vuex 状态管理
│   │   ├── index.js                 # Store 入口
│   │   ├── modules/
│   │   │   ├── user.js              # 用户模块
│   │   │   └── cart.js              # 购物车模块
│   ├── utils/                       # 工具函数
│   │   ├── request.js               # axios 封装
│   │   ├── cookie.js                # Cookie 操作
│   │   ├── validate.js              # 表单验证
│   │   └── helpers.js               # 通用辅助函数
│   ├── router/                      # 路由配置
│   │   └── index.js
│   ├── App.vue                      # 根组件
│   └── main.js                      # 入口文件
├── vue.config.js                    # Vue CLI 配置
├── package.json
├── .env.development                 # 开发环境变量
├── .env.production                  # 生产环境变量
└── ...
```

---

## 四、核心文件迁移详解

### 4.1 入口文件 main.js

**原代码**：每个页面独立创建 Vue 实例，无统一入口

**新代码**：

```javascript
// src/main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局样式（自行编写）
import './assets/css/reset.css'
import './assets/css/main.css'

// 引入全局工具函数（挂载到 Vue 原型）
import { getCookie, getQueryString, generateUUID } from './utils/helpers'
Vue.prototype.$getCookie = getCookie
Vue.prototype.$getQueryString = getQueryString
Vue.prototype.$generateUUID = generateUUID

// 引入 axios 封装
import request from './utils/request'
Vue.prototype.$http = request

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

### 4.2 根组件 App.vue

```vue
<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 全局样式已在 main.js 中引入 */
</style>
```

### 4.3 路由配置 router/index.js

```javascript
// src/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { hideHeader: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { hideHeader: true }
  },
  {
    path: '/goods/:id',
    name: 'GoodsDetail',
    component: () => import('../views/GoodsDetailView.vue')
  },
  {
    path: '/list',
    name: 'GoodsList',
    component: () => import('../views/GoodsListView.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/SearchView.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/CartView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/place_order',
    name: 'PlaceOrder',
    component: () => import('../views/PlaceOrderView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order_success',
    name: 'OrderSuccess',
    component: () => import('../views/OrderSuccessView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pay_success',
    name: 'PaySuccess',
    component: () => import('../views/PaySuccessView.vue')
  },
  {
    path: '/user_center_info',
    name: 'UserInfo',
    component: () => import('../views/UserCenter/UserInfoView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user_center_site',
    name: 'UserSite',
    component: () => import('../views/UserCenter/UserSiteView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user_center_pass',
    name: 'UserPass',
    component: () => import('../views/UserCenter/UserPassView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user_center_order',
    name: 'UserOrder',
    component: () => import('../views/UserCenter/UserOrderView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/oauth_callback',
    name: 'OAuthCallback',
    component: () => import('../views/OAuthCallbackView.vue')
  },
  {
    path: '/goods_judge',
    name: 'GoodsJudge',
    component: () => import('../views/GoodsJudgeView.vue')
  },
  {
    path: '/success_verify_email',
    name: 'EmailVerify',
    component: () => import('../views/EmailVerifyView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫：需要登录的页面
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next({
      path: '/login',
      query: { next: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
```

### 4.4 Vuex 状态管理 store/index.js

```javascript
// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    cart
  }
})
```

### 4.5 Vuex 用户模块 store/modules/user.js

```javascript
// src/store/modules/user.js
import request from '@/utils/request'
import { getCookie } from '@/utils/helpers'

const state = {
  username: getCookie('username') || '',
  token: localStorage.getItem('token') || sessionStorage.getItem('token') || '',
  userId: localStorage.getItem('user_id') || sessionStorage.getItem('user_id') || ''
}

const getters = {
  isLoggedIn: state => !!state.token
}

const mutations = {
  SET_USER(state, { username, token, userId }) {
    state.username = username
    state.token = token
    state.userId = userId
  },
  CLEAR_USER(state) {
    state.username = ''
    state.token = ''
    state.userId = ''
  }
}

const actions = {
  login({ commit }, { username, password, remember }) {
    return request.post('/login/', {
      username,
      password,
      remembered: remember
    }).then(response => {
      if (response.data.code === 0) {
        const storage = remember ? localStorage : sessionStorage
        storage.setItem('token', response.data.token)
        storage.setItem('user_id', response.data.user_id)
        commit('SET_USER', {
          username,
          token: response.data.token,
          userId: response.data.user_id
        })
      }
      return response
    })
  },
  logout({ commit }) {
    return request.delete('/logout/').then(() => {
      localStorage.clear()
      sessionStorage.clear()
      commit('CLEAR_USER')
    })
  },
  getUserInfo({ commit }) {
    return request.get('/info/').then(response => {
      if (response.data.code === 400) {
        return Promise.reject(new Error('未登录'))
      }
      const data = response.data.info_data
      commit('SET_USER', {
        username: data.username,
        token: state.token,
        userId: state.userId
      })
      return data
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

### 4.6 Vuex 购物车模块 store/modules/cart.js

```javascript
// src/store/modules/cart.js
import request from '@/utils/request'

const state = {
  carts: [],
  cartTotalCount: 0
}

const getters = {
  totalSelectedCount: state => {
    return state.carts
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.count, 0)
  },
  totalSelectedAmount: state => {
    return state.carts
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.price * item.count, 0)
      .toFixed(2)
  },
  isAllSelected: state => {
    return state.carts.length > 0 && state.carts.every(item => item.selected)
  }
}

const mutations = {
  SET_CARTS(state, carts) {
    state.carts = carts
  },
  SET_CART_TOTAL_COUNT(state, count) {
    state.cartTotalCount = count
  }
}

const actions = {
  getCart({ commit }) {
    return request.get('/carts/simple/').then(response => {
      const carts = response.data.cart_skus.map(item => ({
        ...item,
        name: item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name
      }))
      commit('SET_CARTS', carts)
      commit('SET_CART_TOTAL_COUNT', carts.reduce((sum, item) => sum + item.count, 0))
    })
  },
  updateCartItem({ dispatch }, { skuId, count, selected }) {
    return request.put('/carts/', {
      sku_id: skuId,
      count,
      selected
    }).then(() => {
      dispatch('getCart')
    })
  },
  deleteCartItem({ dispatch }, skuId) {
    return request.delete('/carts/', {
      data: { sku_id: skuId }
    }).then(() => {
      dispatch('getCart')
    })
  },
  toggleSelectAll({ dispatch }, selected) {
    return request.put('/carts/selection/', { selected }).then(() => {
      dispatch('getCart')
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

### 4.7 Axios 封装 utils/request.js

```javascript
// src/utils/request.js
import axios from 'axios'

const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://www.meiduo.site:8000',
  timeout: 10000,
  withCredentials: true
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request
```

### 4.8 工具函数 utils/helpers.js

```javascript
// src/utils/helpers.js
// 从原项目 common.js 迁移

export function getCookie(name) {
  const r = document.cookie.match('\\b' + name + '=([^;]*)\\b')
  return r ? r[1] : undefined
}

export function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURI(r[2])
  }
  return null
}

export function generateUUID() {
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now()
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}
```

### 4.9 表单验证 utils/validate.js

```javascript
// src/utils/validate.js
// 从原项目各页面中提取的验证逻辑

export function validateUsername(username) {
  const re = /^[a-zA-Z0-9_-]{5,20}$/
  const re2 = /^[0-9]+$/
  if (re.test(username) && !re2.test(username)) {
    return { valid: true, message: '' }
  }
  return { valid: false, message: '请输入5-20个字符的用户名且不能为纯数字' }
}

export function validatePassword(password) {
  const len = password.length
  if (len < 8 || len > 20) {
    return { valid: false, message: '密码长度为8-20个字符' }
  }
  return { valid: true, message: '' }
}

export function validateMobile(mobile) {
  const re = /^1[345789]\d{9}$/
  if (re.test(mobile)) {
    return { valid: true, message: '' }
  }
  return { valid: false, message: '您输入的手机号格式不正确' }
}

export function validateEmail(email) {
  const re = /^[a-z0-9][\w\.\-]*@[a-z0-9\-]+(\.[a-z]{2,5}){1,2}$/
  if (re.test(email)) {
    return { valid: true, message: '' }
  }
  return { valid: false, message: '邮箱格式不正确' }
}
```

---

## 五、页面迁移示例

### 5.1 首页 HomeView.vue（原 index.html + index.js）

**原 Vue 2 代码（index.js）**：

```javascript
var vm = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        host,
        f1_tab: 1,
        f2_tab: 1,
        f3_tab: 1,
        cart_total_count: 0,
        carts: [],
        username:'',
        content_category:[]
    },
    mounted(){
        this.username = getCookie('username');
        this.get_cart()
    },
    methods: {
        logoutfunc: function () {
            var url = this.host + '/logout/';
            axios.get(url, { responseType: 'json', withCredentials:true })
                .then(response => { location.href = 'login.html'; })
                .catch(error => { console.log(error.response); })
        },
        get_cart(){
            let url = this.host + '/carts/simple/';
            axios.get(url, { responseType: 'json', withCredentials:true })
                .then(response => {
                    this.carts = response.data.cart_skus;
                    this.cart_total_count = 0;
                    for(let i=0;i<this.carts.length;i++){
                        if (this.carts[i].name.length>25){
                            this.carts[i].name = this.carts[i].name.substring(0, 25) + '...';
                        }
                        this.cart_total_count += this.carts[i].count;
                    }
                })
                .catch(error => { console.log(error); })
        },
    }
});
```

**新 Vue 2 CLI 代码（HomeView.vue）**：

```vue
<template>
  <div class="home">
    <AppHeader />

    <!-- 搜索栏 -->
    <div class="search_bar clearfix">
      <router-link to="/" class="logo fl">
        <img src="/images/logo.png" alt="logo">
      </router-link>
      <div class="search_wrap fl">
        <form class="search_con" @submit.prevent="onSearch">
          <input
            v-model="searchKey"
            type="text"
            class="input_text fl"
            placeholder="搜索商品"
          >
          <input type="submit" class="input_btn fr" value="搜索">
        </form>
        <ul class="search_suggest fl">
          <li><a href="#">索尼微单</a></li>
          <li><a href="#">优惠15元</a></li>
          <li><a href="#">美妆个护</a></li>
          <li><a href="#">买2免1</a></li>
        </ul>
      </div>
      <CartDropdown />
    </div>

    <!-- 导航栏 -->
    <div class="navbar_con">
      <div class="navbar">
        <h1 class="fl">商品分类</h1>
        <ul class="navlist fl">
          <li><router-link to="/">首页</router-link></li>
          <li class="interval">|</li>
          <li><a href="#">真划算</a></li>
          <li class="interval">|</li>
          <li><a href="#">抽奖</a></li>
        </ul>
      </div>
    </div>

    <!-- 轮播图 + 分类菜单 -->
    <div class="pos_center_con clearfix">
      <SlideShow :slides="slides" />
      <ul class="sub_menu">
        <li v-for="category in categories" :key="category.id">
          <div class="level1">
            <a
              v-for="item in category.level1"
              :key="item.id"
              :href="item.url"
            >{{ item.name }}</a>
          </div>
          <div class="level2">
            <div
              v-for="group in category.groups"
              :key="group.id"
              class="list_group"
            >
              <div class="group_name fl">{{ group.name }}&gt;</div>
              <div class="group_detail fl">
                <router-link
                  v-for="goods in group.items"
                  :key="goods.id"
                  :to="'/list?cat=' + goods.id"
                >{{ goods.name }}</router-link>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 商品楼层 -->
    <div class="floor">
      <div class="floor_con">
        <div class="subtitle">
          <a
            :class="{ active: f1Tab === 1 }"
            @click="f1Tab = 1"
          >标签1</a>
          <a
            :class="{ active: f1Tab === 2 }"
            @click="f1Tab = 2"
          >标签2</a>
          <a
            :class="{ active: f1Tab === 3 }"
            @click="f1Tab = 3"
          >标签3</a>
        </div>
        <div class="goods_list_con">
          <div
            v-for="tab in 3"
            :key="tab"
            :class="['goods_list', { goods_list_show: f1Tab === tab }]"
          >
            <!-- 商品列表内容 -->
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import CartDropdown from '@/components/CartDropdown.vue'
import SlideShow from '@/components/SlideShow.vue'

export default {
  name: 'HomeView',
  components: {
    AppHeader,
    AppFooter,
    CartDropdown,
    SlideShow
  },
  data() {
    return {
      f1Tab: 1,
      f2Tab: 1,
      f3Tab: 1,
      searchKey: '',
      categories: [],
      slides: [
        { image: '/images/slide01.jpg', link: 'http://www.itcast.cn' },
        { image: '/images/slide02.jpg', link: 'http://www.itcast.cn' },
        { image: '/images/slide03.jpg', link: 'http://www.itcast.cn' },
        { image: '/images/slide04.jpg', link: 'http://www.itcast.cn' }
      ]
    }
  },
  computed: {
    ...mapState('user', ['username']),
    ...mapState('cart', ['cartTotalCount', 'carts'])
  },
  mounted() {
    this.getCart()
  },
  methods: {
    ...mapActions('cart', ['getCart']),
    onSearch() {
      if (this.searchKey.trim()) {
        this.$router.push({ path: '/search', query: { q: this.searchKey } })
      }
    }
  }
}
</script>
```

### 5.2 登录页 LoginView.vue（原 login.html + login.js）

**原 Vue 2 代码（login.js）**：

```javascript
var vm = new Vue({
    el: '#app',
    data: {
        host: host,
        error_username: false,
        error_pwd: false,
        error_pwd_message: '请填写密码',
        username: '',
        password: '',
        remember: false
    },
    methods: {
        check_username: function () {
            this.error_username = !this.username;
        },
        check_pwd: function () {
            if (!this.password) {
                this.error_pwd_message = '请填写密码';
                this.error_pwd = true;
            } else {
                this.error_pwd = false;
            }
        },
        on_submit: function () {
            this.check_username();
            this.check_pwd();
            if (this.error_username == false && this.error_pwd == false) {
                axios.post(this.host + '/login/', {
                    username: this.username,
                    password: this.password,
                    remembered: this.remember,
                }, { responseType: 'json', withCredentials: true })
                .then(response => {
                    if (response.data.code == 0) {
                        var return_url = this.get_query_string('next');
                        if (!return_url) { return_url = '/index.html'; }
                        location.href = return_url;
                    } else if (response.data.code == 400) {
                        this.error_pwd_message = '用户名或密码错误';
                        this.error_pwd = true;
                    }
                })
                .catch(error => {
                    this.error_pwd_message = error.response?.status == 400
                        ? '用户名或密码错误' : '服务器错误';
                    this.error_pwd = true;
                })
            }
        },
        qq_login: function () {
            var next = this.get_query_string('next') || '/';
            axios.get(this.host + '/qq/authorization/?next=' + next, {
                responseType: 'json', withCredentials: true,
            })
            .then(response => {
                if (response.data.code == 0) {
                    location.href = response.data.login_url;
                }
            })
            .catch(error => { console.log(error); })
        }
    }
});
```

**新 Vue 2 CLI 代码（LoginView.vue）**：

```vue
<template>
  <div class="login_page">
    <div class="login_banner">
      <img src="/images/login_banner.png" alt="登录">
    </div>
    <div class="login_form">
      <h2>用户登录</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form_group">
          <input
            v-model="username"
            type="text"
            placeholder="用户名"
            @blur="checkUsername"
          >
          <span v-if="errorUsername" class="error">请填写用户名</span>
        </div>
        <div class="form_group">
          <input
            v-model="password"
            type="password"
            placeholder="密码"
            @blur="checkPwd"
          >
          <span v-if="errorPwd" class="error">{{ errorPwdMessage }}</span>
        </div>
        <div class="form_group">
          <label>
            <input v-model="remember" type="checkbox">
            记住登录
          </label>
        </div>
        <button type="submit" class="login_btn">登录</button>
      </form>
      <div class="other_login">
        <a @click="qqLogin">QQ登录</a>
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import request from '@/utils/request'
import { getQueryString } from '@/utils/helpers'

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      remember: false,
      errorUsername: false,
      errorPwd: false,
      errorPwdMessage: '请填写密码'
    }
  },
  methods: {
    ...mapActions('user', ['login']),
    checkUsername() {
      this.errorUsername = !this.username
    },
    checkPwd() {
      if (!this.password) {
        this.errorPwdMessage = '请填写密码'
        this.errorPwd = true
      } else {
        this.errorPwd = false
      }
    },
    async handleSubmit() {
      this.checkUsername()
      this.checkPwd()
      if (this.errorUsername || this.errorPwd) return

      try {
        const response = await this.login({
          username: this.username,
          password: this.password,
          remember: this.remember
        })
        if (response.data.code === 0) {
          const returnUrl = this.$route.query.next || '/'
          this.$router.push(returnUrl)
        } else if (response.data.code === 400) {
          this.errorPwdMessage = '用户名或密码错误'
          this.errorPwd = true
        }
      } catch (error) {
        this.errorPwdMessage = error.response && error.response.status === 400
          ? '用户名或密码错误'
          : '服务器错误'
        this.errorPwd = true
      }
    },
    async qqLogin() {
      try {
        const next = this.$route.query.next || '/'
        const response = await request.get('/qq/authorization/?next=' + next)
        if (response.data.code === 0) {
          window.location.href = response.data.login_url
        }
      } catch (error) {
        console.error('QQ登录失败:', error)
      }
    }
  }
}
</script>
```

### 5.3 注册页 RegisterView.vue（原 register.html + register.js）

**原 Vue 2 代码（register.js）**：

```javascript
var vm = new Vue({
    el: '#app',
    data: {
        host: host,
        error_name: false,
        error_password: false,
        error_check_password: false,
        error_phone: false,
        error_allow: false,
        error_sms_code: false,
        error_name_message: '',
        error_phone_message: '',
        error_sms_code_message: '',
        error_image_code: '',
        sms_code_tip: '获取短信验证码',
        sending_flag: false,
        image_code_id: '',
        image_code_url: '',
        username: '',
        password: '',
        password2: '',
        mobile: '',
        sms_code: '',
        allow: false,
        image_code: '',
        error_image_code_message: ''
    },
    mounted: function(){
        this.generate_image_code();
    },
    methods: {
        generate_image_code: function(){
            this.image_code_id = generateUUID();
            this.image_code_url = this.host + "/image_codes/" + this.image_code_id + "/";
        },
        check_username: function () {
            var re = /^[a-zA-Z0-9_-]{5,20}$/;
            var re2 = /^[0-9]+$/;
            if (re.test(this.username) && !re2.test(this.username)) {
                this.error_name = false;
            } else {
                this.error_name_message = '请输入5-20个字符的用户名且不能为纯数字';
                this.error_name = true;
            }
            if (this.error_name == false) {
                var url = this.host + '/usernames/' + this.username + '/count/';
                axios.get(url, { responseType: 'json', withCredentials:true })
                    .then(response => {
                        if (response.data.count > 0) {
                            this.error_name_message = '用户名已存在';
                            this.error_name = true;
                        } else {
                            this.error_name = false;
                        }
                    })
                    .catch(error => { console.log(error.response); })
            }
        },
        // ... 其他验证和提交方法
    }
});
```

**新 Vue 2 CLI 代码（RegisterView.vue）**：

```vue
<template>
  <div class="register_page">
    <div class="register_banner">
      <img src="/images/register_banner.png" alt="注册">
    </div>
    <div class="register_form">
      <h2>用户注册</h2>
      <form @submit.prevent="handleSubmit">
        <!-- 用户名 -->
        <div class="form_group">
          <input
            v-model="username"
            type="text"
            placeholder="用户名"
            @blur="checkUsername"
          >
          <span v-if="errorName" class="error">{{ errorNameMessage }}</span>
        </div>
        <!-- 密码 -->
        <div class="form_group">
          <input
            v-model="password"
            type="password"
            placeholder="密码"
            @blur="checkPwd"
          >
          <span v-if="errorPassword" class="error">密码长度为8-20个字符</span>
        </div>
        <!-- 确认密码 -->
        <div class="form_group">
          <input
            v-model="password2"
            type="password"
            placeholder="确认密码"
            @blur="checkCpwd"
          >
          <span v-if="errorCheckPassword" class="error">两次输入的密码不一致</span>
        </div>
        <!-- 手机号 -->
        <div class="form_group">
          <input
            v-model="mobile"
            type="text"
            placeholder="手机号"
            @blur="checkPhone"
          >
          <span v-if="errorPhone" class="error">{{ errorPhoneMessage }}</span>
        </div>
        <!-- 图片验证码 -->
        <div class="form_group">
          <input
            v-model="imageCode"
            type="text"
            placeholder="图片验证码"
            @blur="checkImageCode"
          >
          <img :src="imageCodeUrl" @click="generateImageCode" alt="验证码">
          <span v-if="errorImageCode" class="error">{{ errorImageCodeMessage }}</span>
        </div>
        <!-- 短信验证码 -->
        <div class="form_group">
          <input
            v-model="smsCode"
            type="text"
            placeholder="短信验证码"
            @blur="checkSmsCode"
          >
          <button type="button" @click="sendSmsCode">{{ smsCodeTip }}</button>
          <span v-if="errorSmsCode" class="error">{{ errorSmsCodeMessage }}</span>
        </div>
        <!-- 同意协议 -->
        <div class="form_group">
          <label>
            <input v-model="allow" type="checkbox">
            同意"美多商城用户使用协议"
          </label>
          <span v-if="errorAllow" class="error">请勾选用户协议</span>
        </div>
        <button type="submit" class="register_btn">注册</button>
      </form>
      <div class="other_login">
        <router-link to="/login">已有账号？去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { generateUUID } from '@/utils/helpers'
import { validateUsername, validatePassword, validateMobile } from '@/utils/validate'

export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      password: '',
      password2: '',
      mobile: '',
      smsCode: '',
      imageCode: '',
      allow: false,
      errorName: false,
      errorNameMessage: '',
      errorPassword: false,
      errorCheckPassword: false,
      errorPhone: false,
      errorPhoneMessage: '',
      errorSmsCode: false,
      errorSmsCodeMessage: '',
      errorImageCode: false,
      errorImageCodeMessage: '',
      errorAllow: false,
      smsCodeTip: '获取短信验证码',
      sendingFlag: false,
      imageCodeId: '',
      imageCodeUrl: ''
    }
  },
  mounted() {
    this.generateImageCode()
  },
  methods: {
    generateImageCode() {
      this.imageCodeId = generateUUID()
      this.imageCodeUrl = process.env.VUE_APP_API_BASE_URL + '/image_codes/' + this.imageCodeId + '/'
    },
    checkUsername() {
      const result = validateUsername(this.username)
      this.errorName = !result.valid
      this.errorNameMessage = result.message
      if (!this.errorName) {
        request.get('/usernames/' + this.username + '/count/').then(response => {
          if (response.data.count > 0) {
            this.errorNameMessage = '用户名已存在'
            this.errorName = true
          }
        })
      }
    },
    checkPwd() {
      const result = validatePassword(this.password)
      this.errorPassword = !result.valid
    },
    checkCpwd() {
      this.errorCheckPassword = this.password !== this.password2
    },
    checkPhone() {
      const result = validateMobile(this.mobile)
      this.errorPhone = !result.valid
      this.errorPhoneMessage = result.message
      if (!this.errorPhone) {
        request.get('/mobiles/' + this.mobile + '/count/').then(response => {
          if (response.data.count > 0) {
            this.errorPhoneMessage = '手机号已存在'
            this.errorPhone = true
          }
        })
      }
    },
    checkImageCode() {
      if (!this.imageCode) {
        this.errorImageCodeMessage = '请填写图片验证码'
        this.errorImageCode = true
      } else {
        this.errorImageCode = false
      }
    },
    checkSmsCode() {
      if (!this.smsCode) {
        this.errorSmsCodeMessage = '请填写短信验证码'
        this.errorSmsCode = true
      } else {
        this.errorSmsCode = false
      }
    },
    checkAllow() {
      this.errorAllow = !this.allow
    },
    sendSmsCode() {
      if (this.sendingFlag) return
      this.sendingFlag = true
      this.checkPhone()
      if (this.errorPhone) {
        this.sendingFlag = false
        return
      }
      const url = '/sms_codes/' + this.mobile + '/?image_code=' + this.imageCode + '&image_code_id=' + this.imageCodeId
      request.get(url).then(() => {
        let num = 60
        const t = setInterval(() => {
          if (num === 1) {
            clearInterval(t)
            this.smsCodeTip = '获取短信验证码'
            this.sendingFlag = false
          } else {
            num -= 1
            this.smsCodeTip = num + '秒'
          }
        }, 1000)
      }).catch(error => {
        if (error.response.status === 400) {
          this.errorSmsCodeMessage = error.response.data.message
          this.errorSmsCode = true
        }
        this.sendingFlag = false
      })
    },
    handleSubmit() {
      this.checkUsername()
      this.checkPwd()
      this.checkCpwd()
      this.checkPhone()
      this.checkSmsCode()
      this.checkAllow()
      if (
        this.errorName || this.errorPassword || this.errorCheckPassword ||
        this.errorPhone || this.errorSmsCode || this.errorAllow
      ) return

      request.post('/register/', {
        username: this.username,
        password: this.password,
        password2: this.password2,
        mobile: this.mobile,
        sms_code: this.smsCode,
        allow: this.allow
      }).then(response => {
        if (response.data.code === 0) {
          this.$router.push('/')
        } else if (response.data.code === 400) {
          alert(response.data.errmsg)
        }
      }).catch(error => {
        console.error(error)
      })
    }
  }
}
</script>
```

### 5.4 商品详情页 GoodsDetailView.vue（原 detail.html + detail.js）

**原 Vue 2 代码（detail.js）**：

```javascript
var vm = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        host,
        username: sessionStorage.username || localStorage.username,
        token: sessionStorage.token || localStorage.token,
        tab_content: { detail: true, pack: false, comment: false, service: false },
        sku_id: '',
        sku_count: 1,
        sku_price: price,
        cart_total_count: 0,
        carts: [],
        hots: [],
        cat: cat,
        comments: [],
        score_classes: { 1: 'stars_one', 2: 'stars_two', 3: 'stars_three', 4: 'stars_four', 5: 'stars_five' }
    },
    computed: {
        sku_amount: function(){
            return (this.sku_price * this.sku_count).toFixed(2);
        }
    },
    mounted: function(){
        this.get_sku_id();
        axios.post(this.host+'/browse_histories/', { sku_id: this.sku_id }, { responseType: 'json', withCredentials:true })
        this.get_cart();
        this.get_hot_goods();
        this.get_comments();
        this.detail_visit();
    },
    methods: {
        detail_visit(){ ... },
        logoutfunc: function () { ... },
        on_tab_content: function(name){
            this.tab_content = { detail: false, pack: false, comment: false, service: false };
            this.tab_content[name] = true;
        },
        get_sku_id: function(){
            var re = /^\/goods\/(\d+).html$/;
            this.sku_id = document.location.pathname.match(re)[1];
        },
        on_minus: function(){ if (this.sku_count > 1) this.sku_count--; },
        on_addition: function(){ if (this.sku_count < 20) this.sku_count++; },
        add_cart: function(){ ... },
        get_cart(){ ... },
        get_hot_goods: function(){},
        get_comments: function(){}
    }
});
```

**新 Vue 2 CLI 代码（GoodsDetailView.vue）**：

```vue
<template>
  <div class="detail_page">
    <AppHeader />

    <div class="detail_con">
      <!-- 商品图片与基本信息 -->
      <div class="goods_info clearfix">
        <div class="goods_pic fl">
          <img :src="skuInfo.default_image_url" :alt="skuInfo.name">
        </div>
        <div class="goods_detail_list fr">
          <h3>{{ skuInfo.name }}</h3>
          <div class="price_bar">
            <span class="show_pirce">¥<em>{{ skuPrice }}</em></span>
          </div>
          <div class="goods_num">
            <div class="num_name fl">数 量：</div>
            <div class="num_add fl">
              <a @click="onMinus" class="minus">-</a>
              <input v-model.number="skuCount" type="number" class="num_show fl">
              <a @click="onAddition" class="plus">+</a>
            </div>
          </div>
          <div class="total">总价：<em>¥{{ skuAmount }}</em></div>
          <div class="operate_btn">
            <a @click="addCart" class="add_cart">加入购物车</a>
          </div>
        </div>
      </div>

      <!-- 标签页 -->
      <div class="detail_tab">
        <ul class="tab_title">
          <li :class="{ active: tabContent.detail }" @click="onTabContent('detail')">商品详情</li>
          <li :class="{ active: tabContent.pack }" @click="onTabContent('pack')">规格与包装</li>
          <li :class="{ active: tabContent.comment }" @click="onTabContent('comment')">商品评价</li>
          <li :class="{ active: tabContent.service }" @click="onTabContent('service')">售后服务</li>
        </ul>
        <div class="tab_content">
          <div v-show="tabContent.detail" class="tab_detail">商品详情内容</div>
          <div v-show="tabContent.pack" class="tab_pack">规格与包装内容</div>
          <div v-show="tabContent.comment" class="tab_comment">商品评价内容</div>
          <div v-show="tabContent.service" class="tab_service">售后服务内容</div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import request from '@/utils/request'

export default {
  name: 'GoodsDetailView',
  components: { AppHeader, AppFooter },
  data() {
    return {
      skuId: '',
      skuCount: 1,
      skuPrice: 0,
      skuInfo: {},
      tabContent: {
        detail: true,
        pack: false,
        comment: false,
        service: false
      },
      hots: [],
      comments: []
    }
  },
  computed: {
    ...mapState('cart', ['cartTotalCount', 'carts']),
    skuAmount() {
      return (this.skuPrice * this.skuCount).toFixed(2)
    }
  },
  mounted() {
    this.skuId = this.$route.params.id
    this.loadGoodsDetail()
    this.getCart()
    this.recordBrowseHistory()
  },
  methods: {
    ...mapActions('cart', ['getCart']),
    async loadGoodsDetail() {
      // 加载商品详情数据
    },
    async recordBrowseHistory() {
      try {
        await request.post('/browse_histories/', { sku_id: this.skuId })
      } catch (error) {
        console.error(error)
      }
    },
    onTabContent(name) {
      this.tabContent = { detail: false, pack: false, comment: false, service: false }
      this.tabContent[name] = true
    },
    onMinus() {
      if (this.skuCount > 1) this.skuCount--
    },
    onAddition() {
      if (this.skuCount < 20) this.skuCount++
    },
    async addCart() {
      try {
        const response = await request.post('/carts/', {
          sku_id: parseInt(this.skuId),
          count: this.skuCount
        })
        alert('添加购物车成功')
        this.$store.commit('cart/SET_CART_TOTAL_COUNT',
          this.$store.state.cart.cartTotalCount + response.data.count
        )
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
```

### 5.5 购物车页 CartView.vue（原 cart.html + cart.js）

**原 Vue 2 代码（cart.js）**：

```javascript
var vm = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        host,
        username: '',
        user_id: sessionStorage.user_id || localStorage.user_id,
        token: sessionStorage.token || localStorage.token,
        cart: [],
        total_selected_count: 0,
        origin_input: 0
    },
    computed: {
        total_count: function(){ ... },
        total_selected_amount: function(){ ... },
        selected_all: function(){ ... }
    },
    mounted: function(){
        this.username = getCookie('username')
        axios.get(this.host+'/carts/', { responseType: 'json', withCredentials: true })
            .then(response => {
                this.cart = response.data.cart_skus;
                for(var i=0; i<this.cart.length; i++){
                    this.cart[i].amount = ((this.cart[i].price) * (this.cart[i].count)).toFixed(2);
                }
            })
    },
    methods: {
        on_minus, on_add, on_delete, on_input, update_count, update_selected, on_selected_all
    }
});
```

**新 Vue 2 CLI 代码（CartView.vue）**：

```vue
<template>
  <div class="cart_page">
    <AppHeader />

    <div class="cart_con">
      <h2>我的购物车</h2>
      <table class="cart_table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="onSelectedAll"
              >
              全选
            </th>
            <th>商品信息</th>
            <th>单价</th>
            <th>数量</th>
            <th>金额</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cart" :key="item.id">
            <td>
              <input
                type="checkbox"
                v-model="item.selected"
                @change="updateSelected(index)"
              >
            </td>
            <td class="goods_info">
              <img :src="item.default_image_url" :alt="item.name">
              <span>{{ item.name }}</span>
            </td>
            <td>¥{{ item.price }}</td>
            <td>
              <div class="num_ctrl">
                <a @click="onMinus(index)">-</a>
                <input
                  v-model.number="item.count"
                  type="number"
                  @blur="onInput(index)"
                >
                <a @click="onAdd(index)">+</a>
              </div>
            </td>
            <td>¥{{ (item.price * item.count).toFixed(2) }}</td>
            <td><a @click="onDelete(index)">删除</a></td>
          </tr>
        </tbody>
      </table>

      <div class="cart_total">
        <div class="fl">
          共 <span>{{ totalCount }}</span> 件商品
        </div>
        <div class="fr">
          总计（不含运费）：<span class="total_price">¥{{ totalSelectedAmount }}</span>
          <router-link to="/place_order" class="settlement_btn">去结算</router-link>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import request from '@/utils/request'

export default {
  name: 'CartView',
  components: { AppHeader, AppFooter },
  data() {
    return {
      originInput: 0
    }
  },
  computed: {
    ...mapState('cart', ['carts']),
    ...mapGetters('cart', ['totalSelectedAmount', 'isAllSelected']),
    cart() {
      return this.carts
    },
    totalCount() {
      return this.carts.reduce((sum, item) => sum + item.count, 0)
    }
  },
  mounted() {
    this.getCart()
  },
  methods: {
    ...mapActions('cart', ['getCart', 'updateCartItem', 'deleteCartItem', 'toggleSelectAll']),
    onMinus(index) {
      const item = this.cart[index]
      if (item.count > 1) {
        this.updateCartItem({ skuId: item.id, count: item.count - 1, selected: item.selected })
      }
    },
    onAdd(index) {
      const item = this.cart[index]
      this.updateCartItem({ skuId: item.id, count: item.count + 1, selected: item.selected })
    },
    onInput(index) {
      const item = this.cart[index]
      const val = parseInt(item.count)
      if (isNaN(val) || val <= 0) {
        this.getCart()
      } else {
        this.updateCartItem({ skuId: item.id, count: val, selected: item.selected })
      }
    },
    updateSelected(index) {
      const item = this.cart[index]
      this.updateCartItem({ skuId: item.id, count: item.count, selected: item.selected })
    },
    onSelectedAll() {
      this.toggleSelectAll(!this.isAllSelected)
    },
    onDelete(index) {
      if (confirm('确认删除该商品？')) {
        this.deleteCartItem(this.cart[index].id)
      }
    }
  }
}
</script>
```

### 5.6 商品列表页 GoodsListView.vue（原 list.html + list.js）

**新 Vue 2 CLI 代码**：

```vue
<template>
  <div class="list_page">
    <AppHeader />

    <div class="list_con">
      <!-- 面包屑 -->
      <div class="breadcrumb">
        <router-link to="/">首页</router-link>
        <span>&gt;</span>
        <span>{{ cat1.name }}</span>
        <span>&gt;</span>
        <span>{{ cat2.name }}</span>
        <span v-if="cat3.name">&gt;</span>
        <span v-if="cat3.name">{{ cat3.name }}</span>
      </div>

      <!-- 排序栏 -->
      <div class="sort_bar">
        <a :class="{ active: ordering === '-create_time' }" @click="onSort('-create_time')">新品优先</a>
        <a :class="{ active: ordering === 'price' }" @click="onSort('price')">价格升序</a>
        <a :class="{ active: ordering === '-price' }" @click="onSort('-price')">价格降序</a>
        <a :class="{ active: ordering === 'sales' }" @click="onSort('sales')">销量优先</a>
      </div>

      <!-- 商品列表 -->
      <ul class="goods_list">
        <li v-for="sku in skus" :key="sku.id" class="goods_item">
          <router-link :to="'/goods/' + sku.id">
            <img :src="sku.default_image_url" :alt="sku.name">
            <h4>{{ sku.name }}</h4>
            <div class="price">¥{{ sku.price }}</div>
          </router-link>
        </li>
      </ul>

      <!-- 分页 -->
      <Pagination
        :current="page"
        :total="totalPage"
        @change="onPage"
      />
    </div>

    <AppFooter />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import Pagination from '@/components/Pagination.vue'
import request from '@/utils/request'

export default {
  name: 'GoodsListView',
  components: { AppHeader, AppFooter, Pagination },
  data() {
    return {
      cat: '',
      page: 1,
      pageSize: 5,
      ordering: '-create_time',
      count: 0,
      skus: [],
      cat1: { url: '', name: '' },
      cat2: { name: '' },
      cat3: { name: '' },
      hotSkus: []
    }
  },
  computed: {
    ...mapState('cart', ['cartTotalCount', 'carts']),
    totalPage() {
      return this.count
    }
  },
  mounted() {
    this.cat = this.$route.query.cat
    this.getSkus()
    this.getCart()
    this.getHotGoods()
  },
  methods: {
    ...mapActions('cart', ['getCart']),
    async getSkus() {
      try {
        const response = await request.get('/list/' + this.cat + '/skus/', {
          params: {
            page: this.page,
            page_size: this.pageSize,
            ordering: this.ordering
          }
        })
        this.count = response.data.count
        this.skus = response.data.list
        this.cat1.name = response.data.breadcrumb.cat1
        this.cat2.name = response.data.breadcrumb.cat2
        this.cat3.name = response.data.breadcrumb.cat3
      } catch (error) {
        console.error(error)
      }
    },
    onPage(num) {
      if (num !== this.page) {
        this.page = num
        this.getSkus()
      }
    },
    onSort(ordering) {
      if (ordering !== this.ordering) {
        this.page = 1
        this.ordering = ordering
        this.getSkus()
      }
    },
    async getHotGoods() {
      try {
        const response = await request.get('/hot/' + this.cat + '/')
        this.hotSkus = response.data.hot_skus
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
```

### 5.7 用户地址页 UserSiteView.vue（原 user_center_site.html + user_center_site.js）

**新 Vue 2 CLI 代码**：

```vue
<template>
  <div class="user_site_page">
    <AppHeader />

    <div class="user_center clearfix">
      <!-- 左侧菜单 -->
      <div class="left_menu fl">
        <ul>
          <li><router-link to="/user_center_info">用户信息</router-link></li>
          <li class="active"><router-link to="/user_center_site">收货地址</router-link></li>
          <li><router-link to="/user_center_pass">修改密码</router-link></li>
          <li><router-link to="/user_center_order">我的订单</router-link></li>
        </ul>
      </div>

      <!-- 右侧内容 -->
      <div class="right_content fr">
        <h3>收货地址</h3>
        <a @click="showAdd" class="add_addr">新增地址</a>

        <!-- 地址列表 -->
        <div v-for="(addr, index) in addresses" :key="addr.id" class="addr_item">
          <div class="addr_info">
            <span>{{ addr.receiver }}</span>
            <span>{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.place }}</span>
            <span>{{ addr.mobile }}</span>
            <span v-if="addr.id === defaultAddressId" class="default_tag">默认地址</span>
          </div>
          <div class="addr_operate">
            <a @click="showEdit(index)">编辑</a>
            <a @click="delAddress(index)">删除</a>
            <a v-if="addr.id !== defaultAddressId" @click="setDefault(index)">设为默认</a>
          </div>
        </div>

        <!-- 新增/编辑地址表单 -->
        <div v-if="isShowEdit" class="edit_form">
          <div class="form_group">
            <label>收货人：</label>
            <input v-model="formAddress.receiver" @blur="checkReceiver">
            <span v-if="errorReceiver" class="error">请填写收货人</span>
          </div>
          <div class="form_group">
            <label>所在地区：</label>
            <select v-model="formAddress.province_id" @change="onProvinceChange">
              <option value="">请选择省份</option>
              <option v-for="p in provinces" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
            <select v-model="formAddress.city_id" @change="onCityChange">
              <option value="">请选择城市</option>
              <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <select v-model="formAddress.district_id">
              <option value="">请选择区县</option>
              <option v-for="d in districts" :key="d.id" :value="d.id">{{ d.name }}</option>
            </select>
          </div>
          <div class="form_group">
            <label>详细地址：</label>
            <input v-model="formAddress.place" @blur="checkPlace">
            <span v-if="errorPlace" class="error">请填写详细地址</span>
          </div>
          <div class="form_group">
            <label>手机号：</label>
            <input v-model="formAddress.mobile" @blur="checkMobile">
            <span v-if="errorMobile" class="error">手机号格式不正确</span>
          </div>
          <div class="form_group">
            <button @click="saveAddress">保存</button>
            <button @click="isShowEdit = false">取消</button>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import request from '@/utils/request'
import { validateMobile } from '@/utils/validate'

export default {
  name: 'UserSiteView',
  components: { AppHeader, AppFooter },
  data() {
    return {
      isShowEdit: false,
      provinces: [],
      cities: [],
      districts: [],
      addresses: [],
      defaultAddressId: '',
      editingAddressIndex: '',
      formAddress: {
        receiver: '',
        province_id: '',
        city_id: '',
        district_id: '',
        place: '',
        mobile: '',
        tel: '',
        email: ''
      },
      errorReceiver: false,
      errorPlace: false,
      errorMobile: false,
      errorEmail: false
    }
  },
  mounted() {
    this.getAddress()
    this.getProvince()
  },
  methods: {
    async getProvince() {
      try {
        const response = await request.get('/areas/')
        this.provinces = response.data.province_list
      } catch (error) {
        console.error(error)
      }
    },
    async getAddress() {
      try {
        const response = await request.get('/addresses/')
        this.addresses = response.data.addresses
        this.defaultAddressId = response.data.default_address_id
      } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
          this.$router.push({ path: '/login', query: { next: '/user_center_site' } })
        }
      }
    },
    onProvinceChange() {
      if (this.formAddress.province_id) {
        request.get('/areas/' + this.formAddress.province_id + '/').then(response => {
          this.cities = response.data.sub_data.subs
          this.districts = []
        })
      }
    },
    onCityChange() {
      if (this.formAddress.city_id) {
        request.get('/areas/' + this.formAddress.city_id + '/').then(response => {
          this.districts = response.data.sub_data.subs
        })
      }
    },
    showAdd() {
      this.clearAllErrors()
      this.editingAddressIndex = ''
      this.formAddress = { receiver: '', province_id: '', city_id: '', district_id: '', place: '', mobile: '', tel: '', email: '' }
      this.isShowEdit = true
    },
    showEdit(index) {
      this.clearAllErrors()
      this.editingAddressIndex = index + 1
      this.formAddress = JSON.parse(JSON.stringify(this.addresses[index]))
      this.isShowEdit = true
    },
    checkReceiver() { this.errorReceiver = !this.formAddress.receiver },
    checkPlace() { this.errorPlace = !this.formAddress.place },
    checkMobile() {
      const result = validateMobile(this.formAddress.mobile)
      this.errorMobile = !result.valid
    },
    clearAllErrors() {
      this.errorReceiver = false
      this.errorMobile = false
      this.errorPlace = false
      this.errorEmail = false
    },
    async saveAddress() {
      this.checkReceiver()
      this.checkPlace()
      this.checkMobile()
      if (this.errorReceiver || this.errorPlace || this.errorMobile) return

      this.formAddress.title = this.formAddress.receiver
      try {
        if (this.editingAddressIndex === '') {
          await request.post('/addresses/create/', this.formAddress)
        } else {
          await request.put('/addresses/' + this.addresses[this.editingAddressIndex - 1].id + '/', this.formAddress)
        }
        this.isShowEdit = false
        this.getAddress()
      } catch (error) {
        alert(error.response.data.detail || error.response.data.message)
      }
    },
    async delAddress(index) {
      if (!confirm('确认删除该地址？')) return
      try {
        await request.delete('/addresses/' + this.addresses[index].id + '/')
        this.getAddress()
      } catch (error) {
        console.error(error)
      }
    },
    async setDefault(index) {
      try {
        await request.put('/addresses/' + this.addresses[index].id + '/default/')
        this.getAddress()
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
```

---

## 六、公共组件设计

### 6.1 头部组件 AppHeader.vue

```vue
<template>
  <div class="header_con">
    <div class="header">
      <div class="welcome fl">欢迎来到美多商城!</div>
      <div class="fr">
        <div v-if="isLoggedIn" class="login_btn fl">
          欢迎您：<em>{{ username }}</em>
          <a @click="handleLogout" class="quit">退出</a>
        </div>
        <div v-else class="login_btn fl">
          <router-link to="/login">登录</router-link>
          <span>|</span>
          <router-link to="/register">注册</router-link>
        </div>
        <div class="user_link fl">
          <span>|</span>
          <router-link to="/user_center_info">用户中心</router-link>
          <span>|</span>
          <router-link to="/cart">我的购物车</router-link>
          <span>|</span>
          <router-link to="/user_center_order">我的订单</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'AppHeader',
  computed: {
    ...mapState('user', ['username']),
    ...mapGetters('user', ['isLoggedIn'])
  },
  methods: {
    ...mapActions('user', ['logout']),
    async handleLogout() {
      try {
        await this.logout()
        this.$router.push('/login')
      } catch (error) {
        console.error('退出失败:', error)
      }
    }
  }
}
</script>
```

### 6.2 分页组件 Pagination.vue

```vue
<template>
  <div class="pagination">
    <a @click="goPage(current - 1)" :class="{ disabled: current <= 1 }">上一页</a>
    <a
      v-for="num in pageNumbers"
      :key="num"
      :class="{ active: current === num }"
      @click="goPage(num)"
    >{{ num }}</a>
    <a @click="goPage(current + 1)" :class="{ disabled: current >= total }">下一页</a>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    current: { type: Number, default: 1 },
    total: { type: Number, default: 1 }
  },
  computed: {
    pageNumbers() {
      const nums = []
      if (this.total <= 5) {
        for (let i = 1; i <= this.total; i++) nums.push(i)
      } else if (this.current <= 3) {
        nums.push(1, 2, 3, 4, 5)
      } else if (this.total - this.current <= 2) {
        for (let i = this.total; i > this.total - 5; i--) nums.push(i)
      } else {
        for (let i = this.current - 2; i < this.current + 3; i++) nums.push(i)
      }
      return nums
    }
  },
  methods: {
    goPage(num) {
      if (num < 1 || num > this.total || num === this.current) return
      this.$emit('change', num)
    }
  }
}
</script>
```

### 6.3 轮播图组件 SlideShow.vue（替代 jQuery slide.js）

原项目使用 jQuery 实现轮播图（slide.js），现用 Vue 重写：

```vue
<template>
  <div class="slide_container" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
    <ul class="slide">
      <li
        v-for="(slide, index) in slides"
        :key="index"
        :style="{ opacity: currentIndex === index ? 1 : 0 }"
        class="slide_item"
      >
        <a :href="slide.link"><img :src="slide.image" :alt="slide.title"></a>
      </li>
    </ul>
    <div class="prev" @click="prevSlide">&lt;</div>
    <div class="next" @click="nextSlide">&gt;</div>
    <ul class="points">
      <li
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
      ></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SlideShow',
  props: {
    slides: { type: Array, default: () => [] },
    interval: { type: Number, default: 4000 }
  },
  data() {
    return {
      currentIndex: 0,
      timer: null
    }
  },
  mounted() {
    this.startAutoPlay()
  },
  beforeDestroy() {
    this.stopAutoPlay()
  },
  methods: {
    startAutoPlay() {
      this.timer = setInterval(() => { this.nextSlide() }, this.interval)
    },
    stopAutoPlay() {
      if (this.timer) { clearInterval(this.timer); this.timer = null }
    },
    prevSlide() {
      this.currentIndex = this.currentIndex > 0
        ? this.currentIndex - 1 : this.slides.length - 1
    },
    nextSlide() {
      this.currentIndex = this.currentIndex < this.slides.length - 1
        ? this.currentIndex + 1 : 0
    },
    goToSlide(index) { this.currentIndex = index }
  }
}
</script>

<style scoped>
.slide_item {
  transition: opacity 0.8s ease;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
```

### 6.4 购物车下拉组件 CartDropdown.vue

```vue
<template>
  <div class="guest_cart fr">
    <router-link to="/cart" class="cart_name fl">我的购物车</router-link>
    <div class="goods_count fl">{{ cartTotalCount }}</div>
    <ul class="cart_goods_show">
      <li v-for="item in carts" :key="item.id">
        <img :src="item.default_image_url" alt="商品图片">
        <h4>{{ item.name }}</h4>
        <div>{{ item.count }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CartDropdown',
  computed: {
    ...mapState('cart', ['carts', 'cartTotalCount'])
  }
}
</script>
```

---

## 七、混入设计

### 7.1 认证混入 mixins/authMixin.js

原项目中每个页面都重复定义了 `logoutfunc` 方法，提取为混入复用：

```javascript
// src/mixins/authMixin.js
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('user', ['logout']),
    async logoutfunc() {
      try {
        await this.logout()
        this.$router.push('/login')
      } catch (error) {
        console.error('退出失败:', error)
      }
    }
  }
}
```

使用方式：

```javascript
import authMixin from '@/mixins/authMixin'

export default {
  mixins: [authMixin],
  // 组件中可直接调用 this.logoutfunc()
}
```

### 7.2 购物车混入 mixins/cartMixin.js

原项目中首页、详情页、列表页、搜索页都重复定义了 `get_cart` 方法：

```javascript
// src/mixins/cartMixin.js
import { mapActions } from 'vuex'

export default {
  mounted() {
    this.getCart()
  },
  methods: {
    ...mapActions('cart', ['getCart'])
  }
}
```

---

## 八、环境变量配置

### .env.development

```
VUE_APP_API_BASE_URL=http://www.meiduo.site:8000
```

### .env.production

```
VUE_APP_API_BASE_URL=http://www.meiduo.site:8000
```

> **注意**：Vue CLI 使用 `VUE_APP_` 前缀的环境变量，在代码中通过 `process.env.VUE_APP_XXX` 访问。这与 Vite 的 `VITE_` 前缀不同。

---

## 九、Vue CLI 配置 vue.config.js

```javascript
// vue.config.js
const path = require('path')

module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://www.meiduo.site:8000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  },
  productionSourceMap: false
}
```

---

## 十、构建与部署

### 10.1 开发环境

```bash
npm run serve
```

启动后访问 `http://localhost:8080`，支持热更新。

### 10.2 生产构建

```bash
npm run build
```

构建产物在 `dist/` 目录中，可直接部署到 Nginx 等 Web 服务器。

### 10.3 代码检查

```bash
npm run lint
```

### 10.4 Nginx 部署配置参考

```nginx
server {
    listen 80;
    server_name www.meiduo.site;

    root /var/www/meiduoshop_web_v2/dist;
    index index.html;

    # SPA 路由 history 模式支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 十一、原代码 → Vue 2 CLI 代码对照表

| 特性 | 原代码（CDN 引入） | Vue 2 CLI（模块化） |
|------|---------------------|---------------------|
| 创建实例 | `new Vue({ el: '#app' })` | `new Vue({ router, store, render: h => h(App) }).$mount('#app')` |
| 数据定义 | `data: { count: 0 }` | `data() { return { count: 0 } }`（组件中必须是函数） |
| 模板插值 | `[[ variable ]]` | `{{ variable }}` |
| 页面跳转 | `location.href = 'xxx.html'` | `this.$router.push('/xxx')` |
| 获取 URL 参数 | `getQueryString('next')` | `this.$route.query.next` |
| 获取路由参数 | `document.location.pathname.match(re)[1]` | `this.$route.params.id` |
| HTTP 请求 | `axios.get(this.host + '/xxx/')` | `request.get('/xxx/')`（baseURL 已封装） |
| 状态管理 | Cookie / sessionStorage / localStorage | Vuex Store |
| 组件引用 | 无 | `import Component from './Component.vue'` |
| 样式引入 | `<link rel="stylesheet" href="...">` | `import './assets/css/main.css'`（自行编写） |
| 退出登录 | 每个页面重复定义 `logoutfunc` | Vuex Action + authMixin 复用 |
| 购物车数据 | 每个页面重复定义 `get_cart` | Vuex cart 模块 + cartMixin 复用 |
| 图片验证码 | `this.host + "/image_codes/" + id + "/"` | `request.defaults.baseURL + "/image_codes/" + id + "/"` |
| 全局函数 | `getCookie()`、`generateUUID()` | `this.$getCookie()`、`this.$generateUUID()` 或 import |

---

## 十二、迁移检查清单

### 基础设施

- [ ] 安装 Vue CLI 并创建 Vue 2 项目
- [ ] 安装依赖（Vue Router 3.x、Vuex 3.x、Axios）
- [ ] 配置路由（所有页面路由映射）
- [ ] 创建 Vuex Store（user、cart 模块）
- [ ] 封装 Axios 请求（拦截器、baseURL）
- [ ] 迁移工具函数（cookie、validate、helpers）
- [ ] 配置环境变量（.env.development / .env.production）
- [ ] 配置 vue.config.js

### 公共组件

- [ ] AppHeader 头部导航
- [ ] AppFooter 底部
- [ ] SearchBar 搜索栏
- [ ] CartDropdown 购物车下拉
- [ ] Pagination 分页
- [ ] SlideShow 轮播图

### 页面视图

- [ ] 首页 HomeView
- [ ] 登录 LoginView
- [ ] 注册 RegisterView
- [ ] 商品详情 GoodsDetailView
- [ ] 商品列表 GoodsListView
- [ ] 搜索 SearchView
- [ ] 购物车 CartView
- [ ] 下单 PlaceOrderView
- [ ] 订单成功 OrderSuccessView
- [ ] 支付成功 PaySuccessView
- [ ] 用户信息 UserInfoView
- [ ] 用户地址 UserSiteView
- [ ] 修改密码 UserPassView
- [ ] 用户订单 UserOrderView
- [ ] QQ 回调 OAuthCallbackView
- [ ] 商品评价 GoodsJudgeView
- [ ] 邮箱验证 EmailVerifyView

### 样式与资源

- [ ] 编写样式文件（reset.css、main.css）
- [ ] 准备图片资源到 public/images

### 测试验证

- [ ] 所有页面可正常访问
- [ ] 登录/注册流程正常
- [ ] 购物车增删改查正常
- [ ] 下单流程正常
- [ ] 用户中心功能正常
- [ ] QQ 第三方登录正常
- [ ] 生产构建验证

---

## 十三、常见问题

### Q1: 模板插值分隔符 `[[ ]]` 是否需要保留？

不需要。项目已通过 Vue CLI 搭建为独立前端项目，不再与 Django 模板冲突，直接使用默认的 `{{ }}` 即可。

### Q2: jQuery 轮播图如何迁移？

方案 A：保留 jQuery，在组件 mounted 中初始化（需在 vue.config.js 中配置 webpack 提供 jQuery）。
方案 B：使用 Vue 重写轮播图组件（推荐，见 6.3 节 SlideShow.vue），彻底移除 jQuery 依赖。

### Q3: 多页面如何变成单页面？

使用 Vue Router 管理路由，所有页面变成组件，通过 `<router-view>` 切换。原 `location.href` 跳转改为 `this.$router.push()`。

### Q4: 原项目中 `host` 全局变量如何处理？

通过 axios 的 `baseURL` 配置统一管理，不再需要每个页面单独定义 `host` 变量。使用环境变量 `process.env.VUE_APP_API_BASE_URL` 配置。

### Q5: 原项目中 `getCookie` 等全局函数如何处理？

两种方式：
1. 迁移到 `src/utils/helpers.js`，通过模块化 import 引入
2. 挂载到 `Vue.prototype` 上全局使用（见 main.js 配置）

### Q6: Vue 2 CLI 项目后续如何升级到 Vue 3？

可按以下步骤渐进式升级：
1. 将 Vuex 迁移到 Pinia
2. 将 Vue Router 3.x 升级到 4.x
3. 将 Options API 改为 Composition API
4. 将 Vue CLI 替换为 Vite
5. 参考同目录下的《Vue3升级开发文档》

### Q7: 组件中 data 为什么必须是函数？

Vue 2 中组件的 `data` 必须是函数，返回一个新对象。这是因为组件可能被复用多次，如果 data 是对象，所有实例将共享同一份数据，造成状态污染。原项目中每个页面只有一个 Vue 实例所以用对象也可以，但组件化后必须改为函数。

### Q8: CSS 中如何引用图片资源？

本项目样式为自行编写，不沿用原项目样式。在 CSS 中引用图片时：
- 放在 `public/images/` 下的图片，CSS 中使用 `/images/xxx.png`（绝对路径）
- 放在 `src/assets/images/` 下的图片，CSS 中使用 `~@/assets/images/xxx.png`（webpack 处理）

---

*文档生成日期：2026-06-27*</think>