<script setup>
const { path } = useRoute();

const { data } = await useAsyncData(`content-${path}`, () => {
  return queryContent(path)
  .where({_path: path})
  .findOne()
})
</script>

<template>
  <main>
    <ContentRenderer :value="data" class="prose" />
  </main>
</template>