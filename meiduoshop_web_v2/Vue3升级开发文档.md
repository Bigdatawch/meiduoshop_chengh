# 美多商城前端 Vue 2 → Vue 3 升级开发文档

## 一、项目现状分析

### 1.1 当前技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 2.5.16 | 前端框架 |
| jQuery | 1.12.4 | DOM 操作、轮播图 |
| axios | 0.18.0 | HTTP 请求 |
| 原生 HTML/CSS | - | 页面结构 |

### 1.2 项目结构

```
meiduoshop_web/
├── css/                    # 样式文件
│   ├── main.css
│   └── reset.css
├── js/                     # JavaScript 文件
│   ├── vue-2.5.16.js       # Vue 2 框架
│   ├── axios-0.18.0.min.js # HTTP 库
│   ├── jquery-1.12.4.min.js# jQuery
│   ├── host.js             # API 地址配置
│   ├── common.js           # 公共工具函数
│   ├── base.js             # 头部组件 Vue 实例
│   ├── index.js            # 首页逻辑
│   ├── login.js            # 登录页逻辑
│   ├── register.js         # 注册页逻辑
│   ├── detail.js           # 商品详情页逻辑
│   ├── cart.js             # 购物车逻辑
│   ├── list.js             # 商品列表逻辑
│   ├── search.js           # 搜索页逻辑
│   ├── place_order.js      # 下单页逻辑
│   ├── order_success.js    # 订单成功页逻辑
│   ├── user_center_info.js # 用户中心-信息
│   ├── user_center_site.js # 用户中心-地址
│   ├── user_center_pass.js # 用户中心-密码
│   ├── user_center_order.js# 用户中心-订单
│   ├── oauth_callback.js   # QQ 回调页
│   ├── goods_judge.js      # 商品评价
│   └── slide.js            # jQuery 轮播图
├── images/                 # 图片资源
├── goods/                  # 商品详情静态页
├── index.html              # 首页
├── login.html              # 登录页
├── register.html           # 注册页
├── detail.html             # 商品详情
├── cart.html               # 购物车
├── list.html               # 商品列表
├── search.html             # 搜索页
├── place_order.html        # 下单页
├── order_success.html      # 订单成功
├── pay_success.html        # 支付成功
├── user_center_info.html   # 用户信息
├── user_center_site.html   # 用户地址
├── user_center_pass.html   # 修改密码
├── user_center_order.html  # 用户订单
├── oauth_callback.html     # QQ 授权回调
├── goods_judge.html        # 商品评价
└── success_verify_email.html # 邮箱验证成功
```

### 1.3 当前架构特点

- **多页面应用（MPA）**：每个页面独立一个 HTML 文件，各自创建 Vue 实例
- **无构建工具**：直接通过 `<script>` 标签引入 Vue、axios、jQuery
- **无组件化**：每个页面的 Vue 实例直接挂载到 `#app`，没有拆分组件
- **模板语法**：使用 `[[ ]]` 作为插值分隔符（避免与 Django 模板冲突）
- **全局变量依赖**：`host`、`getCookie`、`generateUUID` 等全局变量/函数

---

## 二、Vue 3 升级方案

### 2.1 升级目标

1. 将 Vue 2.5.16 升级到 Vue 3.4+
2. 引入 Vite 作为构建工具
3. 引入 Vue Router 4 管理路由
4. 引入 Pinia 管理状态
5. 组件化重构页面
6. 保留 jQuery 轮播图（渐进式迁移）
7. 使用 Composition API 重写逻辑

### 2.2 技术选型

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | ^3.4.0 | 前端框架 |
| Vite | ^5.0.0 | 构建工具 |
| Vue Router | ^4.2.0 | 路由管理 |
| Pinia | ^2.1.0 | 状态管理 |
| Axios | ^1.6.0 | HTTP 请求 |
| jQuery | ^3.7.0 | 保留用于轮播图（可选后续移除） |

---

## 三、升级步骤详解

### 步骤 1：初始化 Vue 3 + Vite 项目

