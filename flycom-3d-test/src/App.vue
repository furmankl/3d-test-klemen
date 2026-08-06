<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark">F</span>
        <div><strong>FLYCOM</strong><small>3D SCENE WORKSPACE</small></div>
      </div>
      <div class="topbar-actions">
        <span class="connection"><span class="status-dot" /> Lokalna scena</span
        ><button
          class="button button--quiet"
          type="button"
          :disabled="isLoading"
          @click="store.reset"
        >
          Ponastavi podatke
        </button>
      </div>
    </header>
    <main class="workspace">
      <ObjectList
        :objects="filteredObjects"
        :selected-id="selectedObjectId"
        :filter="typeFilter"
        @select="store.select"
        @update:filter="store.typeFilter = $event"
      />
      <div class="viewport-column">
        <SceneViewer
          :objects="objects"
          :filteredObjects="filteredObjects"
          :selected-id="selectedObjectId"
          @object-selected="store.select"
        />
        <ErrorMessage
          v-if="error"
          :message="error"
          retry-label="Poskusi znova"
          @retry="store.load"
        />
      </div>
      <aside class="right-rail">
        <ObjectDetails :object="selectedObject" @remove="store.remove" @save="store.update" />
        <ObjectForm
          @add="store.add"
        />
      </aside>
    </main>
    <LoadingOverlay
      v-if="isLoading || isSaving"
      :label="isSaving ? 'Shranjevanje ...' : 'Nalaganje scene ...'"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ObjectDetails from '@/components/ObjectDetails.vue'
import ObjectForm from '@/components/ObjectForm.vue'
import ObjectList from '@/components/ObjectList.vue'
import SceneViewer from '@/components/SceneViewer.vue'
import { useSceneObjects } from '@/composables/useSceneObjects'

const {
  store,
  objects,
  filteredObjects,
  selectedObjectId,
  selectedObject,
  typeFilter,
  isLoading,
  isSaving,
  error,
} = useSceneObjects()
onMounted(() => store.load())
</script>
