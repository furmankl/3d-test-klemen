<template>
  <section class="panel object-list-panel">
    <div class="panel-heading">
      <div>
        <span class="eyebrow">SCENA</span>
        <h2>Objekti</h2>
      </div>
      <span class="count">{{ objects.length }}</span>
    </div>
    <label class="field compact-field">
      <span>Filtriraj po tipu</span>
      <select :value="filter" @change="onFilterChange">
        <option value="all">Vsi tipi</option>
        <option value="box">Kvader</option>
        <option value="sphere">Krogla</option>
        <option value="cylinder">Valj</option>
      </select>
    </label>
    <ul class="object-list">
      <li v-for="object in objects" :key="object.name">
        <button
          type="button"
          class="object-row"
          :class="{ 'object-row--selected': object.id === selectedId }"
          @click="handleSelect(object.id)"
        >
          <span class="swatch" :style="{ backgroundColor: object.color }" />
          <span class="object-copy"
            ><strong>{{ object.name }}</strong
            ><small>{{ typeLabel(object.type) }}</small></span
          >
          <span
            :class="['visibility-icon', { 'visibility-icon--off': !object.visible }]"
            :title="object.visible ? 'Viden' : 'Skrit'"
            >●</span
          >
        </button>
      </li>
    </ul>
    <p v-if="!objects.length" class="empty-state">Za izbrani filter ni objektov.</p>
  </section>
</template>

<script setup lang="ts">
import type { ObjectTypeFilter, SceneObjectData, SceneObjectType } from '@/types/sceneObject'

defineProps<{ objects: SceneObjectData[]; selectedId: string | null; filter: ObjectTypeFilter }>()
const emit = defineEmits<{ select: [id: string]; 'update:filter': [filter: ObjectTypeFilter] }>()

const labels: Record<SceneObjectType, string> = {
  box: 'Kvader',
  sphere: 'Krogla',
  cylinder: 'Valj',
}
const typeLabel = (type: SceneObjectType) => labels[type]

function handleSelect(id: string): void {
  // TODO(candidate): synchronize list selection with the store and 3D view.
  void id
  void emit
}

function onFilterChange(event: Event): void {
  emit('update:filter', (event.target as HTMLSelectElement).value as ObjectTypeFilter)
}
</script>