```bash
# 1. 创建新项目
cd d:\MyProject\meiduoshop
npm create vue@latest meiduoshop_web_v3

# 2. 按提示选择配置
# ? Add TypeScript? → No（先保持 JS，后续可迁移）
# ? Add JSX Support? → No
# ? Add Vue Router? → Yes
# ? Add Pinia? → Yes
# ? Add Vitest? → No
# ? Add Cypress? → No
# ? Add ESLint? → Yes
# ? Add Prettier? → Yes

# 3. 进入项目并安装依赖
cd meiduoshop_web_v3
npm install

# 4. 安装额外依赖
npm install axios jquery
npm install -D @types/jquery

# 5. 启动开发服务器
npm run dev
```

### 步骤 2：项目目录重构

```
meiduoshop_web_v3/
├── public/                      # 静态资源（不经过构建）
│   └── images/                  # 图片资源（从原项目复制）
├── src/
│   ├── assets/                  # 构建处理的资源
│   │   ├── css/
│   │   │   ├── reset.css        # 从原项目复制
│   │   │   └── main.css         # 从原项目复制并调整
│   │   └── images/
│   ├── components/              # 公共组件
│   │   ├── AppHeader.vue        # 头部导航（原 base.js + header）
│   │   ├── AppFooter.vue        # 底部（如有）
│   │   ├── SearchBar.vue        # 搜索栏
│   │   ├── CartDropdown.vue     # 购物车下拉
│   │   ├── Pagination.vue       # 分页组件
│   │   └── SlideShow.vue        # 轮播图（Vue 实现，替代 jQuery）
│   ├── views/                   # 页面视图
│   │   ├── HomeView.vue         # 首页（原 index.html + index.js）
│   │   ├── LoginView.vue        # 登录页
│   │   ├── RegisterView.vue     # 注册页
│   │   ├── GoodsDetailView.vue  # 商品详情
│   │   ├── GoodsListView.vue    # 商品列表
│   │   ├── SearchView.vue       # 搜索页
│   │   ├── CartView.vue         # 购物车
│   │   ├── PlaceOrderView.vue   # 下单页
│   │   ├── OrderSuccessView.vue # 订单成功
│   │   ├── UserCenter/
│   │   │   ├── UserInfoView.vue
│   │   │   ├── UserSiteView.vue
│   │   │   ├── UserPassView.vue
│   │   │   └── UserOrderView.vue
│   │   └── OAuthCallbackView.vue
│   ├── composables/             # 组合式函数
│   │   ├── useAuth.js           # 认证相关逻辑
│   │   ├── useCart.js           # 购物车逻辑
│   │   ├── usePagination.js     # 分页逻辑
│   │   └── useFormValidation.js # 表单验证
│   ├── stores/                  # Pinia 状态管理
│   │   ├── userStore.js         # 用户状态
│   │   ├── cartStore.js         # 购物车状态
│   │   └── authStore.js         # 认证状态
│   ├── utils/                   # 工具函数
│   │   ├── request.js           # axios 封装
│   │   ├── cookie.js            # Cookie 操作
│   │   ├── validate.js          # 表单验证
│   │   └── helpers.js           # 通用辅助函数
│   ├── router/                  # 路由配置
│   │   └── index.js
│   ├── App.vue                  # 根组件
│   └── main.js                  # 入口文件
├── index.html                   # HTML 入口
├── vite.config.js               # Vite 配置
├── package.json
└── ...
```

### 步骤 3：核心文件迁移详解

#### 3.1 入口文件 main.js

**原代码（Vue 2）**：每个页面独立创建 Vue 实例，无统一入口

**新代码（Vue 3）**：

