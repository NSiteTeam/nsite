<script lang="ts" setup>
import { computed, ref } from "vue"
// @ts-ignore Vue bug
import UploadFile from "@/components/dashboard/add/UploadFile.vue"
// @ts-ignore Vue bug
import AddDeposit from "@/components/dashboard/add/AddDeposit.vue"
// @ts-ignore Vue bug
import AddNews from "@/components/dashboard/add/AddNews.vue"
// @ts-ignore Vue bug
import AccesBlacklist from "@/components/dashboard/add/AccesBlacklist.vue"
// @ts-ignore Vue bug
import AddHistoryPoint from "@/components/dashboard/add/AddHistoryPoint.vue"
// @ts-ignore Vue bug
import EditNews from "@/components/dashboard/edit/EditNews.vue"
// @ts-ignore Vue bug
import EditDeposit from "@/components/dashboard/edit/EditDeposit.vue"
import { databaseClient } from "@/database/implementation"
import type { Ref } from "vue"
import type { Repository } from "@/database/interface/repositories"
import { useRoute } from "vue-router"
import { getParameterOfRoute } from "@/utils/route_utils"
import { Permission } from "@/database/interface/permissions"
import ManageDeposits from "@/components/dashboaard/ManageDeposits.vue"

const availableViewsForUser= computed(
    () => {
        const result: View[] = []
        const permissions = databaseClient.user.value?.permissions

        if (permissions == null) {
            return result
        }

        for (let permission of permissions) {
            switch (permission) {
                case Permission.TEACHER:
                    result.push(View.DEPOSITS)
                    result.push(View.BLACKLIST)
                    break
                case Permission.HISTORY_ADMIN:
                    result.push(View.HISTORY)
                    break
                case Permission.NEWS_ADMIN:
                    result.push(View.NEWS)
                    break
                case Permission.LEVEL_ADMIN:
                    result.push(View.THEMES)
                    break
                case Permission.GLOBAL_ADMIN:
                    result.push(View.TEACHERS)
                    result.push(View.USERS)
                    break
            }
        }

        return result
    }
)

const noViewsAvailable = computed(
    () => View.viewFromName(getParameterOfRoute(useRoute().params.view)) != null
)

const component = computed(
    () => {
        const viewName = getParameterOfRoute(useRoute().params.view)
        const view = View.viewFromName(viewName)

        if (view == null) {
            if (availableViewsForUser.value.length > 0) {
                return availableViewsForUser.value[0].component
            } else {
                // "noViewsAvailable" is true
                return ""
            }
        }

        return view.component
    }
)
class View {
    name: string  // Name of the material design icon
    nameInURL: string
    icon: string
    component: any

    private constructor (name: string, nameInURL: string, icon: string, component: any) {
        this.name = name
        this.nameInURL = nameInURL
        this.icon = icon
        this.component = component
    }

    static viewFromName(name: string) {
        for (let view of [this.DEPOSITS, this.NEWS, this.HISTORY, this.TEACHERS, this.USERS, this.BLACKLIST]) {
            if (view.nameInURL == name) {
                return view
            }
        }

        return null
    }

    static DEPOSITS = new View('Depôts de ressources', 'deposits', 'folder', ManageDeposits)
    static NEWS = new View('Actualités', 'news', 'newspaper', ManageDeposits)
    static HISTORY = new View('Points d\'histoire', 'historypoints', 'calendar_month', ManageDeposits)
    static THEMES = new View('Thèmes de l\'année', 'themes', 'subject', ManageDeposits)
    static TEACHERS = new View('Enseignants', 'teachers', 'school', ManageDeposits)
    static USERS = new View('Utilisateurs', 'users', 'manage_accounts', ManageDeposits)
    static BLACKLIST = new View('Liste noire', 'blacklist', 'receipt_long', ManageDeposits)
}

</script>

<template>
    <div id='dashboard-container'>
        <nav id='dashboard-navbar'>
            <RouterLink v-for='view in availableViewsForUser' :key="view.name" :to="'/dashboard/' + view.nameInURL">
                <div id='menu-box'>
                    <span id='menu-icon' class="material-icons">
                        {{ view.icon }}
                    </span>
                    <span id='menu-tooltip'>
                        {{ view.name }}
                    </span>
                </div>
            </RouterLink>
        </nav>

        <component :is='component'/>
    </div>
</template>

<style lang="scss" scoped>
    @import "@/style/index.scss";

    #dashboard-container {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        height: calc(100vh - $header-height);

        #dashboard-navbar {
            background-color: #12151c;

            height: 100%;

            #menu-box {
                border-radius: 12px;

                width: 48px;
                height: 48px;

                margin: 8px;

                display: grid;
                place-content: center;

                transition: background-color 0.3s linear;
                &:hover {
                    background-color: #5a6c99;

                    #menu-icon {
                        color: white;
                    }

                    #menu-tooltip {
                        display: inline;
                    }
                }

                #menu-icon {
                    transition: color 0.3 linear;
                    color: #9c9ba0;
                }

                #menu-tooltip {
                    display: none;

                    position: absolute;
                    left: 72px;
                    z-index: 40;

                    margin-top: 4px; // Arbitrary value to try to center the tooltip

                    width: max-content;

                    background-color: #161616;
                    border-radius: 6px;

                    padding: 10px 12px;
                }
            }
        }
    }
</style>
