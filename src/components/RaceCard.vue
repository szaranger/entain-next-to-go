<template>
  <article 
    class="race-card group" 
    role="listitem"
    :aria-label="`${categoryName} race at ${race.meetingName}, race number ${race.raceNumber}`"
  >
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-3xl" aria-hidden="true">{{ categoryIcon }}</span>
          <h3 class="text-xl font-bold text-white group-hover:text-entain-accent transition-colors">
            <span class="sr-only">{{ categoryName }} race: </span>
            {{ race.meetingName }}
          </h3>
        </div>
        
        <div class="flex items-center gap-4 text-sm text-gray-400">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-gray-300">Race</span>
            <span class="bg-gradient-to-r from-entain-purple to-entain-purple-light text-white px-3 py-1.5 rounded-lg font-bold shadow-lg shadow-entain-purple/30">
              {{ race.raceNumber }}
            </span>
          </div>
          
          <div v-if="race.venueName" class="flex items-center gap-2">
            <span aria-hidden="true">📍</span>
            <span class="text-gray-300">
              <span class="sr-only">Location: </span>
              {{ race.venueName }}
            </span>
            <span v-if="race.venueState" class="text-gray-500">
              ({{ race.venueState }})
            </span>
          </div>
        </div>
      </div>
      
      <div class="text-right">
        <CountdownTimer :target-time="race.advertisedStart" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CountdownTimer from './CountdownTimer.vue';
import { useRaceStore } from '@/stores/raceStore';
import type { Race } from '@/services/racingApi';

interface Props {
  race: Race;
}

const props = defineProps<Props>();

const raceStore = useRaceStore();

const categoryIcon = computed<string>(() => {
  const category = raceStore.getCategoryById(props.race.categoryId);
  return category?.icon || '🏁';
});

const categoryName = computed<string>(() => {
  const category = raceStore.getCategoryById(props.race.categoryId);
  return category?.name || 'Racing';
});
</script>

