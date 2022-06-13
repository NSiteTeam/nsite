<script setup lang="ts">
import { watch, ref, toRaw, onMounted, computed, shallowRef } from "vue";
import type { Ref } from "vue";
// @ts-ignore
import DataColumn from "@/components/dashboard/DataColumn.vue";
import type { DataSection } from "@/utils/data_section";
import type { Repository } from "@/database/interface/repositories";

const deposits: Ref<DataSection<Repository>[]> = shallowRef([]);

function admin() {
  alert("Cet utilisateur à été mute par l'administrateur Raphaël");
}

function quote() {
  alert(
    'Cet utilisateur a été mute pour propos haineux : "Je suis fier de mon nouvel iphone à 3 smics" '
  );
}

function modify() {
  alert(
    "Cette option n'est pas encore présente sur le site (inutile de crier)"
  );
}

function suppr() {
  alert(
    "Cette option n'est pas encore présente sur le site (inutile de crier)"
  );
}
</script>

<template>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  />

  <div class="files">
    <div class="users">
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
      <div class="user">
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>
        <div class="actions">
          <div class="admin">
            <button @click="admin()">
              <span class="material-symbols-outlined"
                >admin_panel_settings</span
              >
            </button>
          </div>
          <div class="quote">
            <button @click="quote()">
              <span class="material-symbols-outlined">format_quote</span>
            </button>
          </div>
          <div class="modify">
            <button @click="modify()">
              <span class="material-icons pen">edit</span>
            </button>
          </div>
          <div class="suppr">
            <button @click="suppr()">
              <span class="material-icons bin">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="user">
                
        <p># 1df7eda6-5122-4ce5-a818-dddab0d28403</p>

        <div class="actions">
            <div class="admin">
                <button @click="admin()" ><span class="material-symbols-outlined">admin_panel_settings</span></button>
            </div>
            <div class="quote">
                <button @click="quote()" ><span class="material-symbols-outlined">format_quote</span></button>
            </div>
            <div class="modify">
                <button @click="modify()" ><span class="material-icons pen">edit</span></button>
            </div>
            <div class="suppr">
                <button @click="suppr()" ><span class="material-icons bin">delete_forever</span></button>
            </div>
        </div>   


    </div> -->
</template>
