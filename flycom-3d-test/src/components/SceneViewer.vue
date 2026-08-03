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
import { useSceneObjectsStore } from '@/stores/sceneObjectsStore';
import { storeToRefs } from 'pinia';

const sceneObjectsStore = useSceneObjectsStore();
const { selectedObjectId } = storeToRefs(sceneObjectsStore);

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
  () => selectedObjectId,
   (newValue, oldValue) => {
      if(newValue) {
        console.log("new selected object id:", newValue, "old selected object id:", oldValue);
        controller?.syncObjects(props.objects);
        controller?.highlightObject(newValue.value);
      }
    },
    { deep: true },
  )

watch(
   () => props.objects,
   (objects) => controller?.syncObjects(objects),
   { deep: true },
)

function handlePointerUp(event: PointerEvent): void {
  const id = controller?.pickObjectId(event) ?? null
  emit('objectSelected', id)

}

onBeforeUnmount(() => controller?.dispose())
</script>
