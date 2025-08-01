import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Plant, PlantSearchCriteria, SeedInventory } from '@/types';
import { dbService } from '@/services/database';

export const usePlantsStore = defineStore('plants', () => {
  // State
  const plants = ref<Plant[]>([]);
  const seedInventory = ref<SeedInventory[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref('');
  const searchFilters = ref<PlantSearchCriteria>({});

  // Computed
  const filteredPlants = computed(() => {
    if (!searchQuery.value && Object.keys(searchFilters.value).length === 0) {
      return plants.value;
    }

    return plants.value.filter(plant => {
      // Text search
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        const matchesText = 
          plant.name.toLowerCase().includes(query) ||
          plant.variety.toLowerCase().includes(query) ||
          plant.scientificName?.toLowerCase().includes(query) ||
          plant.description.toLowerCase().includes(query);
        
        if (!matchesText) return false;
      }

      // Category filter
      if (searchFilters.value.category?.length) {
        if (!searchFilters.value.category.includes(plant.category)) return false;
      }

      // Sun requirement filter
      if (searchFilters.value.sunRequirement?.length) {
        if (!searchFilters.value.sunRequirement.includes(plant.sunRequirement)) return false;
      }

      // Water requirement filter
      if (searchFilters.value.waterRequirement?.length) {
        if (!searchFilters.value.waterRequirement.includes(plant.waterRequirement)) return false;
      }

      // Difficulty level filter
      if (searchFilters.value.difficultyLevel?.length) {
        if (!searchFilters.value.difficultyLevel.includes(plant.difficultyLevel)) return false;
      }

      // Days to maturity range
      if (searchFilters.value.daysToMaturityMin !== undefined) {
        if (plant.daysToMaturity < searchFilters.value.daysToMaturityMin) return false;
      }
      if (searchFilters.value.daysToMaturityMax !== undefined) {
        if (plant.daysToMaturity > searchFilters.value.daysToMaturityMax) return false;
      }

      // Spacing range
      if (searchFilters.value.spacingMin !== undefined) {
        if (plant.spacingInches < searchFilters.value.spacingMin) return false;
      }
      if (searchFilters.value.spacingMax !== undefined) {
        if (plant.spacingInches > searchFilters.value.spacingMax) return false;
      }

      // Perennial filter
      if (searchFilters.value.isPerennial !== undefined) {
        if (plant.isPerennial !== searchFilters.value.isPerennial) return false;
      }

      // Succession planting filter
      if (searchFilters.value.canSuccessionPlant !== undefined) {
        const hasSuccession = plant.successivePlantingInterval !== undefined;
        if (hasSuccession !== searchFilters.value.canSuccessionPlant) return false;
      }

      return true;
    });
  });

  const plantsByCategory = computed(() => {
    const grouped: Record<string, Plant[]> = {};
    plants.value.forEach(plant => {
      if (!grouped[plant.category]) {
        grouped[plant.category] = [];
      }
      grouped[plant.category].push(plant);
    });
    return grouped;
  });

  const totalPlants = computed(() => plants.value.length);
  const totalSeeds = computed(() => seedInventory.value.length);

  // Actions
  async function loadPlants() {
    isLoading.value = true;
    error.value = null;
    
    try {
      plants.value = await dbService.getAllPlants();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load plants';
      console.error('Error loading plants:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function loadSeedInventory() {
    isLoading.value = true;
    error.value = null;
    
    try {
      seedInventory.value = await dbService.getSeedInventory();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load seed inventory';
      console.error('Error loading seed inventory:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function addPlant(plantData: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const id = await dbService.addPlant(plantData);
      const newPlant = await dbService.getPlant(id);
      if (newPlant) {
        plants.value.push(newPlant);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add plant';
      console.error('Error adding plant:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updatePlant(id: string, updates: Partial<Plant>) {
    isLoading.value = true;
    error.value = null;
    
    try {
      await dbService.updatePlant(id, updates);
      const index = plants.value.findIndex(p => p.id === id);
      if (index !== -1) {
        const updatedPlant = await dbService.getPlant(id);
        if (updatedPlant) {
          plants.value[index] = updatedPlant;
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update plant';
      console.error('Error updating plant:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deletePlant(id: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      await dbService.deletePlant(id);
      plants.value = plants.value.filter(p => p.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete plant';
      console.error('Error deleting plant:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function addSeedInventory(seedData: Omit<SeedInventory, 'id' | 'createdAt' | 'updatedAt'>) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const id = await dbService.addSeedInventory(seedData);
      // Reload seed inventory to get the new item
      await loadSeedInventory();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add seed inventory';
      console.error('Error adding seed inventory:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateSeedInventory(id: string, updates: Partial<SeedInventory>) {
    isLoading.value = true;
    error.value = null;
    
    try {
      await dbService.updateSeedInventory(id, updates);
      // Reload seed inventory to get updated data
      await loadSeedInventory();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update seed inventory';
      console.error('Error updating seed inventory:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteSeedInventory(id: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      await dbService.deleteSeedInventory(id);
      seedInventory.value = seedInventory.value.filter(s => s.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete seed inventory';
      console.error('Error deleting seed inventory:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  function setSearchFilters(filters: PlantSearchCriteria) {
    searchFilters.value = { ...filters };
  }

  function clearSearch() {
    searchQuery.value = '';
    searchFilters.value = {};
  }

  function getPlantById(id: string): Plant | undefined {
    return plants.value.find(p => p.id === id);
  }

  function getSeedsByPlantId(plantId: string): SeedInventory[] {
    return seedInventory.value.filter(s => s.plantId === plantId);
  }

  function getCompanionPlants(plantId: string): Plant[] {
    const plant = getPlantById(plantId);
    if (!plant || !plant.companionPlants.length) return [];

    return plant.companionPlants
      .map(companionName => plants.value.find(p => p.name.toLowerCase() === companionName.toLowerCase()))
      .filter((p): p is Plant => p !== undefined);
  }

  function getAntagonistPlants(plantId: string): Plant[] {
    const plant = getPlantById(plantId);
    if (!plant || !plant.antagonistPlants.length) return [];

    return plant.antagonistPlants
      .map(antagonistName => plants.value.find(p => p.name.toLowerCase() === antagonistName.toLowerCase()))
      .filter((p): p is Plant => p !== undefined);
  }

  // Initialize data when store is created
  loadPlants();
  loadSeedInventory();

  return {
    // State
    plants,
    seedInventory,
    isLoading,
    error,
    searchQuery,
    searchFilters,
    
    // Computed
    filteredPlants,
    plantsByCategory,
    totalPlants,
    totalSeeds,
    
    // Actions
    loadPlants,
    loadSeedInventory,
    addPlant,
    updatePlant,
    deletePlant,
    addSeedInventory,
    updateSeedInventory,
    deleteSeedInventory,
    setSearchQuery,
    setSearchFilters,
    clearSearch,
    getPlantById,
    getSeedsByPlantId,
    getCompanionPlants,
    getAntagonistPlants
  };
});