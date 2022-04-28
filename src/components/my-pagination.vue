<template>
    <div class="flex flex-wrap gap-1 py-4" @click.stop="handleNavButtonClick">
        <button
            class="inline-block h-6 w-6 rounded"
            :class="{
                'bg-sky-500': cur === j,
                'hover:bg-white/10': cur !== j,
            }"
            v-for="(i, j) in max"
            :key="i"
            :disabled="cur === j"
            :data-index="j"
        >
            {{ i }}
        </button>
    </div>
</template>
<script>
export default {
    emits: ['change'],
    props: {
        cur: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
    },
    methods: {
        handleNavButtonClick(event) {
            if (!event.target.dataset.index) {
                return;
            }
            this.$emit('change', parseInt(event.target.dataset.index));
        },
    },
};
</script>
