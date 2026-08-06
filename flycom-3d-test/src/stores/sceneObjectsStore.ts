import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { sceneObjectsApi } from '@/api/sceneObjectsApi'
import type {
  NewSceneObject,
  ObjectTypeFilter,
  SceneObjectData,
  SceneObjectPatch,
} from '@/types/sceneObject'

export const useSceneObjectsStore = defineStore('sceneObjects', () => {
  const objects = ref<SceneObjectData[]>([])
  const selectedObjectId = ref<string | null>(null)
  const typeFilter = ref<ObjectTypeFilter>('all')
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  const selectedObject = computed(
    () => objects.value.find((item) => item.id === selectedObjectId.value) ?? null,
  )
  const filteredObjects = computed(() => {
    if(typeFilter.value === 'all')
      return objects.value;
    else {
      let filtered = objects.value.filter((item) => item.type === typeFilter.value)
      if(!filtered.some((item) => item.id === selectedObjectId.value)) {
        select(null)
      }
      return filtered
    }
  })

  async function load(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      objects.value = await sceneObjectsApi.load()
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Prišlo je do neznane napake.'
    } finally {
      isLoading.value = false
    }
  }

  function select(id: string | null): void {
    selectedObjectId.value = id
  }

  async function add(input: NewSceneObject): Promise<void> {
    isSaving.value = true
    error.value = null
    try {
      const created = await sceneObjectsApi.add(input)
      objects.value.push(created)
      select(created.id)
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Objekta ni bilo mogoče dodati.'
    } finally {
      isSaving.value = false
    }
  }

  async function update(id: string, patch: SceneObjectPatch): Promise<void> {
    isSaving.value = true
    error.value = null
    try {
      const saved = await sceneObjectsApi.update(id, patch)
      const index = objects.value.findIndex((item) => item.id === id)
      if (index >= 0) objects.value[index] = saved
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Objekta ni bilo mogoče shraniti.'
    } finally {
      isSaving.value = false
    }
  }

  async function remove(id: string): Promise<void> {
    isSaving.value = true
    error.value = null
    try {
      objects.value = await sceneObjectsApi.delete(id)

      if(!objects.value.findIndex((item) => item.id === selectedObjectId.value)) {
        select(null)
      }
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Objekta ni bilo mogoče shraniti.'
    } finally {
      isSaving.value = false
    }
  }

  async function reset(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      objects.value = await sceneObjectsApi.reset()
      selectedObjectId.value = null
      typeFilter.value = 'all'
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Scene ni bilo mogoče ponastaviti.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    objects,
    selectedObjectId,
    selectedObject,
    filteredObjects,
    typeFilter,
    isLoading,
    isSaving,
    error,
    load,
    select,
    add,
    update,
    reset,
    remove
  }
})
