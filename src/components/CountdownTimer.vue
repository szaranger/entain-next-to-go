<template>
  <div class="countdown-timer">
    <span 
      role="timer"
      aria-live="off"
      aria-atomic="true"
      :aria-label="timeRemaining <= 60 
        ? `Urgent: Race starts in ${formattedTime}` 
        : `Race starts in ${formattedTime}`"
      :class="[
        'font-mono font-bold text-xl px-4 py-2 rounded-lg',
        timeRemaining <= 60 
          ? 'text-red-400 bg-red-900/30 border border-red-500' 
          : 'text-entain-accent bg-entain-purple/20 border border-entain-purple'
      ]"
    >
      {{ formattedTime }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  targetTime: Date;
}

const props = defineProps<Props>();

const currentTime = ref<Date>(new Date());
let intervalId: number | null = null;

// Time remaining in seconds
const timeRemaining = computed<number>(() => {
  const diff = props.targetTime.getTime() - currentTime.value.getTime();
  return Math.floor(diff / 1000);
});

// Format time as MM:SS or HH:MM:SS
const formattedTime = computed<string>(() => {
  const seconds = timeRemaining.value;
  
  if (seconds <= 0) {
    return 'Started';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  
  return `${minutes}:${String(secs).padStart(2, '0')}`;
});

// Update current time every second
onMounted(() => {
  intervalId = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.countdown-timer {
  display: inline-block;
}
</style>

