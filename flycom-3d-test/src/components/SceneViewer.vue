<template>
  <section class="viewer-card" aria-label="3D-pogled">
    <div ref="container" class="viewer" @pointerup="handlePointerUp" />
    <div class="viewer-hint">
      <span class="status-dot" /> Leva tipka: zasuk · Kolešček: povečava
    </div>
    <div class="viewer-badge">{{ objects.length }} objektov</div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createThreeScene, type ThreeSceneController } from '@/composables/useThreeScene'
import type { SceneObjectData } from '@/types/sceneObject'

const props = defineProps<{ objects: SceneObjectData[]; selectedId: string | null }>()
const emit = defineEmits<{ objectSelected: [id: string | null] }>()
const container = ref<HTMLElement | null>(null)
let controller: ThreeSceneController | null = null

onMounted(() => {
  if (!container.value) return
  controller = createThreeScene(container.value)
  controller.syncObjects(props.objects)
})

watch(
  () => props.objects,
  (objects) => controller?.syncObjects(objects),
  { deep: true },
)

function handlePointerUp(event: PointerEvent): void {
  const id = controller?.pickObjectId(event) ?? null
  // TODO(candidate): connect raycast result with the shared selection state.
  void id
  void emit
}

onBeforeUnmount(() => controller?.dispose())
</script>
