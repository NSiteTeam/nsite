<template>
    <div id="data-list" :class="{ 'hidden': !dataTableIsExpanded }">
        <h3 id="data-list-title">{{ props['title'] }}</h3>
        <span
            v-on:click='flipDataListExpansion()'
            id="data-list-menu-icon"
            class="material-icons white"
            :class="{ 'horizontal-symmetry': dataTableIsExpanded }"
        >
            arrow_forward_ios
        </span>
        <ul id='data-names'>
            <template
                class='data-list-element'
                v-for="data in props['list']"
                :key="data"
            >
                <!-- If it's a data section -->
                <ul class='data-section' v-if='isDataSection(data)'>
                    <li class='section-title'>{{ data.name }}</li>
                    <li
                        v-for="element in data.values"
                        :key="element"
                        class = 'data-element-of-section'
                        :class="{ 'selected': selectedData && props['toKey'](element) == props['toKey'](selectedData) }"
                        @click="selectData(element)"
                    >
                        <slot :data='element' :text='toText(element)'> {{ toText(element) }} </slot>
                    </li>
                </ul>
                <!-- If it's a simple element -->
                <li
                    v-else
                    class='simple-data-element'
                    :class="{ 'selected': selectedData && props['toKey'](data) == props['toKey'](selectedData) }"
                    @click="selectData(data)"
                >
                    <slot :data='data' :text='toText(data)'> {{ toText(data) }} </slot>
                </li>
            </template>
            <li @click="createData" class='data-list-element' id="add-data-button">
                <span class="material-icons white">
                    add
                </span>
                <span>
                    {{ props['addButtonMessage'] }}
                </span>
            </li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
    import { DataSection } from '@/utils/data_section';
    import { ref, watch } from 'vue';

    const props = defineProps(['title', 'list', 'add-button-message','to-text', 'to-key'])

    const toText = props['toText']

    const emit = defineEmits(['selectData', 'createData'])

    const dataTableIsExpanded = ref(true)
    const selectedData = ref(null)

    function flipDataListExpansion() {
        dataTableIsExpanded.value = !dataTableIsExpanded.value
    }

    function selectData(data: any) {
        selectedData.value = data
        emit('selectData', data)
    }

    function createData() {
        emit('createData')
    }

    function isDataSection(data: any) {
        return data instanceof DataSection
    }

    // We select a default element
    for (const data of props['list']) {
        if (isDataSection(data)) {
            if (data.values.length > 0) {
                selectData(data.values[0])
                break
            }
        } else {
            selectData(data)
            break
        }
    }
</script>
