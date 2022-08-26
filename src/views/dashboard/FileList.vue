<template>
  <div>
    <label>Fichiers</label>
    <template v-for="(file, index) in files" :key="index">
      <div class="my-2 ml-4 flex items-center rounded-lg bg-gray-100 p-2">
        <template v-if="file.name">
          <span class="bold flex-1 text-gray-600">
            <a
              v-if="file.url"
              :href="file.url"
              class="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap underline"
            >
              <Icon icon="file_copy" />
              {{ file.name }}
            </a>
            <span v-else>
              <Icon icon="file_copy" />
              {{ file.name }}
            </span>
          </span>
        </template>
        <template v-else>
          <a
            :href="file.url"
            class="block flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-blue-400 underline"
          >
            <Icon icon="link" />
            {{ file.url }}
          </a>
        </template>
        <ActionIcon icon="delete" @click="$emit('files-removed', index)" />
      </div>
    </template>
    <!--Drag'n'drop zone-->
    <div
      class="center mx-0.5 h-32 w-full rounded-lg border-2 border-dashed border-primary transition-colors"
      :class="dropzoneBackground"
      ref="dropzone"
      @dragenter="dragenter"
      @dragleave="dragleave"
      @drop="drop"
      @dragover.prevent
    >
      <Icon icon="cloud_upload" class="mx-2 text-gray-600" />
      <p class="mr-2 italic text-gray-600">
        Déposez des fichiers/liens dans cette zone ou
        <span
          class="cursor-pointer text-primary underline"
          @click="addFileOrLink"
          >cliquez ici</span
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import SmallTitle from '@/components/style/SmallTitle.vue'
// @ts-ignore
import Icon from '@/components/style/Icon.vue'
// @ts-ignore
import ActionIcon from '@/components/style/ActionIcon.vue'
import { onMounted, ref } from 'vue'
import { MessageStack, MessageType } from '../messages/message_stack'
import { PopupManager } from '../popup/popup_manager'
import { isURL } from '@/utils/isUrl'

const props = defineProps({
  files: {
    type: Array,
    default: [],
  },
  image: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['files-added', 'url-added', 'files-removed'])

const dropzone = ref<HTMLElement>()
const dropzoneBackground = ref<string>('bg-primary/5')

function dragenter(event: DragEvent) {
  dropzoneBackground.value = 'bg-primary/20'
}

function dragleave(event: DragEvent) {
  dropzoneBackground.value = 'bg-primary/5'
}

function drop(event: DragEvent) {
  event.preventDefault()

  dropzoneBackground.value = 'bg-primary/5'

  const droppedFiles = event.dataTransfer?.files
  if (droppedFiles) {
    emit('files-added', droppedFiles)
  }

  const droppedURL = event.dataTransfer?.getData('url')
  if (droppedURL) {
    emit('url-added', droppedURL)
  }

  const droppedText = event.dataTransfer?.getData('text')
  let droppedTextIsURL = false
  if (droppedText && isURL(droppedText) && droppedURL !== droppedText) {
    droppedTextIsURL = true
    emit('url-added', droppedText)
  }

  if (droppedFiles?.length == 0 && !droppedURL && !droppedTextIsURL) {
    MessageStack.getInstance().push({
      type: MessageType.WARNING,
      text: "L'objet que vous avez déposé n'est pas supporté.",
    })
  }
}

function addFileOrLink() {
  PopupManager.getInstance().choose({
    title: 'Nouveau document',
    message: 'Souaitez-vous ajouter un fichier ou un lien ?',
    firstChoice: 'Fichier',
    secondChoice: 'Lien',
    firstCallback: () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = props.image ? 'image/*' : '*'
      input.multiple = true
      input.onchange = (event: Event) => {
        const files = (event.target as HTMLInputElement).files
        if (files) {
          emit('files-added', files)
        }
      }
      input.click()
    },
    secondCallback: () => {
      PopupManager.getInstance().prompt({
        title: 'Lien',
        message: 'Entrez le lien que vous souhaitez ajouter.',
        onConfirm: (url: string) => {
          if (url) {
            emit('url-added', url)
          }
        },
        placeholder: 'https://www.maths-et-tiques.fr/',
        default: '',
        okMessage: 'Ajouter',
        cancelMessage: 'Annuler',
        computeError: (value: string) => {
          return !value || isURL(value) ? '' : 'Une url est requise'
        },
      })
    },
  })
}
</script>
