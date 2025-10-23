<template>
  <div id="app" class="min-h-screen bg-entain-darker flex flex-col">
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Header -->
    <header role="banner" class="bg-gradient-to-r from-entain-purple-dark via-entain-purple to-entain-purple-dark text-white shadow-2xl shadow-entain-purple/30">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold flex items-center gap-3">
          <span class="text-entain-accent" aria-hidden="true">🏁</span>
          <span>Next to Go</span>
        </h1>
        <p class="text-purple-200 mt-2 text-lg">Live racing updates</p>
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" role="main" aria-label="Next to Go Races" class="container mx-auto px-4 py-8 flex-1">
      <!-- Category Filter -->
      <section aria-label="Race category filters" class="bg-entain-dark rounded-lg shadow-xl shadow-entain-purple/10 p-6 mb-8 border border-entain-gray">
        <CategoryFilter />
      </section>

      <!-- Loading State -->
      <div v-if="loading && races.length === 0" role="status" aria-live="polite" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-entain-purple" aria-hidden="true"></div>
        <p class="mt-4 text-gray-300">Loading races...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" role="alert" aria-live="assertive" class="bg-red-900/20 border-2 border-red-500 rounded-lg p-6 text-center">
        <p class="text-red-400 font-semibold">{{ error }}</p>
        <button 
          @click="loadRaces" 
          class="btn-primary mt-4"
          aria-label="Retry loading race data"
        >
          Try Again
        </button>
      </div>

      <!-- Race List -->
      <div v-else-if="races.length > 0" class="space-y-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white border-l-4 border-entain-purple pl-4">
            Next 5 Races
          </h2>
          <button 
            @click="loadRaces" 
            class="text-entain-accent hover:text-entain-purple-light flex items-center gap-2 transition-colors"
            :disabled="loading"
            :aria-disabled="loading"
            aria-label="Refresh race data"
          >
            <span v-if="!loading" aria-hidden="true">🔄</span>
            <span v-else class="inline-block animate-spin" aria-hidden="true">⟳</span>
            <span class="font-semibold">Refresh</span>
          </button>
        </div>

        <TransitionGroup name="race-list" tag="div" class="space-y-4" role="list">
          <RaceCard 
            v-for="race in races" 
            :key="race.id" 
            :race="race"
          />
        </TransitionGroup>
      </div>

      <!-- No Races State -->
      <div v-else class="text-center py-12 bg-entain-dark rounded-lg shadow-xl border border-entain-gray">
        <p class="text-gray-300 text-lg">No races available for the selected categories</p>
        <p class="text-gray-500 mt-2">Try selecting different categories</p>
      </div>
      
      <!-- Live region for auto-refresh announcements -->
      <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
        <span v-if="loading && races.length > 0">Loading updated race information...</span>
        <span v-else-if="lastFetchTime">Race data updated at {{ formatTime(lastFetchTime) }}</span>
      </div>

      <!-- Auto-refresh indicator -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <p>Auto-refreshing every 30 seconds</p>
        <p v-if="lastFetchTime" class="mt-1">
          Last updated: {{ formatTime(lastFetchTime) }}
        </p>
      </div>
    </main>

    <!-- Footer -->
    <footer role="contentinfo" class="bg-gradient-to-r from-entain-purple-dark via-entain-purple to-entain-purple-dark text-gray-300 py-8 mt-auto shadow-2xl shadow-entain-purple/20">
      <div class="container mx-auto px-4 text-center">
        <p class="text-purple-200">&copy; 2025 Entain - Next to Go Racing</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRaceStore } from '@/stores/raceStore';
import RaceCard from '@/components/RaceCard.vue';
import CategoryFilter from '@/components/CategoryFilter.vue';

const raceStore = useRaceStore();

// Computed properties
const races = computed(() => raceStore.filteredRaces);
const loading = computed(() => raceStore.loading);
const error = computed(() => raceStore.error);
const lastFetchTime = computed(() => raceStore.lastFetchTime);

// Methods
function loadRaces(): void {
  raceStore.loadRaces();
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString();
}

// Auto-refresh setup
let refreshInterval: number | null = null;

onMounted(() => {
  // Initial load
  loadRaces();
  
  // Auto-refresh every 30 seconds
  refreshInterval = setInterval(() => {
    loadRaces();
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<style scoped>
/* Transition animations for race list */
.race-list-enter-active,
.race-list-leave-active {
  transition: all 0.5s ease;
}

.race-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.race-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.race-list-move {
  transition: transform 0.5s ease;
}
</style>

