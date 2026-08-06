import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createThreeObject } from '@/utils/createThreeObject'
import { disposeThreeObject } from '@/utils/disposeThreeObject'
import type { SceneObjectData } from '@/types/sceneObject'
import { useSceneObjectsStore } from '@/stores/sceneObjectsStore'
import { storeToRefs } from 'pinia'
import { CSS2DObject, CSS2DRenderer, EffectComposer, OutlinePass, RenderPass } from 'three/examples/jsm/Addons.js'
import { ref } from 'vue'

export interface ThreeSceneController {
  syncObjects: (objects: SceneObjectData[]) => void
  pickObjectId: (event: PointerEvent) => string | null
  dispose: () => void
  objectSelected: (id: string | null) => void
  toggleMeasurementMode: () => boolean
}

export function createThreeScene(container: HTMLElement): ThreeSceneController {
  const scene = new THREE.Scene()
  const sceneObjectsStore = useSceneObjectsStore();

  const { selectedObjectId, filteredObjects, objects } = storeToRefs(sceneObjectsStore);
  const { select } = sceneObjectsStore
  scene.fog = new THREE.Fog('#101d2b', 18, 34)

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100)
  camera.position.set(9, 8, 11)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  container.appendChild(renderer.domElement)

  const labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(container.clientWidth, container.clientHeight)
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0px'
  labelRenderer.domElement.style.pointerEvents = 'none'
  container.appendChild(labelRenderer.domElement)
  
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

  let objectsToMeasure = ref<SceneObjectData[]>([])
  let measuringModeActive: boolean = false;
  let measuringLine: THREE.Line | null = null;
  const outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  )
  const measurementDiv = document.createElement('div');
  measurementDiv.className = 'spatial-measurement-label';
  let measurementText: (CSS2DObject | null) = new CSS2DObject(measurementDiv);

  const composer = new EffectComposer(renderer)

  composer.addPass(new RenderPass(scene, camera))

  function resize(): void {
    const width = Math.max(container.clientWidth, 1)
    const height = Math.max(container.clientHeight, 1)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
    composer.setSize(width, height)
    outlinePass.setSize(width, height)
  }

  const observer = new ResizeObserver(resize)
  observer.observe(container)
  resize()

  outlinePass.edgeStrength = 5
  outlinePass.edgeGlow = 0
  outlinePass.edgeThickness = 2
  outlinePass.visibleEdgeColor.set('#00ff00')

  composer.addPass(outlinePass)

  function animate(): void {
    frameId = requestAnimationFrame(animate)
    labelRenderer.render(scene, camera)
    controls.update()
    composer.render()
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
      objectSelected(id);
    }
    for (const item of objects) {
      let mesh = meshes.get(item.id)
      if (!mesh) {
        mesh = createThreeObject(item)
        meshes.set(item.id, mesh)
        objectGroup.add(mesh)
      }
      const material = meshes.get(item.id)?.material as THREE.MeshStandardMaterial

      if (filteredObjects.value.some((filteredItem) => filteredItem.id === item.id)) {
        material.transparent = false;
      } else {
        material.transparent = true;
        material.opacity = 0.2; 
        material.needsUpdate = true 
      }

      mesh.name = item.name
      mesh.visible = item.visible
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

    if(measuringModeActive && hit?.object.userData.sceneObjectId) {
      if(!objectsToMeasure.value.some((item) => item?.id === hit.object.userData.sceneObjectId)) {
        if(objectsToMeasure.value.length >= 2) {
          objectsToMeasure.value.shift()
        }
        objectsToMeasure.value.push(objects.value.find((item) => item.id === hit.object.userData.sceneObjectId)!)

        if (objectsToMeasure.value.length == 2) {
          // calculate distance between the two objects
          const obj1 = meshes.get(objectsToMeasure.value[0].id)
          const obj2 = meshes.get(objectsToMeasure.value[1].id)
          if(obj1 && obj2) {
            const distance = obj1.position.distanceTo(obj2.position)

            const points = [];
            points.push( obj1.position );
            points.push( obj2.position );
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

            removeMeasurementUI()

            measuringLine = new THREE.Line( geometry, material );
            scene.add( measuringLine );
            
            measurementDiv.textContent = `${distance.toFixed(2)} m`;
            measurementText = new CSS2DObject(measurementDiv);
            measurementText.position.set(
              (obj2.position.x + obj1.position.x) / 2, 
            (obj2.position.y + obj1.position.y) / 2, 
            (obj2.position.z + obj1.position.z) / 2);
            scene.add(measurementText);
          }
        }
      }
      else {
        objectsToMeasure.value = objectsToMeasure.value.filter((item) => item.id !== hit.object.userData.sceneObjectId)
      }

      if(objectsToMeasure.value.length < 2) {
        removeMeasurementUI()
      }

      outlinePass.selectedObjects = [...objectsToMeasure.value.map((item) => meshes.get(item.id)!)];
      return null;
    }

    if(hit?.object.userData.sceneObjectId) {
      select(hit.object.userData.sceneObjectId);
    }
    
    return typeof hit?.object.userData.sceneObjectId === 'string'
      ? hit.object.userData.sceneObjectId
      : null
  }

  function cleanUpAfterMeasurementMode() {
    removeMeasurementUI()
    objectsToMeasure.value = []
    outlinePass.selectedObjects = []
  }
  function removeMeasurementUI() {
    if(measuringLine) {
      scene.remove(measuringLine)
      disposeThreeObject(measuringLine)
      measuringLine = null;
    }
    if(measurementText) {
      scene.remove(measurementText)
      disposeThreeObject(measurementText)
      measurementText = null;
    }
  }

  function dispose(): void {
    cancelAnimationFrame(frameId)
    observer.disconnect()
    controls.dispose()
    objectGroup.children.forEach(disposeThreeObject)
    meshes.clear()
    labelRenderer.domElement.remove()
    renderer.dispose()
    renderer.domElement.remove()
  }

  function objectSelected(id: string | null): void {
    const highlight = selectedObjectId.value === id;
    // Create outline object
    
    if(id) {
      if(meshes.has(id)) {
        // add object to "selectedObjects" array for the outline
        if(highlight) {
          const mesh = meshes.get(id)
          outlinePass.selectedObjects = [mesh!]
          if(!measuringModeActive)
            controls.target.set(mesh?.position.x!, mesh?.position.y!, mesh?.position.z!)
        }
      }
    }
    else {
      // empty the "selectedObjects" array to remove the outline
      outlinePass.selectedObjects = [];
      controls.target.set(0,0,0)
    }
  }

  function toggleMeasurementMode(): boolean {
    if(measuringModeActive) {
      measuringModeActive= false;
      cleanUpAfterMeasurementMode();
    } else {
      measuringModeActive= true;
    }
    return measuringModeActive;
  }


  return { 
    syncObjects, 
    pickObjectId, 
    dispose, 
    objectSelected, 
    toggleMeasurementMode
   }
}
