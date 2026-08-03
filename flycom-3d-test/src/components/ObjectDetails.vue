<template>
  <section class="panel">
    <div class="panel-heading">
      <div>
        <span class="eyebrow">LASTNOSTI</span>
        <h2>Izbrani objekt</h2>
      </div>
    </div>
    <form v-if="object" class="stack" @submit.prevent="submit">
      <label class="field"><span>Ime</span><input v-model.trim="draft.name" type="text"  @click.capture="hasChanged" /></label>
      <div class="two-columns">
        <label class="field"><span>Tip</span><input :value="object.type" :disabled="!changed" @click.capture="hasChanged"/></label>
        <label class="field"><span>Barva</span><input v-model="draft.color" type="color" @click.capture="hasChanged"/></label>
      </div>
      <label class="checkbox-field"
        ><input v-model="draft.visible" type="checkbox" @click.capture="hasChanged"/><span
          >Objekt je viden v 3D-pogledu</span
        ></label
      >
      <div class="coordinates">
        <span>Lokacija</span><code>{{ formatPosition(object.position) }}</code>
      </div>
      <button class="button button--primary" type="submit" :disabled="!changed">Shrani spremembe</button>
      <p class="todo-note">
        Urejanje je del naloge. Obrazec je pripravljen, povezava s shranjevanjem pa še ne.
      </p>
    </form>
    <div v-else class="empty-state details-empty">
      <span class="empty-icon">◇</span>
      <p>Izberi objekt v seznamu ali neposredno v 3D-pogledu.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { SceneObjectData, SceneObjectPatch, Vector3Data } from '@/types/sceneObject'

const props = defineProps<{ object: SceneObjectData | null }>()
const emit = defineEmits<{  change: [], save: [id: string, patch: SceneObjectPatch],  }>()
const draft = reactive({ name: '', color: '#ffffff', visible: true })
let changed: boolean = false

watch(
  () => props.object,
  (object) => {
    if (object)
      Object.assign(draft, { name: object.name, color: object.color, visible: object.visible })
  },
  { immediate: true },
)

function hasChanged(): void {
  changed = true
}
const formatPosition = ({ x, y, z }: Vector3Data) =>
  `X ${x.toFixed(1)}  Y ${y.toFixed(1)}  Z ${z.toFixed(1)}`
function submit(): void {
  if (props.object) emit('save', props.object.id, { ...draft })
}
</script>
