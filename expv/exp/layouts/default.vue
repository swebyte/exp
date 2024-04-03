<template>
    <div>
        <header class="shadow-sm bg-white">
            <!-- <nav class="container mx-auto p-4 flex justify-between">
                <NuxtLink to="/" class="font-bold">Nuxt Dojo</NuxtLink>
                <ul class="flex gap-4">
                    <li><NuxtLink to="/">About me</NuxtLink></li>
                    <li><NuxtLink to="/experience">Experience</NuxtLink></li>

                </ul>
            </nav> -->

            <div class="flex space-x-4">
              <a v-for="item in navigation" :key="item.name" :href="item.href"
                :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium']"
                :aria-current="item.current ? 'page' : undefined">{{ item.name }}</a>
            </div>
        </header>

        <!-- Output the page content -->
        <div class="container mx-auto p-4">
            <slot/>
        </div>
    </div>
</template>

<script setup>

const route = useRoute();

const navigation = [
  { name: 'About Me', href: '/', current: route.name == 'index' },
  { name: 'Experience', href: '/experience', current: route.name.includes('exp') },
  { name: 'Methods', href: '/methods', current: route.name == 'methods' },
]

</script>

<style scoped>
    .router-link-exact-active {
        color: #12b488
    }
</style>