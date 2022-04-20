import {App} from "vue";
import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import {PageEnum} from "../enum/pageEnum";


const routeModuleList: RouteRecordRaw[] = [];


export const RootRoute: RouteRecordRaw = {
    path: '/',
    name: 'Root',
    redirect: PageEnum.BASE_LOGIN,
    meta: {
        title: 'Root'
    }
};


export const LoginRoute: RouteRecordRaw = {
    path: PageEnum.BASE_LOGIN,
    name: PageEnum.BASE_LOGIN_NAME,
    component: e => import('../views/login/login.vue'),
    meta: {
        title: '登录'
    }
}

export const PortalRoute: RouteRecordRaw = {
    path: PageEnum.BASE_PORTAL,
    name: PageEnum.BASE_PORTAL_NAME,
    component: e => import('../views/portal/portal.vue'),
    meta: {
        title: '首页'
    }
}

export const MapRoute: RouteRecordRaw = {
    path: PageEnum.BASE_MAP,
    name: PageEnum.BASE_MAP_NAME,
    component: e => import('../views/map/map.vue'),
    meta: {
        title: 'Three demo'
    }
}

export const MapQingHaiRoute: RouteRecordRaw = {
    path: PageEnum.BASE_MAP_QINGHAI,
    name: PageEnum.BASE_MAP_QINGHAI_NAME,
    component: e => import('../views/map/mapQingHai.vue'),
    // component: e => import('../views/map/mapMove.vue'),
    meta: {
        title: '青海地图'
    }
}


export const asyncRotes = [...routeModuleList];

export const constantRouter: any[] = [
    RootRoute,
    LoginRoute,
    PortalRoute,
    MapRoute,
    MapQingHaiRoute,
];


const router = createRouter({
    history: createWebHashHistory(''),
    routes: constantRouter,
    strict: true,
    scrollBehavior: e => ({left: 0, top: 0})
});

export function setupRouter(app: App) {

    app.use(router);

    // createRouterGuards(router)

}


export default router;

