<template>
  <div class="plant-search bg-white rounded-lg shadow-lg p-6">
    <!-- Search Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-garden-800 mb-2">🌱 Plant Database</h2>
      <p class="text-gray-600">Search through 200+ plant varieties to find the perfect plants for your garden</p>
    </div>

    <!-- Search Input -->
    <div class="mb-6">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search plants by name, variety, or description..."
          class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-garden-500 focus:border-transparent"
          @input="handleSearch"
        >
        <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 space-y-4">
      <div class="flex flex-wrap gap-4">
        <!-- Category Filter -->
        <div class="min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            v-model="selectedCategories"
            multiple
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-garden-500 focus:border-garden-500"
          >
            <option value="vegetable">Vegetables</option>
            <option value="fruit">Fruits</option>
            <option value="herb">Herbs</option>
            <option value="leafy-green">Leafy Greens</option>
            <option value="root">Root Vegetables</option>
            <option value="legume">Legumes</option>
            <option value="brassica">Brassicas</option>
            <option value="nightshade">Nightshades</option>
            <option value="squash">Squash Family</option>
            <option value="allium">Alliums</option>
          </select>
        </div>

        <!-- Difficulty Filter -->
        <div class="min-w-[150px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select
            v-model="selectedDifficulty"
            multiple
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-garden-500 focus:border-garden-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <!-- Sun Requirements -->
        <div class="min-w-[150px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Sun Needs</label>
          <select
            v-model="selectedSunRequirements"
            multiple
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-garden-500 focus:border-garden-500"
          >
            <option value="full-sun">Full Sun</option>
            <option value="partial-sun">Partial Sun</option>
            <option value="partial-shade">Partial Shade</option>
            <option value="full-shade">Full Shade</option>
          </select>
        </div>
      </div>

      <!-- Advanced Filters Toggle -->
      <button
        @click="showAdvancedFilters = !showAdvancedFilters"
        class="text-garden-600 hover:text-garden-700 font-medium text-sm flex items-center"
      >
        {{ showAdvancedFilters ? 'Hide' : 'Show' }} Advanced Filters
        <svg 
          class="ml-1 h-4 w-4 transform transition-transform" 
          :class="{ 'rotate-180': showAdvancedFilters }"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Advanced Filters -->
      <div v-if="showAdvancedFilters" class="bg-gray-50 p-4 rounded-lg space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Days to Maturity Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Days to Maturity</label>
            <div class="flex space-x-2">
              <input
                v-model.number="daysToMaturityMin"
                type="number"
                placeholder="Min"
                class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
              <input
                v-model.number="daysToMaturityMax"
                type="number"
                placeholder="Max"
                class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
            </div>
          </div>

          <!-- Spacing Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Spacing (inches)</label>
            <div class="flex space-x-2">
              <input
                v-model.number="spacingMin"
                type="number"
                placeholder="Min"
                class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
              <input
                v-model.number="spacingMax"
                type="number"
                placeholder="Max"
                class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
            </div>
          </div>

          <!-- Special Properties -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Special Properties</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="isPerennial"
                  type="checkbox"
                  class="rounded text-garden-600 focus:ring-garden-500"
                >
                <span class="ml-2 text-sm">Perennial</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="canSuccessionPlant"
                  type="checkbox"
                  class="rounded text-garden-600 focus:ring-garden-500"
                >
                <span class="ml-2 text-sm">Succession Planting</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Clear Filters -->
      <div class="flex justify-between items-center">
        <button
          @click="clearAllFilters"
          class="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          Clear All Filters
        </button>
        <div class="text-sm text-gray-600">
          Showing {{ filteredPlants.length }} of {{ totalPlants }} plants
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-garden-500"></div>
      <p class="mt-2 text-gray-600">Loading plants...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Plants Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PlantCard
        v-for="plant in filteredPlants"
        :key="plant.id"
        :plant="plant"
      />
    </div>

    <!-- No Results -->
    <div v-if="!isLoading && !error && filteredPlants.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
      <p class="text-gray-600 mb-4">Try adjusting your search criteria or clearing filters</p>
      <button
        @click="clearAllFilters"
        class="bg-garden-600 text-white px-4 py-2 rounded-lg hover:bg-garden-700 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { usePlantsStore } from '@/stores/plants';
import PlantCard from './PlantCard.vue';
import type { PlantCategory, DifficultyLevel, SunRequirement } from '@/types';

const plantsStore = usePlantsStore();

// Search state
const searchQuery = ref('');
const showAdvancedFilters = ref(false);

// Filter state
const selectedCategories = ref<PlantCategory[]>([]);
const selectedDifficulty = ref<DifficultyLevel[]>([]);
const selectedSunRequirements = ref<SunRequirement[]>([]);
const daysToMaturityMin = ref<number>();
const daysToMaturityMax = ref<number>();
const spacingMin = ref<number>();
const spacingMax = ref<number>();
const isPerennial = ref<boolean>();
const canSuccessionPlant = ref<boolean>();

// Computed
const filteredPlants = computed(() => plantsStore.filteredPlants);
const totalPlants = computed(() => plantsStore.totalPlants);
const isLoading = computed(() => plantsStore.isLoading);
const error = computed(() => plantsStore.error);

// Methods
function handleSearch() {
  plantsStore.setSearchQuery(searchQuery.value);
}

function updateFilters() {
  plantsStore.setSearchFilters({
    category: selectedCategories.value.length > 0 ? selectedCategories.value : undefined,
    difficultyLevel: selectedDifficulty.value.length > 0 ? selectedDifficulty.value : undefined,
    sunRequirement: selectedSunRequirements.value.length > 0 ? selectedSunRequirements.value : undefined,
    daysToMaturityMin: daysToMaturityMin.value,
    daysToMaturityMax: daysToMaturityMax.value,
    spacingMin: spacingMin.value,
    spacingMax: spacingMax.value,
    isPerennial: isPerennial.value,
    canSuccessionPlant: canSuccessionPlant.value
  });
}

function clearAllFilters() {
  searchQuery.value = '';
  selectedCategories.value = [];
  selectedDifficulty.value = [];
  selectedSunRequirements.value = [];
  daysToMaturityMin.value = undefined;
  daysToMaturityMax.value = undefined;
  spacingMin.value = undefined;
  spacingMax.value = undefined;
  isPerennial.value = undefined;
  canSuccessionPlant.value = undefined;
  
  plantsStore.clearSearch();
}

// Watch for filter changes
watch([
  selectedCategories,
  selectedDifficulty,
  selectedSunRequirements,
  daysToMaturityMin,
  daysToMaturityMax,
  spacingMin,
  spacingMax,
  isPerennial,
  canSuccessionPlant
], updateFilters, { deep: true });
</script>