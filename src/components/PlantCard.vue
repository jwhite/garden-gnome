<template>
  <div class="plant-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
    <!-- Plant Image Placeholder -->
    <div class="h-48 bg-gradient-to-br from-garden-100 to-garden-200 flex items-center justify-center">
      <div class="text-6xl">{{ getPlantEmoji(plant.category) }}</div>
    </div>

    <!-- Card Content -->
    <div class="p-4">
      <!-- Plant Name and Variety -->
      <div class="mb-3">
        <h3 class="text-lg font-semibold text-gray-900">{{ plant.name }}</h3>
        <p class="text-sm text-garden-600 font-medium">{{ plant.variety }}</p>
        <p v-if="plant.scientificName" class="text-xs text-gray-500 italic">{{ plant.scientificName }}</p>
      </div>

      <!-- Key Stats -->
      <div class="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div class="flex items-center">
          <span class="text-gray-500">🕐</span>
          <span class="ml-1 text-gray-700">{{ plant.daysToMaturity }} days</span>
        </div>
        <div class="flex items-center">
          <span class="text-gray-500">📏</span>
          <span class="ml-1 text-gray-700">{{ plant.spacingInches }}" spacing</span>
        </div>
        <div class="flex items-center">
          <span class="text-gray-500">☀️</span>
          <span class="ml-1 text-gray-700 capitalize">{{ formatSunRequirement(plant.sunRequirement) }}</span>
        </div>
        <div class="flex items-center">
          <span class="text-gray-500">📊</span>
          <span class="ml-1 text-gray-700 capitalize">{{ plant.difficultyLevel }}</span>
        </div>
      </div>

      <!-- Badges -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-garden-100 text-garden-800">
          {{ formatCategory(plant.category) }}
        </span>
        <span 
          v-if="plant.isPerennial"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          Perennial
        </span>
        <span 
          v-if="plant.successivePlantingInterval"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
        >
          Succession Plant
        </span>
        <span 
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          :class="getDifficultyBadgeClass(plant.difficultyLevel)"
        >
          {{ plant.difficultyLevel }}
        </span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-4 line-clamp-3">{{ plant.description }}</p>

      <!-- Companion Plants -->
      <div v-if="plant.companionPlants.length > 0" class="mb-4">
        <p class="text-xs text-gray-500 mb-1">🤝 Good Companions:</p>
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="companion in plant.companionPlants.slice(0, 3)"
            :key="companion"
            class="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs rounded"
          >
            {{ companion }}
          </span>
          <span 
            v-if="plant.companionPlants.length > 3"
            class="inline-block px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded"
          >
            +{{ plant.companionPlants.length - 3 }} more
          </span>
        </div>
      </div>

      <!-- Growing Tips (collapsed by default) -->
      <div v-if="showDetails" class="mb-4 text-sm">
        <div class="bg-garden-50 p-3 rounded-lg">
          <p class="font-medium text-garden-800 mb-2">💡 Growing Tips:</p>
          <p class="text-garden-700">{{ plant.growingTips }}</p>
        </div>
      </div>

      <!-- Seed Inventory Status -->
      <div v-if="seedCount > 0" class="mb-4">
        <div class="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
          <span class="text-sm text-blue-800 font-medium">📦 {{ seedCount }} seed varieties in inventory</span>
          <button
            @click="$emit('view-seeds', plant.id)"
            class="text-blue-600 hover:text-blue-700 text-xs font-medium"
          >
            View Seeds
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button
          @click="showDetails = !showDetails"
          class="flex-1 bg-garden-100 text-garden-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-garden-200 transition-colors"
        >
          {{ showDetails ? 'Less Info' : 'More Info' }}
        </button>
        <button
          @click="$emit('add-to-garden', plant)"
          class="flex-1 bg-garden-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-garden-700 transition-colors"
        >
          Add to Garden
        </button>
        <button
          @click="$emit('add-seeds', plant)"
          class="bg-earth-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-earth-700 transition-colors"
          title="Add Seeds"
        >
          🌱
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePlantsStore } from '@/stores/plants';
import type { Plant } from '@/types';

interface Props {
  plant: Plant;
}

const props = defineProps<Props>();

defineEmits<{
  'view-seeds': [plantId: string];
  'add-to-garden': [plant: Plant];
  'add-seeds': [plant: Plant];
}>();

const plantsStore = usePlantsStore();
const showDetails = ref(false);

// Computed
const seedCount = computed(() => {
  return plantsStore.getSeedsByPlantId(props.plant.id).length;
});

// Methods
function getPlantEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'vegetable': '🥬',
    'fruit': '🍎',
    'herb': '🌿',
    'flower': '🌸',
    'grain': '🌾',
    'legume': '🫘',
    'root': '🥕',
    'leafy-green': '🥬',
    'brassica': '🥦',
    'nightshade': '🍅',
    'squash': '🎃',
    'allium': '🧅'
  };
  return emojiMap[category] || '🌱';
}

function formatCategory(category: string): string {
  return category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatSunRequirement(requirement: string): string {
  return requirement.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function getDifficultyBadgeClass(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>