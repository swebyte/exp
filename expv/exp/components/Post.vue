<script setup>
const props = defineProps(['path'])
</script>

<template>
    <ContentDoc :path="props.path" v-slot="{ doc }">
        <!-- Header  -->
        <header>
            <div class=" p-5">
                <h1 class="text-4xl font-bold lg:w-2/3">{{ doc.title }}</h1>
                <p class="text-gray-500 text-sm mt-2">{{ doc.date }}</p>
            </div>
        </header>
        <!-- ./ Header  -->

        <!-- Content -->
        <div class="mt-4 content p-5">
            <ContentRenderer :value="doc" />
        </div>
        <!-- ./ Content  -->
    </ContentDoc>
</template>

<style scoped></style>
