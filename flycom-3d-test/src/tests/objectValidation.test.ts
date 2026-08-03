import { describe, expect, it } from 'vitest'
import { isSceneObject, validateNewObject } from '@/utils/objectValidation'

describe('object validation', () => {
  it('accepts a supported scene object', () => {
    expect(
      isSceneObject({
        id: 'a',
        name: 'A',
        type: 'box',
        position: { x: 0, y: 1, z: 2 },
        color: '#112233',
        visible: true,
      }),
    ).toBe(true)
  })
  it('reports invalid creation input', () => {
    expect(
      validateNewObject({
        name: '',
        type: 'sphere',
        position: { x: 0, y: 0, z: 0 },
        color: 'red',
        visible: true,
      }),
    ).toHaveLength(2)
  })
})
