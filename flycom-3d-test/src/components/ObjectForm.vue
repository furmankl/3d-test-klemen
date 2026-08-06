<template>
  <section class="panel">
    <div class="panel-heading">
      <div>
        <span class="eyebrow">NOV OBJEKT</span>
        <h2>Dodaj v sceno</h2>
      </div>
    </div>
    <form class="stack" @submit.prevent="submit">
      <label class="field"
        ><span>Ime</span><input v-model.trim="draft.name" placeholder="npr. Merilna točka C"
      /></label>
      <div class="two-columns">
        <label class="field"
          ><span>Tip</span
          ><select v-model="draft.type">
            <option value="box">Kvader</option>
            <option value="sphere">Krogla</option>
            <option value="cylinder">Valj</option>
          </select></label
        >
        <label class="field"><span>Barva</span><input v-model="draft.color" type="color" /></label>
      </div>
      <fieldset>
        <legend>Koordinate</legend>
        <div class="three-columns">
          <label class="field"
            ><span>X</span
            ><input v-model.number="draft.position.x" type="number" step="0.1" /></label
          ><label class="field"
            ><span>Y</span
            ><input v-model.number="draft.position.y" type="number" step="0.1" min="0" /></label
          ><label class="field"
            ><span>Z</span><input v-model.number="draft.position.z" type="number" step="0.1"
          /></label>
        </div>
      </fieldset>
      <ErrorMessage v-if="errors.length" :message="errors.join(' ')" />
      <button class="button button--primary" type="submit">Dodaj objekt</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { validateNewObject } from '@/utils/objectValidation'
import type { NewSceneObject } from '@/types/sceneObject'
import { storeToRefs } from 'pinia';
import { useSceneObjectsStore } from '@/stores/sceneObjectsStore';

const sceneObjectsStore = useSceneObjectsStore();

const { objects } = storeToRefs(sceneObjectsStore);

const emit = defineEmits<{ add: [object: NewSceneObject] }>()
const errors = ref<string[]>([])
let draft = reactive<NewSceneObject>({
  name: '',
  type: 'box',
  color: '#22c55e',
  visible: true,
  position: { x: 0, y: 0.7, z: 0 },
})

let draftCopy: NewSceneObject = { ...draft, position: { ...draft.position } }

function submit(): void {
  errors.value = validateNewObject(draft)
  if(objects.value.some((item) => item.name == draft.name)) errors.value.push('Ime že obstaja.')

  if (errors.value.length) return
  emit('add', { ...draft })
  draft = { ...draftCopy}
}
</script>
