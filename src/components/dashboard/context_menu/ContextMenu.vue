<template>
    <div ref='menuContainer' class="context-menu-container">
        <slot />
    </div>
</template>

<script lang='ts' setup>
    /**
     * We can't use :class and a ref to handle visibility of the menu because its to slow
     */

    import { ref, onMounted, watch } from 'vue'
    import type { Ref } from 'vue'

    const menuContainer: Ref<HTMLElement | null> = ref(null)

    const props = defineProps(['scope'])

    watch(menuContainer, (container: HTMLElement) => {
        if (container == null) {
            return
        }

        document.addEventListener('contextmenu', onContextMenu)
        document.addEventListener('click', () => menuContainer.value?.classList.remove('visible'))
    })

    function onContextMenu(event: MouseEvent) {
        const parentRect =  menuContainer.value?.parentElement?.getBoundingClientRect()!
        const scopeRect = props['scope'] ? document.querySelector(props['scope']).getBoundingClientRect() : parentRect

        let { clientX: menuX, clientY: menuY } = event

        if (!parentRect || menuX < parentRect.left || menuX > parentRect.right || menuY < parentRect.top || menuY > parentRect.bottom) {
            menuContainer.value?.classList.remove('visible')
            return
        }

        event.preventDefault()
        menuContainer.value?.classList.remove('visible')
        setTimeout(() => menuContainer.value?.classList.add('visible'))

        const menu = menuContainer.value
        if (menuX + menu?.clientWidth! > scopeRect.right) {
            if (scopeRect.right - menu?.clientWidth! >= scopeRect.left) {
                menuX = scopeRect.right - menu?.clientWidth!
            }
        }

        if (menuY + menu?.clientHeight! > scopeRect.bottom) {
            if (scopeRect.bottom - menu?.clientHeight! >= scopeRect.top) {
                menuY = scopeRect.bottom - menu?.clientHeight!
            }
        }

        menuContainer.value!.style.left = menuX + 'px'
        menuContainer.value!.style.top = menuY + 'px'
    }

</script>
