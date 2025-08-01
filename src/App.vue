<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Title -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-garden-800 flex items-center">
                🏡 Garden Gnome
              </h1>
            </div>
            <nav class="hidden md:ml-8 md:flex md:space-x-8">
              <button
                @click="activeTab = 'plants'"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  activeTab === 'plants' 
                    ? 'bg-garden-100 text-garden-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                ]"
              >
                🌱 Plant Database
              </button>
              <button
                @click="activeTab = 'seeds'"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  activeTab === 'seeds' 
                    ? 'bg-garden-100 text-garden-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                ]"
              >
                📦 Seed Inventory
              </button>
              <button
                @click="activeTab = 'data'"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  activeTab === 'data' 
                    ? 'bg-garden-100 text-garden-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                ]"
              >
                💾 Data Management
              </button>
            </nav>
          </div>

          <!-- Stats -->
          <div class="flex items-center space-x-4">
            <div class="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
              <span class="flex items-center">
                <span class="text-garden-600 mr-1">🌱</span>
                {{ stats.plants }} plants
              </span>
              <span class="flex items-center">
                <span class="text-earth-600 mr-1">📦</span>
                {{ stats.seeds }} seeds
              </span>
            </div>
            
            <!-- Offline Indicator -->
            <div 
              v-if="!isOnline"
              class="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
            >
              <span class="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
              Offline
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div class="md:hidden border-t border-gray-200">
        <div class="px-4 py-3 space-y-1">
          <button
            @click="activeTab = 'plants'"
            :class="[
              'block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === 'plants' 
                ? 'bg-garden-100 text-garden-700' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            🌱 Plant Database
          </button>
          <button
            @click="activeTab = 'seeds'"
            :class="[
              'block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === 'seeds' 
                ? 'bg-garden-100 text-garden-700' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            📦 Seed Inventory
          </button>
          <button
            @click="activeTab = 'data'"
            :class="[
              'block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === 'data' 
                ? 'bg-garden-100 text-garden-700' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            💾 Data Management
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Plant Database Tab -->
      <div v-if="activeTab === 'plants'">
        <PlantSearch />
      </div>

      <!-- Seed Inventory Tab -->
      <div v-else-if="activeTab === 'seeds'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold text-garden-800 mb-4">📦 Seed Inventory</h2>
          <p class="text-gray-600 mb-6">Manage your seed collection and track expiration dates</p>
          
          <div class="text-center py-12">
            <div class="text-6xl mb-4">🚧</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p class="text-gray-600">Seed inventory management features will be available in the next update.</p>
          </div>
        </div>
      </div>

      <!-- Data Management Tab -->
      <div v-else-if="activeTab === 'data'" class="space-y-6">
        <DataManagement />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-600">
          <p class="mb-2">
            <strong>Garden Gnome</strong> - Smart Garden Planning with Square Foot Gardening
          </p>
          <p class="text-sm">
            Offline-first garden management • Local data storage • Open source
          </p>
          <div class="mt-4 flex justify-center items-center space-x-4 text-xs">
            <span>Database: {{ stats.plants }} plants, {{ stats.seeds }} seeds</span>
            <span>•</span>
            <span>Storage: Local IndexedDB</span>
            <span>•</span>
            <span v-if="isOnline" class="text-green-600">Online</span>
            <span v-else class="text-yellow-600">Offline Mode</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useOnline } from '@vueuse/core';
import { usePlantsStore } from './stores/plants';
import { dbService } from './services/database';
import PlantSearch from './components/PlantSearch.vue';
import DataManagement from './components/DataManagement.vue';

// State
const activeTab = ref<'plants' | 'seeds' | 'data'>('plants');
const stats = ref({ plants: 0, seeds: 0, gardens: 0, schedules: 0 });

// Composables
const isOnline = useOnline();
const plantsStore = usePlantsStore();

// Computed
const computedStats = computed(() => ({
  plants: plantsStore.totalPlants,
  seeds: plantsStore.totalSeeds,
  gardens: stats.value.gardens,
  schedules: stats.value.schedules
}));

// Methods
async function loadStats() {
  try {
    stats.value = await dbService.getStats();
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Lifecycle
onMounted(async () => {
  await loadStats();
  
  // Update stats periodically
  setInterval(loadStats, 30000); // Every 30 seconds
});

// Use computed stats for display
const displayStats = computed(() => computedStats.value);
</script>