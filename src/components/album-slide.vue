<template>
    <main>
        <h1 class="py-4 text-center text-2xl font-bold">
            <router-link
                class="hover:text-sky-300/90 hover:underline"
                :to="{ name: 'album-detail', params: { id } }"
            >
                {{ item.title }}
            </router-link>
        </h1>
        <div class="flex justify-center gap-4 pb-4">
            <router-link
                class="hover:text-sky-300/90"
                :to="{
                    name: 'album-slide',
                    params: { id },
                }"
            >
                一般
            </router-link>
            <router-link
                class="hover:text-sky-300/90"
                :to="{
                    name: 'album-slide',
                    params: { id },
                    query: { view: 'contain' },
                }"
            >
                高度限制
            </router-link>
        </div>
        <div
            id="pswp-lightbox"
            class="flex flex-col justify-center gap-0.5 px-px"
            :class="addClass.div"
        >
            <a
                class="mx-auto block"
                v-for="(page, key) in item.pages"
                :key="key"
                :id="`a${key}`"
                :href="`${serverImgBaseURL}/${item.key}/${page}`"
            >
                <img
                    class="max-w-full"
                    :class="addClass.img"
                    :src="`${serverImgBaseURL}/${item.key}/${page}`"
                    alt=""
                    :id="`p${key}`"
                    :onload="imgOnload"
                />
            </a>
        </div>
    </main>
</template>
<script setup>
import { res, serverImgBaseURL } from '../assets/resource.json';
import { useRoute } from 'vue-router';
import { computed, onMounted, onUnmounted } from 'vue';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
const route = useRoute();
const id = route.params.id;
const item = res[id];
const addClass = computed(() => {
    if (route.query.view === 'contain') {
        return { img: ['max-h-screen', 'object-contain'], div: [] };
    }
    return [{ img: [], div: [] }];
});

const lightbox = new PhotoSwipeLightbox({
    gallery: '#pswp-lightbox',
    children: 'a',
    pswpModule: () => import('photoswipe'),
});

function imgOnload(event) {
    const target = event.target;
    const w = target.naturalWidth;
    const h = target.naturalHeight;
    const key = target.id.slice(1);
    const a = document.querySelector(`#a${key}`);
    a.setAttribute('data-pswp-width', w);
    a.setAttribute('data-pswp-height', h);
}

onMounted(() => {
    lightbox.init();
});
onUnmounted(() => {
    lightbox.destroy();
});
</script>
