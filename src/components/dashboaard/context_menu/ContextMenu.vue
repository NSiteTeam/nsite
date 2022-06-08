<template>
    <div :class='{ hidden: !menuShown }' ref='menuContainer' class="context-menu-container">
        <slot />
    </div>
</template>

<script lang='ts' setup>
    import { ref, onMounted, watch } from 'vue'
    import type { Ref } from 'vue'

    const menuContainer: Ref<HTMLElement | null> = ref(null)
    const menuShown = ref(true)

    watch(menuContainer, (container: HTMLElement) => {
        if (container == null) {
            return
        }

        console.log(container.parentElement)

        container.parentElement?.addEventListener('contextmenu', onContextMenu)
        document.addEventListener('click', () => menuShown.value = false)
    })

    function onContextMenu(event: MouseEvent) {
        event.preventDefault()

        menuShown.value = true

        let { clientX: menuX, clientY: menuY } = event

        const parentRect = menuContainer.value?.parentElement?.getBoundingClientRect()!
        const menuRect = menuContainer.value?.getBoundingClientRect()!

        if (menuX + menuRect.width > parentRect.right) {
            menuX = parentRect.right - menuRect.width
        }

        if (menuY + menuRect.height > parentRect.bottom) {
            menuY = parentRect.bottom - menuRect.height
        }

        menuContainer.value!.style.left = menuX + 'px'
        menuContainer.value!.style.top = menuY + 'px'
    }

</script>
