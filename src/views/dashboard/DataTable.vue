<template>
  <div class='w-full'>
    <ActionButton class='mb-4' primary small @click='$emit("createNew")'>
      <Icon icon='add' />
      {{ createNewMessage }}
    </ActionButton>
    <div class='rounded-md overflow-hidden border-2 border-gray-200 w-full min-w-min'>
      <table class='w-full'>
        <tr class='bg-gray-100 border-b-2 border-gray-200'>
          <th
            v-for='name in columnNames'
            :key='name'
            class='text-left px-2 py-2'
          >
            {{ name }}
          </th>
          <th></th>
        </tr>
        <tr
          v-for='(row, rowIndex) in data'
          :key='rowIndex'
          class='border-t-2'
        >
          <td
            v-for='(id, columnIndex) in columnIds'
            :key='columnIndex'
            class='max-w-xs px-2 py-1'
          >
            <template v-if='arrays[columnIndex]'>
              <ul v-if='row[id].length'>
                <template v-for="(value, valueIndex) in row[id]" :key='valueIndex'>
                  <li>
                    <DataTableElement :type='types[columnIndex]' :value='value' />
                  </li>
                </template>
              </ul>

              <span v-else class="text-gray-600 italic">Aucun contenu</span>

            </template>
            <template v-else>
              <DataTableElement :type='types[columnIndex]' :value='row[id]' />
            </template>
          </td>
          <td class='max-w-min flex'>
            <ActionIcon class='px-2' icon='edit' xl @click='editAt(rowIndex)' :disabled='updatingStates[rowIndex]' />
            <ActionIcon class='px-2' :icon='row.visible ? "visibility" : "visibility_off"' xl @click='toggleVisibilityAt(rowIndex)' :disabled='updatingStates[rowIndex]' />
            <ActionIcon class='px-2' icon='delete' xl @click='deleteAt(rowIndex)' :disabled='updatingStates[rowIndex]' />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup lang='ts'>
  import DataTableElement from './DataTableElement.vue'
  import Icon from '@/components/style/Icon.vue'
  import ActionIcon from '@/components/style/ActionIcon.vue'
  import ActionButton from '@/components/style/ActionButton.vue'
  import { computed } from "@vue/runtime-core"

  const props = defineProps({
    'columns': {
      type: Array,
      required: true,
    },
    'types': {
      type: Array
    },
    'data': {
      type: Array,
      required: true,
    },
    'createNewMessage': {
      type: String,
      required: true,
    },
    'updatingStates': {
      type: Array,
      required: true,
    }
  })
  const emit = defineEmits(['createNew', 'edit', 'toggle', 'delete'])

  const columnNames = computed(() => props.columns.map(column => (column as Array<String>)[0]))
  const columnIds = computed(() => props.columns.map(column => (column as Array<String>)[1]))

  const arrays = computed(() => props.types?.map((type: any) => type.trimEnd().endsWith('[]')))
  const types = computed(() => props.types?.map((type: any) => type.trimEnd().replace('[]', '')))

  function editAt(rowIndex: number) {
    emit('edit', rowIndex)
  }

  function toggleVisibilityAt(rowIndex: number) {
    emit('toggle', rowIndex)
  }

  function deleteAt(rowIndex: number) {
    emit('delete', rowIndex)
  }
</script>