```javascript
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 引入全局样式
import './assets/css/reset.css'
import './assets/css/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

#### 3.2 根组件 App.vue

```vue
<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// 全局逻辑可在此处理
</script>
```

#### 3.3 路由配置 router/index.js

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/goods/:id',
      name: 'goodsDetail',
      component: () => import('../views/GoodsDetailView.vue')
    },
    {
      path: '/list',
      name: 'goodsList',
      component: () => import('../views/GoodsListView.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/place_order',
      name: 'placeOrder',
      component: () => import('../views/PlaceOrderView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/order_success',
      name: 'orderSuccess',
      component: () => import('../views/OrderSuccessView.vue')
    },
    {
      path: '/user_center_info',
      name: 'userInfo',
      component: () => import('../views/UserCenter/UserInfoView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/user_center_site',
      name: 'userSite',
      component: () => import('../views/UserCenter/UserSiteView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/user_center_pass',
      name: 'userPass',
      component: () => import('../views/UserCenter/UserPassView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/user_center_order',
      name: 'userOrder',
      component: () => import('../views/UserCenter/UserOrderView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/oauth_callback',
      name: 'oauthCallback',
      component: () => import('../views/OAuthCallbackView.vue')
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next({ path: '/login', query: { next: to.fullPath } })
  } else {
    next()
  }
})

export default router
```

#### 3.4 Axios 封装 utils/request.js

```javascript
// src/utils/request.js
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://www.meiduo.site:8000',
  timeout: 10000,
  withCredentials: true
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request
```

#### 3.5 Pinia 状态管理 stores/userStore.js

```javascript
// src/stores/userStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCookie } from '@/utils/cookie'

export const useUserStore = defineStore('user', () => {
  // State
  const username = ref(getCookie('username') || '')
  const token = ref(localStorage.getItem('token') || sessionStorage.getItem('token') || '')
  const userId = ref(localStorage.getItem('user_id') || sessionStorage.getItem('user_id') || '')

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  function setUser(data) {
    username.value = data.username
    token.value = data.token
    userId.value = data.user_id
  }

  function logout() {
    username.value = ''
    token.value = ''
    userId.value = ''
    localStorage.clear()
    sessionStorage.clear()
  }

  return {
    username,
    token,
    userId,
    isLoggedIn,
    setUser,
    logout
  }
})
```

#### 3.6 Pinia 购物车状态 stores/cartStore.js

```javascript
// src/stores/cartStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '@/utils/request'

export const useCartStore = defineStore('cart', () => {
  // State
  const carts = ref([])
  const cartTotalCount = ref(0)

  // Getters
  const totalSelectedCount = computed(() => {
    return carts.value.filter(item => item.selected).reduce((sum, item) => sum + item.count, 0)
  })

  const totalSelectedAmount = computed(() => {
    return carts.value
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.price * item.count, 0)
      .toFixed(2)
  })

  const isAllSelected = computed(() => {
    return carts.value.length > 0 && carts.value.every(item => item.selected)
  })

  // Actions
  async function getCart() {
    try {
      const response = await request.get('/carts/simple/')
      carts.value = response.data.cart_skus.map(item => ({
        ...item,
        name: item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name
      }))
      cartTotalCount.value = carts.value.reduce((sum, item) => sum + item.count, 0)
    } catch (error) {
      console.error('获取购物车失败:', error)
    }
  }

  async function updateCartItem(skuId, count, selected) {
    try {
      const response = await request.put('/carts/', {
        sku_id: skuId,
        count,
        selected
      })
      await getCart()
      return response.data
    } catch (error) {
      console.error('更新购物车失败:', error)
    }
  }

  async function deleteCartItem(skuId) {
    try {
      await request.delete('/carts/', {
        data: { sku_id: skuId }
      })
      await getCart()
    } catch (error) {
      console.error('删除购物车失败:', error)
    }
  }

  async function toggleSelectAll(selected) {
    try {
      await request.put('/carts/selection/', { selected })
      await getCart()
    } catch (error) {
      console.error('全选操作失败:', error)
    }
  }

  return {
    carts,
    cartTotalCount,
    totalSelectedCount,
    totalSelectedAmount,
    isAllSelected,
    getCart,
    updateCartItem,
    deleteCartItem,
    toggleSelectAll
  }
})
```

---

## 四、页面迁移示例

### 4.1 首页 HomeView.vue（原 index.html + index.js）

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

