<template>
    <div>
        <header class="shadow-sm bg-color1">
            <div class="flex flex-col items-center space-y-4">
                <div class="my-2 text-2xl font-bold">VINCENT KARLSSON</div>
                <div class="flex space-x-4">
                    <NuxtLink v-for="item in navigation" 
                        :key="item.name" 
                        :to="item.href" 
                        class="mb-4 hover:text-crimson"
                        activeClass="text-crimson">
                        {{ item.name }}
                    </NuxtLink>
                </div>
            </div>
        </header>
        
        <!-- Output the page content -->
        <div class="container mx-auto p-4">
            <p class="flex space-x-4 justify-end">
                <a href="https://github.com/swebyte"  target="_blank"><img src="https://github.com/favicon.ico" alt="GitHub" width="30"></a>
                <a href="https://linkedin.com/in/vincent-karlsson-284740149" target="_blank"><img src="https://linkedin.com/favicon.ico" alt="LinkedIn" width="30"></a>
            </p>
            <br>
            <div class="flex items-center justify-center">
                <div class="flex item-start justify-center flex-col flex-wrap">
                    <slot />  
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

const route = useRoute();

const navigation = [
    { name: 'About Me', href: '/', current: route.name === 'index' || route.name === '/' },
    { name: 'Experience', href: '/aexperience', current: route.name == 'experience' },
    { name: 'Methods', href: '/methods', current: route.name == 'methods' },
]

</script>

<style scoped>

</style>
