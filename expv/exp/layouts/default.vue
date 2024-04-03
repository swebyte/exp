<template>
    <div>
        <header class="shadow-sm bg-color1">
            <div class="flex justify-center space-x-4">
                <NuxtLink v-for="item in navigation" :key="item.name" :to="item.href" class="my-4">
                    {{ item.name }}
                </NuxtLink>
            </div>
        </header>
        <!-- Output the page content -->
        <div class="container mx-auto p-4">
            <slot />
        </div>
    </div>
</template>
<script setup>

const route = useRoute();

const navigation = [
    { name: 'About Me', href: '/', current: route.name === 'index' || route.name === '/' },
    { name: 'Experience', href: '/experience', current: route.name == 'experience' },
    { name: 'Methods', href: '/methods', current: route.name == 'methods' },
]

</script>

<style scoped>
.router-link-exact-active {
    color: #12b488
}
</style>