**新 Vue 3 代码（HomeView.vue）**：

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
        <form @submit.prevent="onSearch" class="search_con">
          <input 
            v-model="searchKey" 
            type="text" 
            class="input_text fl" 
            placeholder="搜索商品"
          >
          <input type="submit" class="input_btn fr" value="搜索">
        </form>
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
        </ul>
      </div>
    </div>

    <!-- 轮播图区域 -->
    <div class="pos_center_con clearfix">
      <SlideShow :slides="slides" />
      
      <!-- 商品分类菜单 -->
      <ul class="sub_menu">
        <li v-for="category in categories" :key="category.id">
          <div class="level1">
            <a v-for="item in category.level1" :key="item.id" :href="item.url">
              {{ item.name }}
            </a>
          </div>
          <div class="level2">
            <div v-for="group in category.groups" :key="group.id" class="list_group">
              <div class="group_name fl">{{ group.name }}&gt;</div>
              <div class="group_detail fl">
                <router-link 
                  v-for="goods in group.items" 
                  :key="goods.id"
                  :to="`/list?cat=${goods.id}`"
                >
                  {{ goods.name }}
                </router-link>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 商品楼层 -->
    <div class="floor">
      <!-- 1F -->
      <div class="floor_con">
        <div class="subtitle">
          <a 
            v-for="tab in 3" 
            :key="tab"
            :class="{ active: f1Tab === tab }"
            @click="f1Tab = tab"
          >
            标签{{ tab }}
          </a>
        </div>
        <div class="goods_list_con">
          <div 
            v-for="tab in 3" 
            :key="tab"
            :class="['goods_list', { goods_list_show: f1Tab === tab }]"
          >
            <!-- 商品列表 -->
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useCartStore } from '@/stores/cartStore'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import CartDropdown from '@/components/CartDropdown.vue'
import SlideShow from '@/components/SlideShow.vue'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

// 响应式状态（替代 data）
const f1Tab = ref(1)
const f2Tab = ref(1)
const f3Tab = ref(1)
const searchKey = ref('')
const categories = ref([])
const slides = ref([
  { image: '/images/slide01.jpg', link: 'http://www.itcast.cn' },
  { image: '/images/slide02.jpg', link: 'http://www.itcast.cn' },
  { image: '/images/slide03.jpg', link: 'http://www.itcast.cn' },
  { image: '/images/slide04.jpg', link: 'http://www.itcast.cn' }
])

// 方法（替代 methods）
const onSearch = () => {
  if (searchKey.value.trim()) {
    router.push({ path: '/search', query: { q: searchKey.value } })
  }
}

// 生命周期（替代 mounted）
onMounted(() => {
  cartStore.getCart()
})
</script>
```

### 4.2 登录页 LoginView.vue（原 login.html + login.js）

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
        get_query_string: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) { return decodeURI(r[2]); }
            return null;
        },
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

**新 Vue 3 代码（LoginView.vue）**：

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
            v-model="form.username"
            type="text" 
            placeholder="用户名"
            @blur="validateUsername"
          >
          <span v-if="errors.username" class="error">{{ errors.username }}</span>
        </div>
        <div class="form_group">
          <input 
            v-model="form.password"
            type="password" 
            placeholder="密码"
            @blur="validatePassword"
          >
          <span v-if="errors.password" class="error">{{ errors.password }}</span>
        </div>
        <div class="form_group">
          <label>
            <input v-model="form.remember" type="checkbox">
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

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import request from '@/utils/request'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 表单数据
const form = reactive({
  username: '',
  password: '',
  remember: false
})

// 错误信息
const errors = reactive({
  username: '',
  password: ''
})

// 验证方法
const validateUsername = () => {
  errors.username = form.username ? '' : '请填写用户名'
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = '请填写密码'
  } else {
    errors.password = ''
  }
}

// 提交登录
const handleSubmit = async () => {
  validateUsername()
  validatePassword()
  
  if (errors.username || errors.password) return
  
  try {
    const response = await request.post('/login/', {
      username: form.username,
      password: form.password,
      remembered: form.remember
    })
    
    if (response.data.code === 0) {
      // 保存登录状态
      const storage = form.remember ? localStorage : sessionStorage
      storage.setItem('token', response.data.token)
      storage.setItem('user_id', response.data.user_id)
      
      userStore.setUser({
        username: form.username,
        token: response.data.token,
        user_id: response.data.user_id
      })
      
      // 跳转
      const returnUrl = route.query.next || '/'
      router.push(returnUrl)
    } else {
      errors.password = '用户名或密码错误'
    }
  } catch (error) {
    errors.password = error.response?.status === 400 
      ? '用户名或密码错误' 
      : '服务器错误'
  }
}

// QQ 登录
const qqLogin = async () => {
  try {
    const next = route.query.next || '/'
    const response = await request.get(`/qq/authorization/?next=${next}`)
    if (response.data.code === 0) {
      window.location.href = response.data.login_url
    }
  } catch (error) {
    console.error('QQ登录失败:', error)
  }
}
</script>
```

