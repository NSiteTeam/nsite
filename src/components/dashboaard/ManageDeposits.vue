<script setup lang="ts">
    import { databaseClient } from "@/database/implementation";
import type { Repository } from "@/database/interface/repositories";
    import { ref } from "vue";

    const depositTableIsExpanded = ref(true)
    const deposits = ref()
    const selectedDeposit = ref()

    databaseClient.getOwnedDeposits().then(result => {
        deposits.value = result
        selectedDeposit.value = result[0]
    })

    function flipDepositListExpansion() {
        depositTableIsExpanded.value = !depositTableIsExpanded.value
    }

    function selectDeposit(deposit: Repository) {
        selectedDeposit.value = deposit
    }
</script>

<template>
    <div id="manage-deposit">
        <div id="deposit-list" :class="{ 'hidden': !depositTableIsExpanded }">
            <h3 id="deposit-list-title">Vos depôts de ressources</h3>
            <span
                v-on:click='flipDepositListExpansion()'
                id="deposit-list-menu-icon"
                class="material-icons white"
                :class="{ 'horizontal-symmetry': depositTableIsExpanded }"
            >
                arrow_forward_ios
            </span>
            <ul id='deposit-names'>
                <li
                    class='deposit-list-element'
                    v-for="deposit in deposits"
                    :key="deposit"
                    :class="{ 'selected': deposit == selectedDeposit }"
                    v-on:click='selectDeposit(deposit)'
                >
                    {{ deposit.title }}
                </li>
                <li class='deposit-list-element' id="add-deposit-button">
                    <span class="material-icons white">
                        add
                    </span>
                    <span>
                        Créer un nouveau dépôt
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    #manage-deposit {
        display: flex;
        flex-direction: row;

        #deposit-list {
            background-color: #38383d;

            padding: 16px;

            position: relative;

            width: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
            min-width: 20px;
            max-width: 100%;

            transition: max-width 0.4s ease-in-out;
            &.hidden {
                max-width: 20px;

                ul, h3 {
                    opacity: 0%;
                    transition: opacity 0.4s ease-in-out;
                }
            }

            #deposit-list-title {
                margin: 0;
                white-space: nowrap;
                width: max-content;
            }

            #deposit-list-menu-icon {
                position: absolute;
                right: 16px;
                top: 16px;

                transition: transform 0.4s ease-in-out;

                &.horizontal-symmetry {
                    transform: scale(-1, 1);
                }
            }

            #deposit-names {
                list-style: none;

                padding: 8px;

                .deposit-list-element {
                    border-radius: 8px;

                    width: 256px;
                    margin: 2px 0;
                    padding: 8px;

                    font-weight: 800;
                    color: #b1b1b9;

                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    span {
                        color: #b1b1b9;
                        margin: 0 4px;
                    }

                    &:hover {
                        background-color: #59595c;
                        color: white;

                        span {
                            color: white;
                        }
                    }

                    &.selected {
                        background-color: #6b6b6f;
                        color: white;
                    }

                    @media (max-width: 384px) {
                        width: calc(100vw - 128px); // To fill remaining screen width
                    }
                }

                #add-deposit-button {
                    display: flex;
                    justify-content: center;
                }
            }
        }
    }
</style>