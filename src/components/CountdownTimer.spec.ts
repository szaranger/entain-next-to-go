/**
 * Tests for CountdownTimer component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CountdownTimer from './CountdownTimer.vue';

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component', () => {
      const targetTime = new Date(Date.now() + 300000); // 5 minutes from now
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.find('.countdown-timer').exists()).toBe(true);
    });

    it('should display formatted time', () => {
      const targetTime = new Date(Date.now() + 125000); // 2:05 from now
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toContain('2:05');
    });
  });

  describe('Time Formatting', () => {
    it('should format time as MM:SS for times under 1 hour', () => {
      const targetTime = new Date(Date.now() + 125000); // 2 minutes 5 seconds
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toBe('2:05');
    });

    it('should format time as HH:MM:SS for times over 1 hour', () => {
      const targetTime = new Date(Date.now() + 3725000); // 1 hour, 2 minutes, 5 seconds
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toBe('1:02:05');
    });

    it('should display "Started" for past times', () => {
      const targetTime = new Date(Date.now() - 10000); // 10 seconds ago
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toBe('Started');
    });

    it('should pad single digit seconds with zero', () => {
      const targetTime = new Date(Date.now() + 65000); // 1 minute 5 seconds
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toBe('1:05');
    });

    it('should pad single digit minutes with zero in HH:MM:SS format', () => {
      const targetTime = new Date(Date.now() + 3665000); // 1 hour, 1 minute, 5 seconds
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toBe('1:01:05');
    });

    it('should handle exact minute marks', () => {
      const targetTime = new Date(Date.now() + 120000); // Exactly 2 minutes
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toBe('2:00');
    });

    it('should handle exactly 0 seconds remaining', () => {
      const targetTime = new Date(Date.now());
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toBe('Started');
    });
  });

  describe('Styling', () => {
    it('should apply warning styles when time remaining is <= 60 seconds', () => {
      const targetTime = new Date(Date.now() + 30000); // 30 seconds
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      const span = wrapper.find('span');
      expect(span.classes()).toContain('text-red-400');
      expect(span.classes()).toContain('bg-red-900/30');
      expect(span.classes()).toContain('border-red-500');
    });

    it('should apply normal styles when time remaining is > 60 seconds', () => {
      const targetTime = new Date(Date.now() + 300000); // 5 minutes
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      const span = wrapper.find('span');
      expect(span.classes()).toContain('text-entain-accent');
      expect(span.classes()).toContain('bg-entain-purple/20');
      expect(span.classes()).toContain('border-entain-purple');
    });

    it('should apply warning styles at exactly 60 seconds', () => {
      const targetTime = new Date(Date.now() + 60000); // 60 seconds
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      const span = wrapper.find('span');
      expect(span.classes()).toContain('text-red-400');
    });

    it('should have consistent base classes regardless of time', () => {
      const targetTime = new Date(Date.now() + 300000);
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      const span = wrapper.find('span');
      expect(span.classes()).toContain('font-mono');
      expect(span.classes()).toContain('font-bold');
      expect(span.classes()).toContain('text-xl');
      expect(span.classes()).toContain('px-4');
      expect(span.classes()).toContain('py-2');
      expect(span.classes()).toContain('rounded-lg');
    });
  });

  describe('Timer Updates', () => {
    it('should update countdown every second', async () => {
      const targetTime = new Date(Date.now() + 10000); // 10 seconds
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toBe('0:10');

      // Advance time by 1 second
      vi.advanceTimersByTime(1000);
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toBe('0:09');

      // Advance another second
      vi.advanceTimersByTime(1000);
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toBe('0:08');
    });

    it('should display "Started" once time has elapsed', async () => {
      const targetTime = new Date(Date.now() + 2000); // 2 seconds
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toBe('0:02');

      // Advance past the target time
      vi.advanceTimersByTime(3000);
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toBe('Started');
    });

    it('should clear interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      const targetTime = new Date(Date.now() + 10000);
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      wrapper.unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe('Props', () => {
    it('should accept targetTime prop', () => {
      const targetTime = new Date(Date.now() + 300000);
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.props('targetTime')).toEqual(targetTime);
    });

    it('should update when targetTime prop changes', async () => {
      const targetTime1 = new Date(Date.now() + 10000); // 10 seconds
      const targetTime2 = new Date(Date.now() + 60000); // 60 seconds
      
      const wrapper = mount(CountdownTimer, {
        props: { targetTime: targetTime1 }
      });

      expect(wrapper.text()).toBe('0:10');

      await wrapper.setProps({ targetTime: targetTime2 });

      expect(wrapper.text()).toBe('1:00');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large time differences', () => {
      const targetTime = new Date(Date.now() + 86400000); // 24 hours
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toMatch(/^\d{2,}:\d{2}:\d{2}$/);
    });

    it('should handle negative time correctly', () => {
      const targetTime = new Date(Date.now() - 100000); // Past time
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toBe('Started');
    });

    it('should maintain interval even when showing "Started"', async () => {
      const targetTime = new Date(Date.now() - 1000);
      const wrapper = mount(CountdownTimer, {
        props: { targetTime }
      });

      expect(wrapper.text()).toBe('Started');

      // Advance time and verify component still works
      vi.advanceTimersByTime(2000);
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toBe('Started');
    });
  });
});