### 4.3 购物车页 CartView.vue（原 cart.html + cart.js）

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
        total_count: function(){
            var total = 0;
            for(var i=0; i<this.cart.length; i++){
                total += (this.cart[i].count);
                this.cart[i].amount = ((this.cart[i].price) * (this.cart[i].count)).toFixed(2);
            }
            return total;
        },
        total_selected_amount: function(){
            var total = 0;
            this.total_selected_count = 0;
            for(var i=0; i<this.cart.length; i++){
                if(this.cart[i].selected) {
                    total += ((this.cart[i].price) * (this.cart[i].count));
                    this.total_selected_count += (this.cart[i].count);
                }
            }
            return total.toFixed(2);
        },
        selected_all: function(){
            var selected=true;
            for(var i=0; i<this.cart.length; i++){
                if(this.cart[i].selected==false){ selected=false; break; }
            }
            return selected;
        }
    },
    mounted: function(){
        this.username = getCookie('username')
        axios.get(this.host+'/carts/', { responseType: 'json', withCredentials: true })
            .then(response => {
                this.cart = response.data.cart_skus;
                for(var i=0; i<this.cart.length; i++){
                    this.cart[i].amount = ((this.cart[i].price) * this.cart[i].count).toFixed(2);
                }
            })
            .catch(error => { console.log(error.response.data); })
    },
    methods: {
        on_minus: function(index){
            if (this.cart[index].count > 1) {
                this.update_count(index, this.cart[index].count - 1);
            }
        },
        on_add: function(index){
            this.update_count(index, this.cart[index].count + 1);
        },
        on_delete: function(index){
            axios.delete(this.host+'/carts/', {
                data: { sku_id: this.cart[index].id },
                responseType: 'json', withCredentials: true
            })
            .then(response => {
                if (response.data.code == 0) { this.cart.splice(index, 1); }
            })
            .catch(error => { console.log(error); })
        },
        update_count: function(index, count){
            axios.put(this.host+'/carts/', {
                sku_id: this.cart[index].id, count, selected: this.cart[index].selected
            }, { responseType: 'json', withCredentials: true })
            .then(response => { this.cart[index].count = response.data.cart_sku.count; })
            .catch(error => { console.log(error); })
        },
        update_selected: function(index) {
            axios.put(this.host+'/carts/', {
                sku_id: this.cart[index].id,
                count: this.cart[index].count,
                selected: this.cart[index].selected
            }, { responseType: 'json', withCredentials: true })
            .then(response => { this.cart[index].selected = response.data.cart_sku.selected; })
            .catch(error => { console.log(error); })
        },
        on_selected_all: function(){
            var selected = !this.selected_all;
            axios.put(this.host + '/carts/selection/', { selected },
                { responseType: 'json', withCredentials: true })
            .then(response => {
                for (var i=0; i<this.cart.length;i++){ this.cart[i].selected = selected; }
            })
            .catch(error => { console.log(error); })
        },
    }
});
```

**新 Vue 3 代码（CartView.vue）**：

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
                :checked="cartStore.isAllSelected"
                @change="handleSelectAll"
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
          <tr v-for="(item, index) in cartStore.carts" :key="item.id">
            <td>
              <input 
                type="checkbox" 
                v-model="item.selected"
                @change="handleSelect(index)"
              >
            </td>
            <td class="goods_info">
              <img :src="item.default_image_url" :alt="item.name">
              <span>{{ item.name }}</span>
            </td>
            <td>¥{{ item.price }}</td>
            <td>
              <div class="num_ctrl">
                <a @click="handleMinus(index)">-</a>
                <input 
                  v-model.number="item.count"
                  type="number"
                  @blur="handleInput(index)"
                >
                <a @click="handleAdd(index)">+</a>
              </div>
            </td>
            <td>¥{{ (item.price * item.count).toFixed(2) }}</td>
            <td>
              <a @click="handleDelete(index)">删除</a>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="cart_total">
        <div class="fl">
          共 <span>{{ cartStore.cartTotalCount }}</span> 件商品
        </div>
        <div class="fr">
          总计（不含运费）：<span class="total_price">¥{{ cartStore.totalSelectedAmount }}</span>
          <router-link to="/place_order" class="settlement_btn">
            去结算
          </router-link>
        </div>
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const cartStore = useCartStore()

// 页面加载时获取购物车数据
onMounted(() => {
  cartStore.getCart()
})

// 减少数量
const handleMinus = async (index) => {
  const item = cartStore.carts[index]
  if (item.count > 1) {
    await cartStore.updateCartItem(item.id, item.count - 1, item.selected)
  }
}

// 增加数量
const handleAdd = async (index) => {
  const item = cartStore.carts[index]
  await cartStore.updateCartItem(item.id, item.count + 1, item.selected)
}

// 手动输入数量
const handleInput = async (index) => {
  const item = cartStore.carts[index]
  const val = parseInt(item.count)
  if (isNaN(val) || val <= 0) {
    await cartStore.getCart() // 重置为原值
  } else {
    await cartStore.updateCartItem(item.id, val, item.selected)
  }
}

// 选择/取消选择
const handleSelect = async (index) => {
  const item = cartStore.carts[index]
  await cartStore.updateCartItem(item.id, item.count, item.selected)
}

// 全选/取消全选
const handleSelectAll = async () => {
  await cartStore.toggleSelectAll(!cartStore.isAllSelected)
}

// 删除商品
const handleDelete = async (index) => {
  const item = cartStore.carts[index]
  await cartStore.deleteCartItem(item.id)
}
</script>
```

