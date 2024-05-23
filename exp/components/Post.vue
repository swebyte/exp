<script setup>
const props = defineProps(['path'])
</script>

<template>
    <ContentDoc :path="props.path" v-slot="{ doc }">
            <!-- Header  -->
            <header>
                <div class="pt-5 pb-2">
                    <h1 class="text-2xl font-bold">{{ doc.title }}</h1>
                    <p class="text-gray-500 text-sm">{{ doc.date }}</p>
                </div>
            </header>
            <!-- ./ Header  -->
            
            <!-- Content -->
            <!-- <div class="text-white prose "> -->
                <ContentRenderer :value="doc" class="prose max-w-[100ch]"/>
            <!-- </div> -->
        <!-- ./ Content  -->
    </ContentDoc>
</template>

<style scoped></style>
