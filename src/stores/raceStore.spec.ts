/**
 * Tests for raceStore
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRaceStore, RACE_CATEGORIES } from './raceStore';
import * as racingApi from '@/services/racingApi';
import { createMockRace, createMockApiResponse } from '@/test/helpers';

// Mock the racingApi module
vi.mock('@/services/racingApi', () => ({
  fetchNextRaces: vi.fn(),
  transformRaceData: vi.fn(),
}));

describe('raceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const store = useRaceStore();

      expect(store.races).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
      expect(store.lastFetchTime).toBe(null);
    });

    it('should initialize with all categories selected', () => {
      const store = useRaceStore();

      expect(store.isCategorySelected(RACE_CATEGORIES.GREYHOUND.id)).toBe(true);
      expect(store.isCategorySelected(RACE_CATEGORIES.HARNESS.id)).toBe(true);
      expect(store.isCategorySelected(RACE_CATEGORIES.HORSE.id)).toBe(true);
    });
  });

  describe('loadRaces', () => {
    it('should load races successfully', async () => {
      const store = useRaceStore();
      const mockApiData = createMockApiResponse(5);
      const mockRaces = [
        createMockRace({ id: 'race-1' }),
        createMockRace({ id: 'race-2' })
      ];

      vi.mocked(racingApi.fetchNextRaces).mockResolvedValue(mockApiData);
      vi.mocked(racingApi.transformRaceData).mockReturnValue(mockRaces);

      await store.loadRaces();

      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
      expect(store.races).toEqual(mockRaces);
      expect(store.lastFetchTime).toBeInstanceOf(Date);
      expect(racingApi.fetchNextRaces).toHaveBeenCalledWith(10);
      expect(racingApi.transformRaceData).toHaveBeenCalledWith(mockApiData);
    });

    it('should set loading state correctly', async () => {
      const store = useRaceStore();
      const mockApiData = createMockApiResponse(1);

      let loadingDuringFetch = false;
      vi.mocked(racingApi.fetchNextRaces).mockImplementation(async () => {
        loadingDuringFetch = store.loading;
        return mockApiData;
      });
      vi.mocked(racingApi.transformRaceData).mockReturnValue([]);

      expect(store.loading).toBe(false);
      await store.loadRaces();
      expect(loadingDuringFetch).toBe(true);
      expect(store.loading).toBe(false);
    });

    it('should handle API errors', async () => {
      const store = useRaceStore();
      const errorMessage = 'API Error';

      vi.mocked(racingApi.fetchNextRaces).mockRejectedValue(new Error(errorMessage));

      await store.loadRaces();

      expect(store.loading).toBe(false);
      expect(store.error).toBe(errorMessage);
      expect(store.races).toEqual([]);
    });

    it('should handle errors without message', async () => {
      const store = useRaceStore();

      vi.mocked(racingApi.fetchNextRaces).mockRejectedValue({});

      await store.loadRaces();

      expect(store.error).toBe('Failed to load races');
    });
  });

  describe('toggleCategory', () => {
    it('should deselect a selected category', () => {
      const store = useRaceStore();
      const categoryId = RACE_CATEGORIES.GREYHOUND.id;

      expect(store.isCategorySelected(categoryId)).toBe(true);
      store.toggleCategory(categoryId);
      expect(store.isCategorySelected(categoryId)).toBe(false);
    });

    it('should select an unselected category', () => {
      const store = useRaceStore();
      const categoryId = RACE_CATEGORIES.GREYHOUND.id;

      store.toggleCategory(categoryId); // First deselect
      expect(store.isCategorySelected(categoryId)).toBe(false);
      store.toggleCategory(categoryId); // Then select again
      expect(store.isCategorySelected(categoryId)).toBe(true);
    });

    it('should trigger reactivity by creating new Set', () => {
      const store = useRaceStore();
      const initialSet = store.selectedCategories;
      const categoryId = RACE_CATEGORIES.GREYHOUND.id;

      store.toggleCategory(categoryId);

      // Should be a new Set instance
      expect(store.selectedCategories).not.toBe(initialSet);
    });
  });

  describe('isCategorySelected', () => {
    it('should return true for selected category', () => {
      const store = useRaceStore();
      expect(store.isCategorySelected(RACE_CATEGORIES.GREYHOUND.id)).toBe(true);
    });

    it('should return false for unselected category', () => {
      const store = useRaceStore();
      store.toggleCategory(RACE_CATEGORIES.GREYHOUND.id);
      expect(store.isCategorySelected(RACE_CATEGORIES.GREYHOUND.id)).toBe(false);
    });

    it('should return false for unknown category', () => {
      const store = useRaceStore();
      expect(store.isCategorySelected('unknown-category')).toBe(false);
    });
  });

  describe('getCategoryById', () => {
    it('should return category for valid ID', () => {
      const store = useRaceStore();
      const category = store.getCategoryById(RACE_CATEGORIES.GREYHOUND.id);
      expect(category).toEqual(RACE_CATEGORIES.GREYHOUND);
    });

    it('should return undefined for invalid ID', () => {
      const store = useRaceStore();
      const category = store.getCategoryById('invalid-id');
      expect(category).toBeUndefined();
    });
  });

  describe('filteredRaces', () => {
    it('should filter races by selected categories', () => {
      const store = useRaceStore();
      const now = new Date();
      const futureTime = new Date(now.getTime() + 300000); // 5 minutes ahead

      store.races = [
        createMockRace({ 
          id: 'race-1', 
          categoryId: RACE_CATEGORIES.GREYHOUND.id,
          advertisedStart: futureTime
        }),
        createMockRace({ 
          id: 'race-2', 
          categoryId: RACE_CATEGORIES.HARNESS.id,
          advertisedStart: futureTime
        }),
        createMockRace({ 
          id: 'race-3', 
          categoryId: RACE_CATEGORIES.HORSE.id,
          advertisedStart: futureTime
        })
      ];

      // Deselect harness
      store.toggleCategory(RACE_CATEGORIES.HARNESS.id);

      const filtered = store.filteredRaces;
      expect(filtered).toHaveLength(2);
      expect(filtered.find(r => r.id === 'race-1')).toBeDefined();
      expect(filtered.find(r => r.id === 'race-3')).toBeDefined();
      expect(filtered.find(r => r.id === 'race-2')).toBeUndefined();
    });

    it('should remove races that started more than 1 minute ago', () => {
      const store = useRaceStore();
      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 120000);
      const thirtySecondsAgo = new Date(now.getTime() - 30000);
      const futureTime = new Date(now.getTime() + 300000);

      store.races = [
        createMockRace({ id: 'race-1', advertisedStart: twoMinutesAgo }),
        createMockRace({ id: 'race-2', advertisedStart: thirtySecondsAgo }),
        createMockRace({ id: 'race-3', advertisedStart: futureTime })
      ];

      const filtered = store.filteredRaces;
      expect(filtered).toHaveLength(2);
      expect(filtered.find(r => r.id === 'race-1')).toBeUndefined();
      expect(filtered.find(r => r.id === 'race-2')).toBeDefined();
      expect(filtered.find(r => r.id === 'race-3')).toBeDefined();
    });

    it('should sort races by advertised start time', () => {
      const store = useRaceStore();
      const now = new Date();

      store.races = [
        createMockRace({ 
          id: 'race-1', 
          advertisedStart: new Date(now.getTime() + 600000) // 10 mins
        }),
        createMockRace({ 
          id: 'race-2', 
          advertisedStart: new Date(now.getTime() + 180000) // 3 mins
        }),
        createMockRace({ 
          id: 'race-3', 
          advertisedStart: new Date(now.getTime() + 300000) // 5 mins
        })
      ];

      const filtered = store.filteredRaces;
      expect(filtered[0].id).toBe('race-2');
      expect(filtered[1].id).toBe('race-3');
      expect(filtered[2].id).toBe('race-1');
    });

    it('should limit results to 5 races', () => {
      const store = useRaceStore();
      const now = new Date();

      store.races = Array.from({ length: 10 }, (_, i) => 
        createMockRace({ 
          id: `race-${i}`,
          advertisedStart: new Date(now.getTime() + (i + 1) * 60000)
        })
      );

      const filtered = store.filteredRaces;
      expect(filtered).toHaveLength(5);
    });

    it('should return empty array when all categories are deselected', () => {
      const store = useRaceStore();
      const now = new Date();

      store.races = [
        createMockRace({ 
          advertisedStart: new Date(now.getTime() + 300000)
        })
      ];

      // Deselect all categories
      store.toggleCategory(RACE_CATEGORIES.GREYHOUND.id);
      store.toggleCategory(RACE_CATEGORIES.HARNESS.id);
      store.toggleCategory(RACE_CATEGORIES.HORSE.id);

      const filtered = store.filteredRaces;
      expect(filtered).toEqual([]);
    });

    it('should handle empty races array', () => {
      const store = useRaceStore();
      expect(store.filteredRaces).toEqual([]);
    });
  });

  describe('RACE_CATEGORIES constant', () => {
    it('should have correct structure', () => {
      expect(RACE_CATEGORIES.GREYHOUND).toEqual({
        id: expect.any(String),
        name: 'Greyhound',
        icon: '🐕'
      });

      expect(RACE_CATEGORIES.HARNESS).toEqual({
        id: expect.any(String),
        name: 'Harness',
        icon: '🐴'
      });

      expect(RACE_CATEGORIES.HORSE).toEqual({
        id: expect.any(String),
        name: 'Horse',
        icon: '🏇'
      });
    });
  });
});

