<template>
    <main class="container mx-auto">
        <div class="mx-auto max-w-6xl bg-white/5 p-4">
            <h1 class="text-center text-2xl font-bold">{{ item.title }}</h1>
            <hr class="my-2 opacity-40" />
            <div class="flex flex-col justify-center md:flex-row">
                <!-- cover -->
                <div
                    class="mx-auto flex h-80 w-56 items-center justify-center md:mx-0"
                >
                    <img
                        class="max-h-full max-w-full rounded"
                        :src="`${serverImgBaseURL}/${item.key}/${item.cover}`"
                        alt="cover"
                    />
                </div>
                <!-- detail -->
                <div class="p-4">
                    <p>
                        <span class="pr-4">頁數</span
                        ><span>{{ item.pagelen }}</span>
                    </p>
                    <p>
                        <span class="pr-4">日期</span
                        ><span>{{ item.createDate }}</span>
                    </p>
                    <p>
                        <span class="pr-4">來源</span
                        ><a
                            class="hover:text-sky-300/90 hover:underline"
                            :href="item.albumUrl"
                            rel="noreferrer noopener nofollow"
                            >{{ item.albumUrl }}</a
                        >
                    </p>
                </div>
            </div>
            <div class="my-4 text-center">
                <router-link
                    class="inline-block w-1/2 rounded bg-purple-500 px-4 py-2 text-lg font-bold shadow-md hover:bg-purple-300"
                    :to="{ name: 'album-slide', params: { id } }"
                    >開始閱讀
                </router-link>
            </div>
            <hr class="my-4 opacity-40" />
            <!-- nav button for preview -->
            <MyPagination
                :cur="currentPage"
                :max="pageChunks.length"
                @change="handlePageChange"
            >
            </MyPagination>
            <!-- preview images -->
            <div v-for="(i, j) in pageChunks.length" :key="i">
                <div
                    class="grid auto-rows-fr grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 md:gap-2 lg:grid-cols-6 xl:grid-cols-8"
                    v-show="currentPage === j"
                >
                    <div v-for="(page, index) in pageChunks[j]" :key="index">
                        <router-link
                            :to="{
                                name: 'album-slide',
                                hash: `#p${index + j * chunkLength}`,
                                params: { id },
                            }"
                        >
                            <img
                                class="max-h-full max-w-full rounded"
                                :src="`${serverImgBaseURL}/${item.key}/${page}`"
                                alt=""
                                loading="lazy"
                        /></router-link>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script setup>
import { res, serverImgBaseURL } from '../assets/resource.json';
import { useRoute } from 'vue-router';
import { ref, computed } from 'vue';
import MyPagination from './my-pagination.vue';
const id = useRoute().params.id;
const item = res[id];
const chunkLength = 48;
const pageChunks = computed(() => splitArrayChunk(item.pages, chunkLength));
const currentPage = ref(0);

function splitArrayChunk(arr, chunkLength = 10) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkLength) {
        res.push(arr.slice(i, i + chunkLength));
    }
    return res;
}

function handlePageChange(index) {
    currentPage.value = index;
}
</script>
