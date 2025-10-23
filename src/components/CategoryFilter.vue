<template>
  <div class="category-filter">
    <h2 class="text-xl font-bold mb-6 text-white border-l-4 border-entain-purple pl-4">Filter by Category</h2>
    
    <div class="flex flex-wrap gap-3" role="group" aria-label="Race category filter buttons">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="toggleCategory(category.id)"
        :class="[
          'btn-filter',
          isSelected(category.id) ? 'btn-filter-active' : 'btn-filter-inactive'
        ]"
        :aria-pressed="isSelected(category.id)"
        :aria-label="`Filter by ${category.name} races, ${isSelected(category.id) ? 'currently selected' : 'not selected'}`"
        type="button"
      >
        <span class="mr-2 text-lg" aria-hidden="true">{{ category.icon }}</span>
        <span>{{ category.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRaceStore, RACE_CATEGORIES, type RaceCategory } from '@/stores/raceStore';

const raceStore = useRaceStore();

const categories = computed<RaceCategory[]>(() => Object.values(RACE_CATEGORIES));

function toggleCategory(categoryId: string): void {
  raceStore.toggleCategory(categoryId);
}

function isSelected(categoryId: string): boolean {
  return raceStore.isCategorySelected(categoryId);
}
</script>

