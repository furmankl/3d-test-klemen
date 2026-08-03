import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeObject } from '@/utils/createThreeObject'
import { disposeThreeObject } from '@/utils/disposeThreeObject'
import type { SceneObjectData } from '@/types/sceneObject'
import { useSceneObjectsStore } from '@/stores/sceneObjectsStore'
import { storeToRefs } from 'pinia'

export interface ThreeSceneController {
  syncObjects: (objects: SceneObjectData[]) => void
  pickObjectId: (event: PointerEvent) => string | null
  dispose: () => void
  highlightObject: (id: string | null) => void
}

export function createThreeScene(container: HTMLElement): ThreeSceneController {
  const scene = new THREE.Scene()
  const sceneObjectsStore = useSceneObjectsStore();

  const { selectedObjectId } = storeToRefs(sceneObjectsStore);
  const { select } = sceneObjectsStore
  scene.background = new THREE.Color('#101d2b')
  scene.fog = new THREE.Fog('#101d2b', 18, 34)

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100)
  camera.position.set(9, 8, 11)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 0.8, 0)
  controls.maxPolarAngle = Math.PI / 2.05
  controls.minDistance = 4
  controls.maxDistance = 28

  scene.add(new THREE.HemisphereLight('#dbeafe', '#172033', 2.1))
  const sun = new THREE.DirectionalLight('#ffffff', 2.8)
  sun.position.set(7, 12, 6)
  sun.castShadow = true
  scene.add(sun)
  scene.add(new THREE.GridHelper(20, 20, '#31516c', '#1d3549'))
  const axes = new THREE.AxesHelper(2)
  axes.position.y = 0.02
  scene.add(axes)

  const objectGroup = new THREE.Group()
  objectGroup.name = 'scene-objects'
  scene.add(objectGroup)
  const meshes = new Map<string, THREE.Mesh>()
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let frameId = 0

  function resize(): void {
    const width = Math.max(container.clientWidth, 1)
    const height = Math.max(container.clientHeight, 1)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  const observer = new ResizeObserver(resize)
  observer.observe(container)
  resize()

  function animate(): void {
    frameId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  function syncObjects(objects: SceneObjectData[]): void {
    const activeIds = new Set(objects.map((item) => item.id))
    for (const [id, mesh] of meshes) {
      if (!activeIds.has(id)) {
        objectGroup.remove(mesh)
        disposeThreeObject(mesh)
        meshes.delete(id)
      }
      highlightObject(id);
    }
    for (const item of objects) {
      let mesh = meshes.get(item.id)
      if (!mesh) {
        mesh = createThreeObject(item)
        meshes.set(item.id, mesh)
        objectGroup.add(mesh)
      }
      mesh.name = item.name
      mesh.visible = item.visible
      console.log(`Syncing object: ${item.name}, ID: ${item.id}, Visible: ${item.visible}, Color: ${item.color}`)
      ;
      (mesh.material as THREE.MeshStandardMaterial).color.set(item.color)
    }
  }

  function pickObjectId(event: PointerEvent): string | null {
    const bounds = renderer.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects([...meshes.values()], false)[0];

    if(hit?.object.userData.sceneObjectId) {
      select(hit.object.userData.sceneObjectId);
    }
    
    return typeof hit?.object.userData.sceneObjectId === 'string'
      ? hit.object.userData.sceneObjectId
      : null
  }

  function dispose(): void {
    cancelAnimationFrame(frameId)
    observer.disconnect()
    controls.dispose()
    objectGroup.children.forEach(disposeThreeObject)
    meshes.clear()
    renderer.dispose()
    renderer.domElement.remove()
  }

  function highlightObject(id: string | null): void {
    const highlight = selectedObjectId.value === id;
    // Create outline object
    
    if(id) {
      if(meshes.has(id)) {
        // set opacity + scale it up

        meshes.get(id)?.scale.set(highlight ? 1.05 : 1.0, highlight ? 1.05 : 1.0, highlight ? 1.05 : 1.0);
        const material = meshes.get(id)?.material as THREE.MeshStandardMaterial

        material.transparent = true;
        material.opacity = highlight ? 0.9 : 1.0; 
        material.needsUpdate = true 
      }
    }

    animate();
  }
  return { syncObjects, pickObjectId, dispose, highlightObject }
}
