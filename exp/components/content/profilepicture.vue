<template>
  <section
    class="flex flex-col items-center overflow-hidden clip border-t-4 border-b-4 border-crimson-darker"
  >
    <img
      src="~/public/vk1.jpg"
      alt="profile image"
      class="w-full max-w-[900px] p-0 m-0 -mt-16"
    />
  </section>
</template>

<script setup></script>

<style scoped>
.clip {
  clip-path: polygon(20% 0%, 100% 0, 100% 80%, 80% 100%, 0 100%, 0% 20%);
}
</style>
