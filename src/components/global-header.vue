<template>
    <header
        class="border-p flex h-12 items-center border-b border-purple-500/40 bg-white/5"
    >
        <nav class="px-4">
            <ul class="flex gap-4">
                <li>
                    <router-link
                        class="hover:text-sky-300/90 hover:underline"
                        :to="{ name: 'home' }"
                        >首頁</router-link
                    >
                </li>
            </ul>
        </nav>
    </header>
</template>