---

## 五、Vue 2 → Vue 3 语法对照表

| 特性 | Vue 2 (Options API) | Vue 3 (Composition API) |
|------|---------------------|-------------------------|
| 创建应用 | `new Vue({ el: '#app' })` | `createApp(App).mount('#app')` |
| 数据定义 | `data() { return { count: 0 } }` | `const count = ref(0)` |
| 计算属性 | `computed: { double() { return this.count * 2 } }` | `const double = computed(() => count.value * 2)` |
| 方法定义 | `methods: { increment() { this.count++ } }` | `const increment = () => { count.value++ }` |
| 生命周期 | `mounted() { ... }` | `onMounted(() => { ... })` |
| 侦听器 | `watch: { count(newVal) { ... } }` | `watch(count, (newVal) => { ... })` |
| 模板插值 | `[[ variable ]]` (自定义分隔符) | `{{ variable }}` |
| 条件渲染 | `v-if="isShow"` | `v-if="isShow"`（不变） |
| 列表渲染 | `v-for="item in list" :key="item.id"` | `v-for="item in list" :key="item.id"`（不变） |
| 事件绑定 | `v-on:click="handler"` / `@click="handler"` | `@click="handler"`（不变） |
| 双向绑定 | `v-model="inputValue"` | `v-model="inputValue"`（不变） |
| 属性绑定 | `v-bind:src="imageUrl"` / `:src="imageUrl"` | `:src="imageUrl"`（不变） |
| 组件注册 | 全局/局部 components | `import Component from './Component.vue'` |

