<template>
    <div>
        <p>Products details for {{ id }}</p>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat quidem recusandae excepturi voluptatem nulla nam sed cupiditate sit! Exercitationem tenetur officiis consequatur voluptatem, aspernatur nemo cum voluptate neque numquam reprehenderit!</p>
    </div>
</template>

<script setup>
const { id } = useRoute().params;
</script>

<style  scoped>

</style>