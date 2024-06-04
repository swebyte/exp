<template>
    <div>
        <header class="shadow-sm bg-color1 pt-8 pb-8">
            <div class="flex flex-col items-center space-y-1">
                <div class="font-robotoslab pb-2 text-3xl sm:text-4xl font-bold">VINCENT KARLSSON</div>
                <div class="flex space-x-4">
                    <NuxtLink v-for="item in navigation" 
                        :key="item.name" 
                        :to="item.href" 
                        class="hover:text-crimson text-xl transiation duration-200"
                        activeClass="text-crimson">
                        {{ item.name }}
                    </NuxtLink>
                </div>
            </div>
        </header>

     
        <!-- Output the page content -->
        <div class="container p-4 mx-auto pb-12 w-full">
            <div class="flex items-center justify-center w-full">
                <div class="flex item-start justify-center flex-col flex-wrap">
                    <slot />  
                </div>
            </div>
        </div>

        <Footer></Footer>
    </div>
</template>
<script setup>

const route = useRoute();

const navigation = [
    { name: 'About Me', href: '/', current: route.name === 'index' || route.name === '/' },
    { name: 'Experience', href: '/aexperience', current: route.name == 'experience' },
    { name: 'Skills', href: '/skills', current: route.name == 'skills' },
]

</script>

<style scoped>

</style>
