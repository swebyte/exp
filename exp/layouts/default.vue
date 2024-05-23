<template>
    <div>
        <header class="shadow-sm bg-color1 pt-8 pb-6">
            <div class="flex flex-col items-center space-y-4">
                <div class="font-robotoslab m-4 text-2xl sm:text-4xl font-bold">VINCENT KARLSSON</div>
                <div class="flex space-x-4">
                    <NuxtLink v-for="item in navigation" 
                        :key="item.name" 
                        :to="item.href" 
                        class="hover:text-crimson text-xl"
                        activeClass="text-crimson">
                        {{ item.name }}
                    </NuxtLink>
                </div>
            </div>
        </header>

     
        <!-- Output the page content -->
        <div class="container mx-auto p-4 pb-12">
            <div class="flex space-x-4 justify-center">
                <a href="https://github.com/swebyte"  target="_blank"><img src="https://github.com/favicon.ico" alt="GitHub" width="30"></a>
                <Downloadcvbutton></Downloadcvbutton>
                <a href="https://linkedin.com/in/vincent-karlsson-284740149" target="_blank"><img src="https://linkedin.com/favicon.ico" alt="LinkedIn" width="30"></a>
            </div>
            <br>
          

            <div class="flex items-center justify-center">
                <div class="flex item-start justify-center flex-col flex-wrap">
                    <slot />  
                </div>
            </div>
        </div>


<footer class="relative bg-color1 pt-8 pb-6 ">
  <div class="container mx-auto px-4">
    <div class="flex justify-center text-center ">
      <div class="w-full lg:w-6/12 px-4">
        <h4 class="text-3xl fonat-semibold">Let me hear from you!</h4>
        <h5 class="text-lg mt-0 mb-2">
          Find me on any of these platforms
        </h5>
        <div class="flex space-x-4 justify-center p-4">
            <a href="https://github.com/swebyte"  target="_blank"><img src="https://github.com/favicon.ico" alt="GitHub" width="30"></a>
            <a href="https://linkedin.com/in/vincent-karlsson-284740149" target="_blank"><img src="https://linkedin.com/favicon.ico" alt="LinkedIn" width="30"></a>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap items-center md:justify-between justify-center">
      <div class="w-full md:w-4/12 px-4 mx-auto text-center">
        <div class="text-sm text-gray-500 py-1">
          CopyIsAlright © <span id="get-current-year">2024</span>
        </div>
      </div>
    </div>
  </div>
</footer>

        <!-- <footer>
            <div class>

            </div>
            <hr class="h-px my-8 border-0 bg-color1 w-[50%]">
            <div class="flex space-x-4 justify-center">
                <a href="https://github.com/swebyte"  target="_blank"><img src="https://github.com/favicon.ico" alt="GitHub" width="30"></a>
                <a href="https://linkedin.com/in/vincent-karlsson-284740149" target="_blank"><img src="https://linkedin.com/favicon.ico" alt="LinkedIn" width="30"></a>
                </div>
        </footer> -->
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
