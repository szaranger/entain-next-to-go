/**
 * Racing API Service
 * Handles all API calls to the Neds racing API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.neds.com.au/rest/v1/racing/';

/**
 * Raw API response structure
 */
export interface ApiRaceResponse {
  data: {
    race_summaries: {
      [key: string]: {
        race_id: string;
        meeting_name: string;
        race_number: number;
        advertised_start: {
          seconds: number;
        };
        category_id: string;
        venue_id: string;
        venue_name: string;
        venue_state: string;
        venue_country: string;
      };
    };
  };
}

/**
 * Normalized race data structure
 */
export interface Race {
  id: string;
  meetingName: string;
  raceNumber: number;
  advertisedStart: Date;
  categoryId: string;
  venueId: string;
  venueName: string;
  venueState: string;
  venueCountry: string;
}

/**
 * Fetches the next races from the Neds API
 * @param count - Number of races to fetch
 * @returns API response with race data
 */
export async function fetchNextRaces(count: number = 10): Promise<ApiRaceResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}?method=nextraces&count=${count}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching races:', error);
    throw error;
  }
}

/**
 * Transforms raw API race data into a normalized format
 * @param apiData - Raw API response
 * @returns Normalized race data
 */
export function transformRaceData(apiData: ApiRaceResponse): Race[] {
  if (!apiData?.data?.race_summaries) {
    return [];
  }
  
  const races: Race[] = [];
  const raceSummaries = apiData.data.race_summaries;
  
  for (const raceId in raceSummaries) {
    const race = raceSummaries[raceId];
    races.push({
      id: race.race_id,
      meetingName: race.meeting_name,
      raceNumber: race.race_number,
      advertisedStart: new Date(race.advertised_start.seconds * 1000),
      categoryId: race.category_id,
      venueId: race.venue_id,
      venueName: race.venue_name,
      venueState: race.venue_state,
      venueCountry: race.venue_country
    });
  }
  
  return races;
}

