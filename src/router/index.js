import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import NProgress from '@/plugins/nprogress';
import Layout from '@/layouts/DefaultLayout.vue';
import { get, remove } from 'js-cookie';
import config from '@/config';
import { removeStorage } from '@/utils/storage';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/login/Index.vue')
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/Index.vue')
      },
      {
        path: '/orderManage',
        name: 'orderManage',
        component: () => import('@/views/orderManage/Index.vue'),
        meta: {
          name: '订单管理'
        }
      },
      {
        path: '/orderList/:id/:companyName',
        name: 'orderList',
        component: () => import('@/views/orderManage/components/orderList.vue'),
        meta: {
          name: '订单列表'
        }
      }
    ]
  }
];

const router = createRouter({
  // electron必须使用hash模式
  history: process.env.IS_ELECTRON ? createWebHashHistory(process.env.BASE_URL) : createWebHistory(process.env.BASE_URL),
  scrollBehavior: () => ({ top: 0, left: 0 }),
  routes
});

router.beforeEach((to, from, next) => {
  // 进度条
  NProgress.start();
  const token = get(config.tokenKey);
  // 其实路由拦截后所做跳转仅有一下几种情况：
  // 1.已登录时跳转到登录页（非登出的情况）需要重定向到根路径
  if (token && to.path === '/login') {
    return next('/');
  }
  //2.路由在白名单，或者已经登录且动态路由已加载完成，均放行
  if (['/login', '/err'].includes(to.path)) {
    return next();
  }
  next();
});

// 路由后置守卫
router.afterEach(NProgress.done);

// 登出
export function logout() {
  remove(config.tokenKey);
  remove(config.refreshTokenKey);
  removeStorage('userinfo', 'menus');
  router.replace('/login');
}

export default router;
