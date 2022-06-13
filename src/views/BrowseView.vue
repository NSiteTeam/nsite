<script setup lang="ts">
import { databaseClient } from "@/database/implementation";
import { computed, ref } from "vue";
import type { Ref } from "vue";
import type { Repository } from "@/database/interface/repositories";
import Card from "@/components/Card.vue";
import LoadingAnimation from "@/components/LoadingAnimation.vue";
import { useRoute, useRouter } from "vue-router";
import { LongDate } from "@/utils/long_date";
import { Level } from "@/database/interface/level";
import { getParameterOfRoute } from "@/utils/route_utils";

const router = useRouter();

enum Sort {
  PUBLICATION_DATE = "Par date",
  ALPHABETICAL = "Alphabétique",
}

const deposits: Ref<Array<Repository>> = ref([]);

const loading = ref(true);
databaseClient.getDeposits().then((result) => {
  deposits.value = result;
  loading.value = false;
});

const reversed = ref(false);
const sort = ref(Sort.PUBLICATION_DATE);
const selectedLevel: Ref<Level | null> = ref(
  Level.levelFromNameInURL(getParameterOfRoute(useRoute().params.level))
);
const searchbarContent: Ref<string> = ref("");

function changeOrder() {
  reversed.value = !reversed.value;
}

function changeSort(newKey: Sort) {
  console.log(sort.value, newKey);
  sort.value = newKey;
}

function selectLevel(newLevel: Level) {
  console.log("Selected level", newLevel);
  selectedLevel.value = newLevel;
}

function toggleSB() {
  if (searchbarContent.value == "sebastien patoche") {
    window.location.href =
      "https://www.youtube.com/watch?v=jw5d_W-JPP4#t=1m26s";
  } else if (searchbarContent.value == "jjba") {
    window.location.href = "https://youtu.be/AQx_KMoCgJU";
  } else if (searchbarContent.value == "piou") {
    window.location.href = "https://www.youtube.com/watch?v=u3dmwXDL-90";
  } else if (searchbarContent.value == "thune") {
    window.location.href = "https://www.youtube.com/watch?v=aIVsz5Pj0eE";
  } else if (searchbarContent.value == "sylvain") {
    window.location.href = "https://www.youtube.com/watch?v=rFycMFHuZKQ";
  } else if (searchbarContent.value == "asterix") {
    window.location.href =
      "https://www.youtube.com/watch?v=BT5MAtVK474#t=0m14s";
  } else if (searchbarContent.value == "car") {
    window.location.href = "https://www.youtube.com/watch?v=Yd_U0cvT4sI";
  } else if (searchbarContent.value == "malou") {
    window.location.href = "https://youtu.be/Y9tFBc1yU9E";
  } else if (searchbarContent.value == "dio") {
    window.location.href = "https://youtu.be/i5inOAXURVw";
  } else if (searchbarContent.value == "rickroll") {
    window.location.href = "https://youtu.be/dQw4w9WgXcQ";
  } else if (searchbarContent.value == "jojo") {
    window.location.href = "https://www.youtube.com/watch?v=bHboqSB06X4";
  }
}

const output = computed(() => {
  const reverseCoef = reversed.value ? -1 : 1;

  let selectedData = [];
  // If a level is selected, filter deposits
  if (selectedLevel.value != null) {
    selectedData = deposits.value.filter(
      (deposit) => deposit.level == selectedLevel.value
    );
  } else {
    selectedData = deposits.value;
  }

  selectedData = selectedData.filter((deposit) =>
    deposit.title.includes(searchbarContent.value)
  );

  switch (sort.value) {
    case Sort.ALPHABETICAL:
      return selectedData.sort(
        (a, b) => reverseCoef * a.title.localeCompare(b.title)
      );
    case Sort.PUBLICATION_DATE:
      return selectedData.sort(
        (a, b) =>
          reverseCoef *
          LongDate.compare(
            LongDate.ISOStringToLongDate(a.publication_date),
            LongDate.ISOStringToLongDate(b.publication_date)
          )
      );
    default:
      throw Error("Unknown sort");
  }
});

const levels = computed(() => {
  const levels: Set<Level> = new Set();
  deposits.value.forEach((deposit) => levels.add(deposit.level));
  return Array.from(levels).sort((a, b) => a.index - b.index);
});
</script>

<template>
  <div id="browse-view">
    <div class="search">
      <input
        type="text"
        v-model="searchbarContent"
        autocomplete="off"
        name="search-input"
        class="search-input"
        placeholder="Rechercher"
        @input="toggleSB()"
      />
      <button class="material-icons white">search</button>
    </div>
    <div class="filters">
      <ul class="level-buttons">
        <h2>Niveaux :</h2>
        <li
          :class="selectedLevel == null ? 'active' : ''"
          class="level-button-all"
          @click="selectLevel(null)"
        >
          <RouterLink to="/browse/"> Tout </RouterLink>
        </li>
        <li
          v-bind:class="{ active: level == selectedLevel }"
          class="level-button"
          @click="selectLevel(level)"
          v-for="level in levels"
          :key="level"
        >
          <RouterLink :to="'/browse/' + level.nameInURL">
            {{ level.abbreviated }}
          </RouterLink>
        </li>
      </ul>

      <ul class="sort-keys">
        <h2>Type de tri :</h2>
        <button id="change-order-button" @click="changeOrder()">
          <span v-if="reversed" class="material-icons"> arrow_drop_up </span>
          <span v-else class="material-icons"> arrow_drop_down </span>
          Ordre {{ reversed ? "Croissant" : "Décroissant" }}
        </button>

        <li
          @click="changeSort(sortType)"
          v-bind:class="{ active: sort == sortType }"
          v-for="sortType in Sort"
          :key="sortType"
        >
          {{ sortType }}
        </li>
      </ul>
    </div>
    <h2>Résultats :</h2>
    <div v-if="loading" class="loading-container">
      <LoadingAnimation size="25%" />
    </div>
    <div v-else-if="!output.length" class="center-text">
      <p>Aucun depôt trouvé</p>
    </div>
    <Transition v-else name="fade">
      <div id="browse-container">
        <Card :exercise="repo" v-for="repo in output" :key="repo.id" />
      </div>
    </Transition>
  </div>
</template>
