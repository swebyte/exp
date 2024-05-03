<script setup>
useHead({
  title: 'About me',
  description: 'My experience',
  image: 'https://swebyte.github.io/image.jpg',
  url: 'https://swebyte.github.io/exp',
})

</script>

<template>
      <p class="flex space-x-4 justify-end">
            <a href="https://github.com/swebyte"  target="_blank"><img src="https://github.com/favicon.ico" alt="GitHub" width="30"></a>
            <a href="https://linkedin.com/in/vincent-karlsson-284740149" target="_blank"><img src="https://linkedin.com/favicon.ico" alt="LinkedIn" width="30"></a>
      </p>
      <ContentDoc class="prose max-w-[100ch]"/>
</template>