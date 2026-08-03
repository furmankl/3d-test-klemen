import * as THREE from 'three'
import type { SceneObjectData } from '@/types/sceneObject'

export function createThreeObject(data: SceneObjectData): THREE.Mesh {
  const geometry =
    data.type === 'sphere'
      ? new THREE.SphereGeometry(0.65, 32, 20)
      : data.type === 'cylinder'
        ? new THREE.CylinderGeometry(0.45, 0.55, 2.2, 24)
        : new THREE.BoxGeometry(1.4, 1.4, 1.4)
  const material = new THREE.MeshStandardMaterial({
    color: data.color,
    roughness: 0.55,
    metalness: 0.08,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = data.name
  mesh.position.set(data.position.x, data.position.y, data.position.z)
  mesh.visible = data.visible
  mesh.userData.sceneObjectId = data.id
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}
