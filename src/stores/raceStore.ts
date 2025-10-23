import { defineStore } from 'pinia';
import { ref, computed, type Ref, type ComputedRef } from 'vue';
import { fetchNextRaces, transformRaceData, type Race } from '@/services/racingApi';

/**
 * Race category definition
 */
export interface RaceCategory {
  id: string;
  name: string;
  icon: string;
}

/**
 * Race categories object
 */
interface RaceCategories {
  GREYHOUND: RaceCategory;
  HARNESS: RaceCategory;
  HORSE: RaceCategory;
}

/**
 * Race category definitions
 */
export const RACE_CATEGORIES: RaceCategories = {
  GREYHOUND: {
    id: import.meta.env.VITE_GREYHOUND_CATEGORY_ID,
    name: 'Greyhound',
    icon: '🐕'
  },
  HARNESS: {
    id: import.meta.env.VITE_HARNESS_CATEGORY_ID,
    name: 'Harness',
    icon: '🐴'
  },
  HORSE: {
    id: import.meta.env.VITE_HORSE_CATEGORY_ID,
    name: 'Horse',
    icon: '🏇'
  }
};

/**
 * Race store state interface
 */
export interface RaceStoreState {
  races: Ref<Race[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  selectedCategories: Ref<Set<string>>;
  lastFetchTime: Ref<Date | null>;
  filteredRaces: ComputedRef<Race[]>;
  loadRaces: () => Promise<void>;
  toggleCategory: (categoryId: string) => void;
  isCategorySelected: (categoryId: string) => boolean;
  getCategoryById: (categoryId: string) => RaceCategory | undefined;
}

/**
 * Main race store using Pinia
 * Manages race data, filtering, and real-time updates
 */
export const useRaceStore = defineStore('race', (): RaceStoreState => {
  // State
  const races = ref<Race[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const selectedCategories = ref<Set<string>>(new Set([
    RACE_CATEGORIES.GREYHOUND.id,
    RACE_CATEGORIES.HARNESS.id,
    RACE_CATEGORIES.HORSE.id
  ]));
  const lastFetchTime = ref<Date | null>(null);

  /**
   * Computed: Filtered and sorted races
   * - Filters by selected categories
   * - Removes races that are more than 1 minute past start time
   * - Sorts by advertised start time ascending
   * - Returns only the next 5 races
   */
  const filteredRaces = computed<Race[]>(() => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    
    return races.value
      .filter(race => {
        // Filter by category
        if (!selectedCategories.value.has(race.categoryId)) {
          return false;
        }
        
        // Remove races that started more than 1 minute ago
        if (race.advertisedStart < oneMinuteAgo) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => a.advertisedStart.getTime() - b.advertisedStart.getTime())
      .slice(0, 5);
  });

  /**
   * Fetch races from API
   */
  async function loadRaces(): Promise<void> {
    loading.value = true;
    error.value = null;
    
    try {
      const apiData = await fetchNextRaces(10);
      const transformedRaces = transformRaceData(apiData);
      races.value = transformedRaces;
      lastFetchTime.value = new Date();
    } catch (err) {
      error.value = (err as Error).message || 'Failed to load races';
      console.error('Failed to load races:', err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Toggle category filter
   */
  function toggleCategory(categoryId: string): void {
    if (selectedCategories.value.has(categoryId)) {
      selectedCategories.value.delete(categoryId);
    } else {
      selectedCategories.value.add(categoryId);
    }
    // Create a new Set to trigger reactivity
    selectedCategories.value = new Set(selectedCategories.value);
  }

  /**
   * Check if a category is selected
   */
  function isCategorySelected(categoryId: string): boolean {
    return selectedCategories.value.has(categoryId);
  }

  /**
   * Get category by ID
   */
  function getCategoryById(categoryId: string): RaceCategory | undefined {
    return Object.values(RACE_CATEGORIES).find(cat => cat.id === categoryId);
  }

  return {
    // State
    races,
    loading,
    error,
    selectedCategories,
    lastFetchTime,
    
    // Computed
    filteredRaces,
    
    // Actions
    loadRaces,
    toggleCategory,
    isCategorySelected,
    getCategoryById
  };
});

