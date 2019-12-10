import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [{
        path: "/register",
        component: () => import("../components/Register.vue"),
        hidden: true
    },
    {
        path: "/",
        component: () => import("../components/CreateBill.vue"),
        hidden: true
    },
    {
        path: "/insurance",
        component: () => import("../components/Insurance.vue"),
        hidden: true
    },
    {
        path: "/memberlist",
        component: () => import("../components/MemberList.vue"),
        hidden: true
    },
];

export default new Router({
    base: '/parcel',
    // linkActiveClass: "active",
    mode: "history",
    scrollBehavior: () => ({
        y: 0
    }),
    routes
});