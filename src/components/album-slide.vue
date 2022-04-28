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
        <div class="flex flex-col justify-center gap-0.5 px-px">
            <img
                class="max-w-full"
                :src="`${serverImgBaseURL}/${item.key}/${page}`"
                alt=""
                v-for="(page, key) in item.pages"
                :key="key"
                loading="lazy"
                :id="`p${key}`"
            />
        </div>
    </main>
</template>
<script setup>
import { res, serverImgBaseURL } from '../assets/resource.json';
import { useRoute } from 'vue-router';
const id = useRoute().params.id;
const item = res[id];
</script>
