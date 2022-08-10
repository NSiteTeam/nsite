<template>
  <div class="fixed bottom-0 right-0 w-full sm:w-min z-40">
    <template v-for='(message, index) in messages' :key='index'>
      <div
        class="
          animate-pop-out origin-bottom-right
          relative overflow-clip text-lg
          rounded-md w-[90vw] bg-white shadow-2xl border-2 border-gray-100
          mx-auto sm:mx-0 sm:mr-4 my-4 sm:w-80 md:w-96
        "
        role="alert"
      >
        <div
          class='flex p-4 bg-gradient-to-r via-transparent items-center'
          :class='{
            "from-blue-500/20": message.type == MessageType.INFO,
            "from-green-500/20": message.type == MessageType.SUCCESS,
            "from-orange-500/20": message.type == MessageType.WARNING,
            "from-red-500/20  ": message.type == MessageType.ERROR,
          }'
        >
          <span
            class='material-icons text-3xl mr-3'
            :class='{
              "text-blue-700": message.type == MessageType.INFO,
              "text-green-700": message.type == MessageType.SUCCESS,
              "text-orange-700": message.type == MessageType.WARNING,
              "text-red-700": message.type == MessageType.ERROR
            }'
          >
            {{ iconForMessageType(message.type) }}
          </span>
          <div>
            <p
              class="font-bold text-xl"
              :class='{
                "text-blue-700": message.type == MessageType.INFO,
                "text-green-700": message.type == MessageType.SUCCESS,
                "text-orange-700": message.type == MessageType.WARNING,
                "text-red-700": message.type == MessageType.ERROR,
              }'
            >
              {{ message.type }}
            </p>
            <p>{{ message.text }}</p>
          </div>
        </div>
        <CloseButton :side='Side.TOP_RIGHT' @click='closeMessage(index)' />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  /**
   * TODO: 1. Animation when the message go away
   *       2. Split this component into two: one for the messages and one for the
   *          stack.
   *       2. When a message is displayed below another, make the up move animated
   * Maybe should we handle the timeout here in the view ? (solve 1.)
   */

  import { MessageStack, MessageType } from '@/views/messages/message_stack'
  import { Side } from '@/utils/sides'
  import CloseButton from '@/components/style/CloseButton.vue'

  const messageStack = MessageStack.getInstance()
  const messages = messageStack.getMessages()

  function iconForMessageType(type: MessageType) {
    switch (type) {
      case MessageType.INFO:
        return 'info'
      case MessageType.SUCCESS:
        return 'check_circle'
      case MessageType.WARNING:
        return 'warning'
      case MessageType.ERROR:
        return 'error'
    }
  }

  function closeMessage(index: number) {
    messageStack.closeMessageAt(index)
  }

</script>
