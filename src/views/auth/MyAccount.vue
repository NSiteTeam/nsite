<script setup lang="ts">
import ActionButton from '@/components/style/ActionButton.vue'
import BarSeparator from '@/components/style/BarSeparator.vue'
import Icon from '@/components/style/Icon.vue'
import LargeTitle from '@/components/style/LargeTitle.vue'
import { databaseClient } from '@/database/implementation'
import { supabase } from '@/database/supabase/supabase_client'
import { ref } from 'vue'
import { pushError, pushSuccess } from '../messages/message_stack'
import { PopupManager } from '../popup/popup_manager'

const email = ref('')
email.value = await databaseClient.getOwnEmail()

async function promptPopupEmail() {
    PopupManager.getInstance().prompt({
        title: 'Choisissez votre nouvelle adresse email',
        message: "N'hésitez surtout pas à la changer si vous la pensez compromise",
        default: email.value,
        placeholder: 'Entrez votre nouvelle adresse email',
        okMessage: 'Valider',
        cancelMessage: 'Annuler',
        onConfirm: async (newEmail: string) => {
            if (await databaseClient.changeEmail(newEmail)) {
                pushSuccess(`Vous avez reçu un email de confirmation sur les deux adresses mails afin de vérifier si l'adresse et valide et si il s'agit bien de vous.`)
                email.value = await databaseClient.getOwnEmail()
            } else {
                pushError("Quelque chose s'est mal passé")
            }
        },
        computeError: (error: string) => '',
    })
}

async function promptPopupPassword() {
    PopupManager.getInstance().prompt({
        title: 'Choisissez votre nouvelle adresse email',
        message: "N'hésitez surtout pas à le changer si vous le pensez compromis",
        default: email.value,
        placeholder: 'Entrez votre nouveaux mot de passe',
        okMessage: 'Valider',
        cancelMessage: 'Annuler',
        onConfirm: async (newEmail: string) => {
            if (await databaseClient.changeEmail(newEmail)) {
                pushSuccess(`Vous avez reçu un email de confirmation sur les deux adresses mails afin de vérifier si l'adresse et valide et si il s'agit bien de vous.`)
                email.value = await databaseClient.getOwnEmail()
            } else {
                pushError("Quelque chose s'est mal passé")
            }
        },
        computeError: (error: string) => '',
    })
}
</script>

<template>
    <div class="m-2">
        <LargeTitle primary>Mon compte</LargeTitle>
        <div class="my-4">
            <span class="bold text-primary">Mon adresse email: </span>
            <span class="italic">{{ email }}</span>
        </div>
        <BarSeparator />
        <div class="flex flex-col w-[40%] my-4">
            <div class="bold text-primary flex align-items">
                <Icon icon="info" /> Changer ses informations personnelles
            </div>
            <div class="my-2 flex flex-row justify-between">
                <ActionButton primary-border @click="promptPopupEmail">Changer mon adresse email</ActionButton>
                <ActionButton primary-border @click="promptPopupPassword">Changer mon mot de passe</ActionButton>
            </div>
            <div class="my-2">
                <div class="bold text-danger flex align-items">
                    <Icon icon="warning" /> Zone dangeureuse !
                </div>
                <ActionButton danger>Supprimer mon compte</ActionButton>
            </div>
        </div>
    </div>
</template>
