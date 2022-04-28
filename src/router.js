import { createRouter, createWebHistory } from 'vue-router';
import albumIndexVue from './components/album-index.vue';
import albumSlideVue from './components/album-slide.vue';
import albumDetailVue from './components/album-detail.vue';

const routes = [
    { path: '/', component: albumIndexVue, name: 'home' },
    { path: '/a/:id', component: albumDetailVue, name: 'album-detail' },
    { path: '/a/:id/slide', component: albumSlideVue, name: 'album-slide' },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: function (to, from, savedPosition) {
        if (to.hash) {
            return { el: to.hash };
        } else {
            return { x: 0, y: 0 };
        }
    },
});
