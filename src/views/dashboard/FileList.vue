<template>
  <div>
    <label>Fichiers</label>
    <template v-for='(file, index) in files' :key='index'>
      <div class='ml-4 rounded-lg bg-gray-100 p-2 my-2 flex items-center'>
        <template v-if='file.name'>
          <span class='text-gray-600 flex-1 bold'>
            <a v-if='file.url' :href='file.url' class='underline block overflow-hidden whitespace-nowrap text-ellipsis max-w-full'>
              <Icon icon='file_copy' />
              {{ file.name }}
            </a>
            <span v-else>
              <Icon icon='file_copy' />
              {{ file.name }}
            </span>
          </span>
        </template>
        <template v-else>
          <a :href='file.url' class='underline block overflow-hidden text-blue-400 whitespace-nowrap text-ellipsis flex-1'>
            <Icon icon='link' />
            {{ file.url }}
          </a>
        </template>
        <ActionIcon icon='delete' @click="$emit('files-removed',index)"/>
      </div>
    </template>
    <!--Drag'n'drop zone-->
    <div
      class='border-dashed border-2 border-primary w-full h-32 rounded-lg center mx-0.5 transition-colors'
      :class='dropzoneBackground'
      ref='dropzone'
      @dragenter="dragenter"
      @dragleave="dragleave"
      @drop="drop"
      @dragover.prevent
    >
      <Icon icon='cloud_upload' class='text-gray-600 mx-2'/>
      <p class='text-gray-600 italic mr-2'>
        Déposez des fichiers/liens dans cette zone ou
        <span class='text-primary underline cursor-pointer' @click='addFileOrLink'>cliquez ici</span>
      </p>
    </div>
  </div>
</template>

<script setup lang='ts'>
  import SmallTitle from '@/components/style/SmallTitle.vue'
  import Icon from '@/components/style/Icon.vue'
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
        text: 'L\'objet que vous avez déposé n\'est pas supporté.'
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
        input.accept = '*'
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
          }
        })
      },
    })
  }

</script>
