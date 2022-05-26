<template>
    <main>
        <ul class="flex flex-wrap gap-4 px-4 py-8">
            <li
                class="w-60 bg-white/5 p-2"
                v-for="(item, key) in res"
                :key="key"
            >
                <div class="flex h-80 w-56 items-center justify-center">
                    <router-link
                        :to="{ name: 'album-detail', params: { id: key } }"
                        :title="item.title"
                    >
                        <img
                            class="max-h-full max-w-full rounded"
                            :src="`${serverImgBaseURL}/${item.key}/${item.cover}`"
                            alt=""
                            loading="lazy"
                    /></router-link>
                </div>
                <router-link
                    class="max-w-full line-clamp-2 hover:text-sky-300/90 hover:underline"
                    :to="{ name: 'album-detail', params: { id: key } }"
                    :title="item.title"
                    >{{ item.title }}
                </router-link>
            </li>
        </ul>
    </main>
</template>

<script setup>
import { res, serverImgBaseURL } from '../assets/resource.json';
</script>
