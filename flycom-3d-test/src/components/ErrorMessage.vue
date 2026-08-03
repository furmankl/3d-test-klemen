<template>
  <div class="error-message" role="alert">
    <span>{{ message }}</span>
    <button v-if="retryLabel" type="button" class="button button--quiet" @click="$emit('retry')">
      {{ retryLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string; retryLabel?: string }>()
defineEmits<{ retry: [] }>()
</script>
