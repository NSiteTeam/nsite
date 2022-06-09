<template>
    <div :class='{ hidden: !menuShown }' ref='menuContainer' class="context-menu-container">
        <slot />
    </div>
</template>

<script lang='ts' setup>
    import { ref, onMounted, watch } from 'vue'
    import type { Ref } from 'vue'

    const menuContainer: Ref<HTMLElement | null> = ref(null)
    const menuShown = ref(false)

    watch(menuContainer, (container: HTMLElement) => {
        if (container == null) {
            return
        }

        document.addEventListener('contextmenu', onContextMenu)
        document.addEventListener('click', () => menuShown.value = false)
    })

    function onContextMenu(event: MouseEvent) {
        const parentRect = menuContainer.value?.parentElement?.getBoundingClientRect()!
        let { clientX: menuX, clientY: menuY } = event

        if (!parentRect || menuX < parentRect.left || menuX > parentRect.right || menuY < parentRect.top || menuY > parentRect.bottom) {
            menuShown.value = false
            return
        }

        event.preventDefault()
        menuShown.value = true


        const menuRect = menuContainer.value?.getBoundingClientRect()!

        if (menuX + menuRect.width > parentRect.right) {
            if (parentRect.right - menuRect.width >= parentRect.left) {
                menuX = parentRect.right - menuRect.width
            }
        }

        if (menuY + menuRect.height > parentRect.bottom) {
            if (parentRect.bottom - menuRect.height >= parentRect.top) {
                menuY = parentRect.bottom - menuRect.height
            }
        }

        menuContainer.value!.style.left = menuX + 'px'
        menuContainer.value!.style.top = menuY + 'px'
    }

</script>
