import { sceneObjectTypes, type NewSceneObject, type SceneObjectData } from '@/types/sceneObject'

const colorPattern = /^#[0-9a-f]{6}$/i

export function isSceneObject(value: unknown): value is SceneObjectData {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  const position = item.position as Record<string, unknown> | undefined
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    sceneObjectTypes.includes(item.type as (typeof sceneObjectTypes)[number]) &&
    typeof item.color === 'string' &&
    colorPattern.test(item.color) &&
    typeof item.visible === 'boolean' &&
    !!position &&
    ['x', 'y', 'z'].every(
      (axis) => typeof position[axis] === 'number' && Number.isFinite(position[axis]),
    )
  )
}

export function validateNewObject(value: NewSceneObject): string[] {
  const errors: string[] = []
  if (!value.name.trim()) errors.push('Ime je obvezno.')
  if (!colorPattern.test(value.color)) errors.push('Barva mora biti v obliki #RRGGBB.')
  if (!sceneObjectTypes.includes(value.type)) errors.push('Tip objekta ni podprt.')
  if (Object.values(value.position).some((coordinate) => !Number.isFinite(coordinate))) {
    errors.push('Koordinate morajo biti veljavna števila.')
  }
  return errors
}
