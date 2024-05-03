<script setup>
const { slug } = useRoute().params

</script>

<template>

  <ContentDoc :path="`/experience/${slug}`" v-slot="{ doc }">
    <ContentRenderer :value="doc" />
  </ContentDoc>

</template>