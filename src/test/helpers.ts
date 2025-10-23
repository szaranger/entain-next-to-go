/**
 * Test helpers and utilities
 */

import type { Race, ApiRaceResponse } from '@/services/racingApi';

/**
 * Create a mock race object
 */
export function createMockRace(overrides?: Partial<Race>): Race {
  return {
    id: 'race-123',
    meetingName: 'Test Meeting',
    raceNumber: 1,
    advertisedStart: new Date('2025-10-22T12:00:00Z'),
    categoryId: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
    venueId: 'venue-123',
    venueName: 'Test Venue',
    venueState: 'NSW',
    venueCountry: 'AUS',
    ...overrides
  };
}

/**
 * Create mock API response
 */
export function createMockApiResponse(races: number = 1): ApiRaceResponse {
  const raceSummaries: ApiRaceResponse['data']['race_summaries'] = {};
  
  for (let i = 0; i < races; i++) {
    const raceId = `race-${i + 1}`;
    raceSummaries[raceId] = {
      race_id: raceId,
      meeting_name: `Meeting ${i + 1}`,
      race_number: i + 1,
      advertised_start: {
        seconds: Math.floor(Date.now() / 1000) + 300 // 5 minutes from now
      },
      category_id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
      venue_id: `venue-${i + 1}`,
      venue_name: `Venue ${i + 1}`,
      venue_state: 'NSW',
      venue_country: 'AUS'
    };
  }
  
  return {
    data: {
      race_summaries: raceSummaries
    }
  };
}