---

## 六、公共组件设计

### 6.1 头部组件 AppHeader.vue

```vue
<template>
  <div class="header_con">
    <div class="header">
      <div class="welcome fl">欢迎来到美多商城!</div>
      <div class="fr">
        <div v-if="userStore.isLoggedIn" class="login_btn fl">
          欢迎您：<em>{{ userStore.username }}</em>
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

<script setup>
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await request.delete('/logout/')
    userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('退出失败:', error)
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
    >
      {{ num }}
    </a>
    <a @click="goPage(current + 1)" :class="{ disabled: current >= total }">下一页</a>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, default: 1 },
  total: { type: Number, default: 1 }
})

const emit = defineEmits(['change'])

const pageNumbers = computed(() => {
  const nums = []
  if (props.total <= 5) {
    for (let i = 1; i <= props.total; i++) nums.push(i)
  } else if (props.current <= 3) {
    nums.push(1, 2, 3, 4, 5)
  } else if (props.total - props.current <= 2) {
    for (let i = props.total; i > props.total - 5; i--) nums.push(i)
  } else {
    for (let i = props.current - 2; i < props.current + 3; i++) nums.push(i)
  }
  return nums
})

const goPage = (num) => {
  if (num < 1 || num > props.total || num === props.current) return
  emit('change', num)
}
</script>
```

---

## 七、环境变量配置

### .env.development

```
VITE_API_BASE_URL=http://www.meiduo.site:8000
```

### .env.production

```
VITE_API_BASE_URL=http://www.meiduo.site:8000
```

---

## 八、Vite 配置 vite.config.js

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://www.meiduo.site:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

---

## 九、构建与部署

### 9.1 开发环境

```bash
npm run dev
```

### 9.2 生产构建

```bash
npm run build
```

构建产物在 `dist/` 目录中。

### 9.3 预览生产构建

```bash
npm run preview
```

---

## 十、迁移检查清单

- [ ] 初始化 Vue 3 + Vite 项目
- [ ] 安装依赖（Vue Router、Pinia、Axios）
- [ ] 配置路由（所有页面路由映射）
- [ ] 创建 Pinia Store（user、cart）
- [ ] 封装 Axios 请求
- [ ] 迁移公共组件（Header、Footer、SearchBar、CartDropdown）
- [ ] 迁移页面视图：
  - [ ] 首页 HomeView
  - [ ] 登录 LoginView
  - [ ] 注册 RegisterView
  - [ ] 商品详情 GoodsDetailView
  - [ ] 商品列表 GoodsListView
  - [ ] 搜索 SearchView
  - [ ] 购物车 CartView
  - [ ] 下单 PlaceOrderView
  - [ ] 订单成功 OrderSuccessView
  - [ ] 用户信息 UserInfoView
  - [ ] 用户地址 UserSiteView
  - [ ] 修改密码 UserPassView
  - [ ] 用户订单 UserOrderView
  - [ ] QQ 回调 OAuthCallbackView
- [ ] 迁移样式文件（CSS）
- [ ] 迁移图片资源
- [ ] 测试所有功能
- [ ] 生产构建验证

---

## 十一、常见问题

### Q1: 模板插值分隔符 `[[ ]]` 是否需要保留？

Vue 3 中自定义分隔符的配置方式不同，且项目已前后端分离，建议直接使用默认的 `{{ }}`。

### Q2: jQuery 轮播图如何迁移？

方案 A：保留 jQuery，在组件 mounted 中初始化。
方案 B：使用 Vue 重写轮播图组件（推荐）。

### Q3: 多页面如何变成单页面？

使用 Vue Router 管理路由，所有页面变成组件，通过 `<router-view>` 切换。

### Q4: 后端 API 地址如何配置？

使用环境变量 `VITE_API_BASE_URL`，在 `.env` 文件中配置。

---

*文档生成日期：2026-06-27*