<script setup lang="ts">
    import { computed, ref } from "vue"
    import type { Ref } from "vue"

    const emit = defineEmits(['deletion', 'close'])
    const { title, content, messageToType, actionName } = defineProps(
        ['title', 'content', 'messageToType', 'actionName']
    )

    const typedMessage: Ref<string> = ref("")
    const allowSubmit = computed(() => typedMessage.value == messageToType)

    function submit() {
        if (window.confirm("Etes-vous sûr de vous ? Cette action est irréversible !"))
        emit('deletion')
    }

</script>

<template>
    <div class="danger-popup">
        <h3><span class="material-icons" @click="emit('close')">close</span>{{ title }}</h3>
        <p>{{ content }}</p>
        <div class="danger-popup-message-to-type">
            Tappez 
            <span class="danger-popup-message-to-type-highlight">
                {{ messageToType }}
            </span>
        </div>
        <input class="danger-popup-typed-message"
        v-model="typedMessage" placeholder="Tappez le message indiqué" />
        <div class="danger-popup-container">
            <button @click="submit()" class="danger-popup-confirm" :class="allowSubmit ? 'mega-danger' : ''">
                {{ actionName }}
            </button>
        </div>
    </div>
</template>
