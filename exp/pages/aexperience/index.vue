<script setup>

useHead({
  title: 'exp',
  description: 'My experience',
  image: 'https://example.com/image.jpg',
  url: 'https://example.com/experience',
})

</script>

<template>
      <ContentList path="/experience" v-slot="{ list }">
        <div v-for="exp in list" :key="exp._path">
          <Post :path="`/experience/${exp.slug}`" />
        </div>
      </ContentList>
</template>
