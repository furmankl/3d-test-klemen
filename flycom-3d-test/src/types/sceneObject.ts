export const sceneObjectTypes = ['box', 'sphere', 'cylinder'] as const

export type SceneObjectType = (typeof sceneObjectTypes)[number]

export interface Vector3Data {
  x: number
  y: number
  z: number
}

export interface SceneObjectData {
  id: string
  name: string
  type: SceneObjectType
  position: Vector3Data
  color: string
  visible: boolean
}

export type NewSceneObject = Omit<SceneObjectData, 'id'>
export type SceneObjectPatch = Partial<Omit<SceneObjectData, 'id' | 'type' | 'position'>>
export type ObjectTypeFilter = SceneObjectType | 'all'
