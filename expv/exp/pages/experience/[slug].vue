<script setup>
const { slug } = useRoute().params

</script>

<template>

  <ContentDoc :path="`/experience/${slug}`" v-slot="{ doc }">

    <h1>{{ doc.title }}</h1>

    <ContentRenderer :value="doc" />

  </ContentDoc>

</template>