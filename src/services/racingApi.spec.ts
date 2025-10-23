/**
 * Tests for racingApi service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchNextRaces, transformRaceData, type ApiRaceResponse } from './racingApi';
import { createMockApiResponse } from '@/test/helpers';

describe('racingApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchNextRaces', () => {
    it('should fetch races successfully', async () => {
      const mockResponse = createMockApiResponse(5);
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await fetchNextRaces(5);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('method=nextraces&count=5'),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should use default count of 10', async () => {
      const mockResponse = createMockApiResponse(10);
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      await fetchNextRaces();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('count=10'),
        expect.any(Object)
      );
    });

    it('should throw error when response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500
      });

      await expect(fetchNextRaces()).rejects.toThrow(
        'API request failed with status 500'
      );
    });

    it('should throw error when fetch fails', async () => {
      const errorMessage = 'Network error';
      global.fetch = vi.fn().mockRejectedValue(new Error(errorMessage));

      await expect(fetchNextRaces()).rejects.toThrow(errorMessage);
    });
  });

  describe('transformRaceData', () => {
    it('should transform API data correctly', () => {
      const mockApiData: ApiRaceResponse = {
        data: {
          race_summaries: {
            'race-1': {
              race_id: 'race-1',
              meeting_name: 'Test Meeting',
              race_number: 3,
              advertised_start: {
                seconds: 1729598400 // Oct 22, 2025, 12:00:00 GMT
              },
              category_id: 'cat-1',
              venue_id: 'venue-1',
              venue_name: 'Test Venue',
              venue_state: 'NSW',
              venue_country: 'AUS'
            }
          }
        }
      };

      const result = transformRaceData(mockApiData);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'race-1',
        meetingName: 'Test Meeting',
        raceNumber: 3,
        advertisedStart: new Date(1729598400 * 1000),
        categoryId: 'cat-1',
        venueId: 'venue-1',
        venueName: 'Test Venue',
        venueState: 'NSW',
        venueCountry: 'AUS'
      });
    });

    it('should transform multiple races', () => {
      const mockApiData = createMockApiResponse(3);
      const result = transformRaceData(mockApiData);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('race-1');
      expect(result[1].id).toBe('race-2');
      expect(result[2].id).toBe('race-3');
    });

    it('should return empty array for invalid data', () => {
      expect(transformRaceData({} as ApiRaceResponse)).toEqual([]);
      expect(transformRaceData({ data: {} } as ApiRaceResponse)).toEqual([]);
      expect(transformRaceData({ data: { race_summaries: null } } as any)).toEqual([]);
    });

    it('should handle empty race_summaries object', () => {
      const mockApiData: ApiRaceResponse = {
        data: {
          race_summaries: {}
        }
      };

      const result = transformRaceData(mockApiData);
      expect(result).toEqual([]);
    });

    it('should correctly convert timestamps to Date objects', () => {
      const timestamp = 1729598400; // Known timestamp
      const mockApiData: ApiRaceResponse = {
        data: {
          race_summaries: {
            'race-1': {
              race_id: 'race-1',
              meeting_name: 'Test',
              race_number: 1,
              advertised_start: { seconds: timestamp },
              category_id: 'cat-1',
              venue_id: 'venue-1',
              venue_name: 'Test',
              venue_state: 'NSW',
              venue_country: 'AUS'
            }
          }
        }
      };

      const result = transformRaceData(mockApiData);
      expect(result[0].advertisedStart.getTime()).toBe(timestamp * 1000);
    });
  });
});

