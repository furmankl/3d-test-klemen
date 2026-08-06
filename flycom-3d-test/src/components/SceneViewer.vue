<template>
  <section class="viewer-card" :class="{ 'measurement-mode': measuringModeActive }" aria-label="3D-pogled">
    <div ref="container" class="viewer" @pointerup="handlePointerUp"  @pointerdown="handlePointerDown" />
    <div class="viewer-hint">
      <span class="status-dot" /> Leva tipka: zasuk · Kolešček: povečava
    </div>
    <div class="viewer-badge">
      {{ filteredObjects.length == objects.length ? filteredObjects.length : filteredObjects.length + ' / ' + objects.length }} objektov
    </div>
    <div class="measurement-button-container">
      <button class="button" :class="{ 'button--primary': measuringModeActive }" @click="toggleMeasurementMode()">
        {{ measuringModeActive ? 'Prekini meritve' : 'Začni meritve' }}
      </button>
    </div>
      </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import { createThreeScene, type ThreeSceneController } from '@/composables/useThreeScene'
import type { SceneObjectData } from '@/types/sceneObject'
import { useSceneObjectsStore } from '@/stores/sceneObjectsStore';
import { storeToRefs } from 'pinia';

const sceneObjectsStore = useSceneObjectsStore();
const { selectedObjectId } = storeToRefs(sceneObjectsStore);
const { remove } = sceneObjectsStore;

const props = defineProps<{ objects: SceneObjectData[]; filteredObjects: SceneObjectData[]; selectedId: string | null }>()
const emit = defineEmits<{ objectSelected: [id: string | null] }>()
const container = ref<HTMLElement | null>(null)
let controller = ref<ThreeSceneController | null>(null)
let measuringModeActive = ref<boolean>(false);
let startPointerPosition: {x: number, y: number} = {x: 0, y: 0}

onMounted(() => {
  if (!container.value) return
  controller.value = createThreeScene(container.value)
  controller.value.syncObjects(props.objects)
  window.addEventListener("keyup", handleKeyPress)
})

watch(
  () => selectedObjectId,
   (newValue) => {
      if(newValue) {
        controller.value?.syncObjects(props.objects);
        controller.value?.objectSelected(newValue.value);
      }
    },
    { deep: true },
  )

watch(
   () => props.objects,
   (objects) => {
    if(measuringModeActive.value) {
      toggleMeasurementMode()
    }
    controller.value?.syncObjects(objects)},
   { deep: true },
)

watch(
   () => props.filteredObjects,
   () => {
    if(measuringModeActive.value) {
      toggleMeasurementMode()
    }
    controller.value?.syncObjects(props.objects)
   },
   { deep: true },
)


function handleKeyPress(event: KeyboardEvent): void {
  if (event.key == "Escape") {
    if(measuringModeActive.value) {
      toggleMeasurementMode()
    }
    else {
      emit('objectSelected', null)
    }
  }
  else if (event.key == "m" || event.key == "M") {
    toggleMeasurementMode()
  }

  if(!selectedObjectId.value)
    return;

  if(event.key == "Delete") {
    remove(selectedObjectId.value)
  }
  const currentSelectedIndex = props.filteredObjects.findIndex((obj) => obj.id === selectedObjectId.value)
  if(event.key == "ArrowUp" && currentSelectedIndex > 0) {
    emit('objectSelected',props.filteredObjects[currentSelectedIndex - 1].id)
  }
  else if(event.key == "ArrowDown") {
    if(currentSelectedIndex < props.filteredObjects.length - 1) {
      emit('objectSelected',props.filteredObjects[currentSelectedIndex + 1].id)
    }
    else if(currentSelectedIndex == props.filteredObjects.length - 1) {
      emit('objectSelected',props.filteredObjects[0].id)
    }
  }
}
function handlePointerDown(event: PointerEvent): void {
  startPointerPosition.x = event.layerX
  startPointerPosition.y = event.layerY
}

function handlePointerUp(event: PointerEvent): void {
  if(Math.abs(event.layerX - startPointerPosition.x) > 10 ||
    Math.abs(event.layerY - startPointerPosition.y) > 10) {
    return
  }
  const id = controller.value?.pickObjectId(event) ?? null
  emit('objectSelected', id)
}


function toggleMeasurementMode(): void {
  emit('objectSelected', null)
  let toggle = controller.value?.toggleMeasurementMode();

  if(toggle){
    measuringModeActive.value = toggle
  }
  else {
    measuringModeActive.value = false
  }
}



onBeforeUnmount(() => 
  controller.value?.dispose()
)

onUnmounted(() =>
  window.removeEventListener("keyup", handleKeyPress)
)
</script>
