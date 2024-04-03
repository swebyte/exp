<script setup>

</script>

<template>
  <h1 class="text-3xl my-8">Experiences</h1>

  <section class="">

    <ContentList path="/experience" v-slot="{ list }">
      <div v-for="exp in list" :key="exp._path">
        <!-- <ContentDoc :path="`/experience/${exp.slug}`" v-slot="{ doc }">
          <ContentRenderer :value="doc" />
        </ContentDoc> -->

        <Post :path="`/experience/${exp.slug}`" />
      </div>
    </ContentList>

  </section>
</template>
