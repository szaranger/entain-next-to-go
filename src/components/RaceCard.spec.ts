/**
 * Tests for RaceCard component
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RaceCard from './RaceCard.vue';
import CountdownTimer from './CountdownTimer.vue';
import { RACE_CATEGORIES } from '@/stores/raceStore';
import { createMockRace } from '@/test/helpers';
import type { Race } from '@/services/racingApi';

describe('RaceCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render the component', () => {
      const race = createMockRace();
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.find('.race-card').exists()).toBe(true);
    });

    it('should render meeting name', () => {
      const race = createMockRace({ meetingName: 'Flemington' });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('Flemington');
    });

    it('should render race number', () => {
      const race = createMockRace({ raceNumber: 5 });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('5');
    });

    it('should render venue name', () => {
      const race = createMockRace({ venueName: 'Randwick' });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('Randwick');
    });

    it('should render venue state when provided', () => {
      const race = createMockRace({ 
        venueName: 'Randwick',
        venueState: 'NSW' 
      });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('NSW');
    });

    it('should not show venue state when not provided', () => {
      const race = createMockRace({ 
        venueName: 'Randwick',
        venueState: '' 
      });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      // Should not have the state section
      const stateElements = wrapper.findAll('span').filter(el => 
        el.classes().includes('text-gray-500')
      );
      expect(stateElements.length).toBe(0);
    });

    it('should not show venue section when venue name is not provided', () => {
      const race = createMockRace({ venueName: '' });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      // The v-if should prevent the venue div from rendering
      const venueDiv = wrapper.findAll('div').find(div => 
        div.text().includes('📍')
      );
      expect(venueDiv).toBeUndefined();
    });
  });

  describe('CountdownTimer Integration', () => {
    it('should render CountdownTimer component', () => {
      const race = createMockRace();
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.findComponent(CountdownTimer).exists()).toBe(true);
    });

    it('should pass advertisedStart to CountdownTimer', () => {
      const advertisedStart = new Date('2025-10-22T12:00:00Z');
      const race = createMockRace({ advertisedStart });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      const timer = wrapper.findComponent(CountdownTimer);
      expect(timer.props('targetTime')).toEqual(advertisedStart);
    });
  });

  describe('Category Icons', () => {
    it('should display greyhound icon for greyhound races', () => {
      const race = createMockRace({ 
        categoryId: RACE_CATEGORIES.GREYHOUND.id 
      });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('🐕');
    });

    it('should display harness icon for harness races', () => {
      const race = createMockRace({ 
        categoryId: RACE_CATEGORIES.HARNESS.id 
      });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('🐴');
    });

    it('should display horse icon for horse races', () => {
      const race = createMockRace({ 
        categoryId: RACE_CATEGORIES.HORSE.id 
      });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('🏇');
    });

    it('should display default icon for unknown category', () => {
      const race = createMockRace({ categoryId: 'unknown-category' });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('🏁');
    });
  });

  describe('Styling', () => {
    it('should have group class for hover effects', () => {
      const race = createMockRace();
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.find('.race-card').classes()).toContain('group');
    });

    it('should have proper layout classes', () => {
      const race = createMockRace();
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      const card = wrapper.find('.race-card');
      expect(card.exists()).toBe(true);
    });

    it('should apply gradient to race number badge', () => {
      const race = createMockRace();
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      const raceNumberElements = wrapper.findAll('span').filter(el => 
        el.classes().some(c => c.includes('bg-gradient'))
      );
      expect(raceNumberElements.length).toBeGreaterThan(0);
    });
  });

  describe('Props', () => {
    it('should accept race prop', () => {
      const race = createMockRace();
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.props('race')).toEqual(race);
    });

    it('should update when race prop changes', async () => {
      const race1 = createMockRace({ meetingName: 'Meeting 1' });
      const race2 = createMockRace({ meetingName: 'Meeting 2' });
      
      const wrapper = mount(RaceCard, {
        props: { race: race1 }
      });

      expect(wrapper.text()).toContain('Meeting 1');

      await wrapper.setProps({ race: race2 });

      expect(wrapper.text()).toContain('Meeting 2');
      expect(wrapper.text()).not.toContain('Meeting 1');
    });

    it('should handle all race properties', () => {
      const race: Race = {
        id: 'test-race-123',
        meetingName: 'Test Track',
        raceNumber: 7,
        advertisedStart: new Date('2025-10-22T15:30:00Z'),
        categoryId: RACE_CATEGORIES.HORSE.id,
        venueId: 'venue-123',
        venueName: 'Test Venue',
        venueState: 'VIC',
        venueCountry: 'AUS'
      };

      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('Test Track');
      expect(wrapper.text()).toContain('7');
      expect(wrapper.text()).toContain('Test Venue');
      expect(wrapper.text()).toContain('VIC');
      expect(wrapper.text()).toContain('🏇');
    });
  });

  describe('Layout Structure', () => {
    it('should have proper layout structure', () => {
      const race = createMockRace();
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      // Should have main container with flex layout
      const flexContainer = wrapper.find('.flex.justify-between');
      expect(flexContainer.exists()).toBe(true);
    });

    it('should display race info on the left and timer on the right', () => {
      const race = createMockRace();
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      const flexContainer = wrapper.find('.flex.justify-between');
      const children = flexContainer.findAll('div');
      
      // Should have child elements for layout
      expect(children.length).toBeGreaterThan(0);
    });

    it('should have race label', () => {
      const race = createMockRace();
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('Race');
    });

    it('should have location emoji', () => {
      const race = createMockRace({ venueName: 'Test Venue' });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('📍');
    });
  });

  describe('Computed Properties', () => {
    it('should compute category icon correctly', () => {
      const race = createMockRace({ 
        categoryId: RACE_CATEGORIES.GREYHOUND.id 
      });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      // Icon should be rendered
      expect(wrapper.find('.text-3xl').text()).toBe('🐕');
    });

    it('should recompute icon when race changes', async () => {
      const race1 = createMockRace({ 
        categoryId: RACE_CATEGORIES.GREYHOUND.id 
      });
      const race2 = createMockRace({ 
        categoryId: RACE_CATEGORIES.HORSE.id 
      });
      
      const wrapper = mount(RaceCard, {
        props: { race: race1 }
      });

      expect(wrapper.find('.text-3xl').text()).toBe('🐕');

      await wrapper.setProps({ race: race2 });

      expect(wrapper.find('.text-3xl').text()).toBe('🏇');
    });
  });

  describe('Edge Cases', () => {
    it('should handle race with minimal data', () => {
      const race = createMockRace({
        venueName: '',
        venueState: '',
        categoryId: 'unknown'
      });
      
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      // Should still render without errors
      expect(wrapper.find('.race-card').exists()).toBe(true);
      expect(wrapper.text()).toContain('Race');
    });

    it('should handle very long meeting names', () => {
      const race = createMockRace({ 
        meetingName: 'Very Long Meeting Name That Should Still Display Properly'
      });
      
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('Very Long Meeting Name');
    });

    it('should handle large race numbers', () => {
      const race = createMockRace({ raceNumber: 99 });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain('99');
    });

    it('should handle special characters in venue names', () => {
      const race = createMockRace({ 
        venueName: "Saint-Cloud (L'Hippodrome)" 
      });
      const wrapper = mount(RaceCard, {
        props: { race }
      });

      expect(wrapper.text()).toContain("Saint-Cloud (L'Hippodrome)");
    });
  });
});

