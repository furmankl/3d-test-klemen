<template>
  <div class="loading-overlay" role="status">
    <span class="spinner" aria-hidden="true" />
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Nalaganje scene ...' })
</script>
