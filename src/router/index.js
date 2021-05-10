import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
export default new Router({
    routes: [{
            path: '/',
            redirect: '/Login'
        },
        {
            path: '/Home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '金石系统' },
            children: [
                // //用户管理
                // {
                //     path: '/couponMessage',
                //     component: resolve => require(['../components/page/couponMessage.vue'], resolve),
                //     meta: { title: '优惠券管理' }
                // },
                // //优惠券生成
                // {
                //     path: '/couponCheck',
                //     component: resolve => require(['../components/page/couponCheck.vue'], resolve),
                //     meta: { title: '优惠券生成' }
                // },
                //在场记录
                {
                    path: '/lincensePlate',
                    component: resolve => require(['../components/page/lincensePlate.vue'], resolve),
                    meta: { title: '在场记录' }
                },
                {
                    path: '/lincensePlateHistory',
                    component: resolve => require(['../components/page/lincensePlateHistory.vue'], resolve),
                    meta: { title: '历史记录' }
                },
                {
                    path: '/todaySummary',
                    component: resolve => require(['../components/page/todaySummary.vue'], resolve),
                    meta: { title: '当日汇总' }
                },
                {
                    path: '/dailySummary',
                    component: resolve => require(['../components/page/dailySummary.vue'], resolve),
                    meta: { title: '每日汇总' }
                },
                {
                    path: '/monthlySummary',
                    component: resolve => require(['../components/page/monthlySummary.vue'], resolve),
                    meta: { title: '每月汇总' }
                },
                {
                    path: '/annuallySummary',
                    component: resolve => require(['../components/page/annuallySummary.vue'], resolve),
                    meta: { title: '每年汇总' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})