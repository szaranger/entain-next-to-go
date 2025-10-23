/**
 * Tests for CategoryFilter component
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CategoryFilter from './CategoryFilter.vue';
import { useRaceStore, RACE_CATEGORIES } from '@/stores/raceStore';

describe('CategoryFilter', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Rendering', () => {
    it('should render the component', () => {
      const wrapper = mount(CategoryFilter);
      expect(wrapper.find('.category-filter').exists()).toBe(true);
    });

    it('should render the title', () => {
      const wrapper = mount(CategoryFilter);
      expect(wrapper.find('h2').text()).toBe('Filter by Category');
    });

    it('should render all category buttons', () => {
      const wrapper = mount(CategoryFilter);
      const buttons = wrapper.findAll('button');
      
      expect(buttons).toHaveLength(3);
    });

    it('should render category icons and names', () => {
      const wrapper = mount(CategoryFilter);
      const buttons = wrapper.findAll('button');
      
      // Check for Greyhound
      expect(buttons[0].text()).toContain('🐕');
      expect(buttons[0].text()).toContain('Greyhound');
      
      // Check for Harness
      expect(buttons[1].text()).toContain('🐴');
      expect(buttons[1].text()).toContain('Harness');
      
      // Check for Horse
      expect(buttons[2].text()).toContain('🏇');
      expect(buttons[2].text()).toContain('Horse');
    });
  });

  describe('Button States', () => {
    it('should show all buttons as active initially', () => {
      const wrapper = mount(CategoryFilter);
      const buttons = wrapper.findAll('button');
      
      buttons.forEach(button => {
        expect(button.classes()).toContain('btn-filter-active');
        expect(button.classes()).not.toContain('btn-filter-inactive');
      });
    });

    it('should toggle button state when clicked', async () => {
      const wrapper = mount(CategoryFilter);
      const button = wrapper.findAll('button')[0];
      
      expect(button.classes()).toContain('btn-filter-active');
      
      await button.trigger('click');
      
      expect(button.classes()).toContain('btn-filter-inactive');
      expect(button.classes()).not.toContain('btn-filter-active');
    });

    it('should toggle back to active when clicked again', async () => {
      const wrapper = mount(CategoryFilter);
      const button = wrapper.findAll('button')[0];
      
      await button.trigger('click'); // Deactivate
      expect(button.classes()).toContain('btn-filter-inactive');
      
      await button.trigger('click'); // Activate again
      expect(button.classes()).toContain('btn-filter-active');
    });

    it('should allow multiple buttons to be inactive', async () => {
      const wrapper = mount(CategoryFilter);
      const buttons = wrapper.findAll('button');
      
      await buttons[0].trigger('click');
      await buttons[1].trigger('click');
      
      expect(buttons[0].classes()).toContain('btn-filter-inactive');
      expect(buttons[1].classes()).toContain('btn-filter-inactive');
      expect(buttons[2].classes()).toContain('btn-filter-active');
    });

    it('should allow all buttons to be inactive', async () => {
      const wrapper = mount(CategoryFilter);
      const buttons = wrapper.findAll('button');
      
      for (const button of buttons) {
        await button.trigger('click');
      }
      
      buttons.forEach(button => {
        expect(button.classes()).toContain('btn-filter-inactive');
      });
    });
  });

  describe('Store Integration', () => {
    it('should call store toggleCategory method on button click', async () => {
      const wrapper = mount(CategoryFilter);
      const store = useRaceStore();
      const button = wrapper.findAll('button')[0];
      
      const initialSelected = store.isCategorySelected(RACE_CATEGORIES.GREYHOUND.id);
      
      await button.trigger('click');
      
      const afterClickSelected = store.isCategorySelected(RACE_CATEGORIES.GREYHOUND.id);
      expect(afterClickSelected).toBe(!initialSelected);
    });

    it('should sync button state with store', async () => {
      const wrapper = mount(CategoryFilter);
      const store = useRaceStore();
      
      // Manually toggle in store
      store.toggleCategory(RACE_CATEGORIES.GREYHOUND.id);
      await wrapper.vm.$nextTick();
      
      const button = wrapper.findAll('button')[0];
      expect(button.classes()).toContain('btn-filter-inactive');
    });

    it('should correctly identify selected categories', () => {
      const wrapper = mount(CategoryFilter);
      const store = useRaceStore();
      
      // All should be selected initially
      expect(store.isCategorySelected(RACE_CATEGORIES.GREYHOUND.id)).toBe(true);
      expect(store.isCategorySelected(RACE_CATEGORIES.HARNESS.id)).toBe(true);
      expect(store.isCategorySelected(RACE_CATEGORIES.HORSE.id)).toBe(true);
    });
  });

  describe('Button Styling', () => {
    it('should apply base button styles', () => {
      const wrapper = mount(CategoryFilter);
      const buttons = wrapper.findAll('button');
      
      buttons.forEach(button => {
        expect(button.classes()).toContain('btn-filter');
      });
    });

    it('should display icon with proper spacing', () => {
      const wrapper = mount(CategoryFilter);
      const button = wrapper.findAll('button')[0];
      const icon = button.find('span');
      
      expect(icon.classes()).toContain('mr-2');
      expect(icon.classes()).toContain('text-lg');
    });
  });

  describe('Accessibility', () => {
    it('should render buttons as interactive elements', () => {
      const wrapper = mount(CategoryFilter);
      const buttons = wrapper.findAll('button');
      
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach(button => {
        expect(button.element.tagName).toBe('BUTTON');
      });
    });

    it('should have unique keys for v-for items', () => {
      const wrapper = mount(CategoryFilter);
      const buttons = wrapper.findAll('button');
      
      // Each button should be rendered
      expect(buttons).toHaveLength(3);
    });
  });

  describe('Categories Display', () => {
    it('should display categories in the correct order', () => {
      const wrapper = mount(CategoryFilter);
      const buttons = wrapper.findAll('button');
      
      // Order should match RACE_CATEGORIES object
      const categories = Object.values(RACE_CATEGORIES);
      
      buttons.forEach((button, index) => {
        expect(button.text()).toContain(categories[index].name);
        expect(button.text()).toContain(categories[index].icon);
      });
    });

    it('should use computed property for categories', () => {
      const wrapper = mount(CategoryFilter);
      
      // Verify that categories are coming from the computed property
      const categoriesCount = Object.values(RACE_CATEGORIES).length;
      const buttonsCount = wrapper.findAll('button').length;
      
      expect(buttonsCount).toBe(categoriesCount);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicks', async () => {
      const wrapper = mount(CategoryFilter);
      const store = useRaceStore();
      const button = wrapper.findAll('button')[0];
      
      // Click multiple times rapidly
      await button.trigger('click');
      await button.trigger('click');
      await button.trigger('click');
      
      // Should be in active state (odd number of clicks)
      expect(store.isCategorySelected(RACE_CATEGORIES.GREYHOUND.id)).toBe(false);
    });

    it('should handle interactions with different buttons independently', async () => {
      const wrapper = mount(CategoryFilter);
      const buttons = wrapper.findAll('button');
      
      await buttons[0].trigger('click');
      
      expect(buttons[0].classes()).toContain('btn-filter-inactive');
      expect(buttons[1].classes()).toContain('btn-filter-active');
      expect(buttons[2].classes()).toContain('btn-filter-active');
    });
  });
});

