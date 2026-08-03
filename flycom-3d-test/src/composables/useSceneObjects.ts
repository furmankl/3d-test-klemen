import { storeToRefs } from 'pinia'
import { useSceneObjectsStore } from '@/stores/sceneObjectsStore'

export function useSceneObjects() {
  const store = useSceneObjectsStore()
  return { store, ...storeToRefs(store) }
}
