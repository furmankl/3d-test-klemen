import initialSceneObjects from '@/data/sceneObjects.json'
import { isSceneObject } from '@/utils/objectValidation'
import type { NewSceneObject, SceneObjectData, SceneObjectPatch } from '@/types/sceneObject'

const STORAGE_KEY = 'flycom-3d-scene-objects-v1'
const DELAY_MS = 350

export class SceneObjectsApiError extends Error {
  constructor(
    message: string,
    public readonly code: 'INVALID_DATA' | 'NOT_FOUND' | 'STORAGE_ERROR',
    options?: ErrorOptions,
  ) {
    super(message, options)
    this.name = 'SceneObjectsApiError'
  }
}

const wait = () => new Promise((resolve) => window.setTimeout(resolve, DELAY_MS))
const cloneInitial = (): SceneObjectData[] =>
  structuredClone(initialSceneObjects as SceneObjectData[])

function readStoredObjects(): SceneObjectData[] | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isSceneObject)) {
      localStorage.removeItem(STORAGE_KEY)
      throw new SceneObjectsApiError('Shranjeni podatki niso veljavni.', 'INVALID_DATA')
    }
    return parsed
  } catch (error) {
    if (error instanceof SceneObjectsApiError) throw error
    localStorage.removeItem(STORAGE_KEY)
    throw new SceneObjectsApiError('Shranjene scene ni bilo mogoče prebrati.', 'INVALID_DATA', {
      cause: error,
    })
  }
}

function persist(objects: SceneObjectData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objects))
  } catch (error) {
    throw new SceneObjectsApiError('Scene ni bilo mogoče shraniti.', 'STORAGE_ERROR', {
      cause: error,
    })
  }
}

export const sceneObjectsApi = {
  async load(): Promise<SceneObjectData[]> {
    await wait()
    return structuredClone(readStoredObjects() ?? cloneInitial())
  },
  async add(input: NewSceneObject): Promise<SceneObjectData> {
    await wait()
    const objects = readStoredObjects() ?? cloneInitial()
    const created: SceneObjectData = { ...input, id: crypto.randomUUID() }

    persist([...objects, created])
    return created
  },
  async update(id: string, patch: SceneObjectPatch): Promise<SceneObjectData> {
    await wait()
    const objects = readStoredObjects() ?? cloneInitial()
    const index = objects.findIndex((item) => item.id === id)
    if (index < 0) throw new SceneObjectsApiError('Objekt ne obstaja.', 'NOT_FOUND')
    const updated = { ...objects[index], ...patch }
    objects[index] = updated
    persist(objects)
    return updated
  },
  async delete(id: string): Promise<SceneObjectData[]> {
    await wait()
    let objects = readStoredObjects() ?? cloneInitial()
    const index = objects.findIndex((item) => item.id === id)
    if (index < 0) throw new SceneObjectsApiError('Objekt ne obstaja.', 'NOT_FOUND')
    objects = objects.filter((item) => item.id != id)
    persist(objects)
    return objects
  },
  async reset(): Promise<SceneObjectData[]> {
    await wait()
    const objects = cloneInitial()
    persist(objects)
    return structuredClone(objects)
  },
}
