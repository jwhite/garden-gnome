import Dexie, { type EntityTable } from 'dexie';
import type { 
  Plant, 
  SeedInventory, 
  Garden, 
  PlantingSchedule, 
  UserPreferences,
  GardenDataExport,
  DataImportResult
} from '@/types';

// Database schema definition
export class GardenGnomeDB extends Dexie {
  plants!: EntityTable<Plant, 'id'>;
  seedInventory!: EntityTable<SeedInventory, 'id'>;
  gardens!: EntityTable<Garden, 'id'>;
  schedules!: EntityTable<PlantingSchedule, 'id'>;
  preferences!: EntityTable<UserPreferences, 'id'>;

  constructor() {
    super('GardenGnomeDB');
    
    // Define schemas for each table
    this.version(1).stores({
      plants: '++id, name, variety, category, daysToMaturity, difficultyLevel, rotationFamily, isPerennial, [category+difficultyLevel]',
      seedInventory: '++id, plantId, plantName, vendor, purchaseDate, expirationDate, quantity, organicCertified, isCustomVariety',
      gardens: '++id, name, isActive, createdAt',
      schedules: '++id, gardenId, plantId, plannedStartDate, plannedHarvestStartDate, status, isSuccessionPlanting',
      preferences: '++id, createdAt'
    });

    // Add hooks for automatic timestamps
    this.plants.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.plants.hook('updating', (modifications: any) => {
      modifications.updatedAt = new Date();
    });

    this.seedInventory.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.seedInventory.hook('updating', (modifications: any) => {
      modifications.updatedAt = new Date();
    });

    this.gardens.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.gardens.hook('updating', (modifications: any) => {
      modifications.updatedAt = new Date();
    });

    this.schedules.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.schedules.hook('updating', (modifications: any) => {
      modifications.updatedAt = new Date();
    });

    this.preferences.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.preferences.hook('updating', (modifications: any) => {
      modifications.updatedAt = new Date();
    });
  }
}

// Create database instance
export const db = new GardenGnomeDB();

// Database service class with CRUD operations and data management
export class DatabaseService {
  private db: GardenGnomeDB;

  constructor() {
    this.db = db;
  }

  // Initialize database with default data
  async initializeDatabase(): Promise<void> {
    try {
      // Check if database is already initialized
      const plantCount = await this.db.plants.count();
      
      if (plantCount === 0) {
        // Initialize with starter plant database
        await this.initializePlantDatabase();
      }

      // Ensure user preferences exist
      const prefsCount = await this.db.preferences.count();
      if (prefsCount === 0) {
        await this.createDefaultPreferences();
      }

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  // Plant operations
  async addPlant(plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID();
    const newPlant: Plant = {
      ...plant,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await this.db.plants.add(newPlant);
    return id;
  }

  async getPlant(id: string): Promise<Plant | undefined> {
    return await this.db.plants.get(id);
  }

  async getAllPlants(): Promise<Plant[]> {
    return await this.db.plants.orderBy('name').toArray();
  }

  async searchPlants(query: string, filters?: any): Promise<Plant[]> {
    let collection = this.db.plants.toCollection();

    // Apply text search
    if (query) {
      collection = collection.filter(plant => 
        plant.name.toLowerCase().includes(query.toLowerCase()) ||
        plant.variety.toLowerCase().includes(query.toLowerCase()) ||
        (plant.scientificName?.toLowerCase().includes(query.toLowerCase()) || false)
      );
    }

    // Apply filters
    if (filters?.category?.length > 0) {
      collection = collection.filter(plant => filters.category.includes(plant.category));
    }

    if (filters?.difficultyLevel?.length > 0) {
      collection = collection.filter(plant => filters.difficultyLevel.includes(plant.difficultyLevel));
    }

    if (filters?.sunRequirement?.length > 0) {
      collection = collection.filter(plant => filters.sunRequirement.includes(plant.sunRequirement));
    }

    if (filters?.daysToMaturityMin !== undefined) {
      collection = collection.filter(plant => plant.daysToMaturity >= filters.daysToMaturityMin);
    }

    if (filters?.daysToMaturityMax !== undefined) {
      collection = collection.filter(plant => plant.daysToMaturity <= filters.daysToMaturityMax);
    }

    return await collection.toArray();
  }

  async updatePlant(id: string, updates: Partial<Plant>): Promise<void> {
    await this.db.plants.update(id, { ...updates, updatedAt: new Date() });
  }

  async deletePlant(id: string): Promise<void> {
    await this.db.plants.delete(id);
  }

  // Seed inventory operations
  async addSeedInventory(seed: Omit<SeedInventory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID();
    const newSeed: SeedInventory = {
      ...seed,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await this.db.seedInventory.add(newSeed);
    return id;
  }

  async getSeedInventory(): Promise<SeedInventory[]> {
    return await this.db.seedInventory.orderBy('plantName').toArray();
  }

  async getSeedsByPlant(plantId: string): Promise<SeedInventory[]> {
    return await this.db.seedInventory.where('plantId').equals(plantId).toArray();
  }

  async updateSeedInventory(id: string, updates: Partial<SeedInventory>): Promise<void> {
    await this.db.seedInventory.update(id, { ...updates, updatedAt: new Date() });
  }

  async deleteSeedInventory(id: string): Promise<void> {
    await this.db.seedInventory.delete(id);
  }

  // Garden operations
  async addGarden(garden: Omit<Garden, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID();
    const newGarden: Garden = {
      ...garden,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await this.db.gardens.add(newGarden);
    return id;
  }

  async getGardens(): Promise<Garden[]> {
    return await this.db.gardens.orderBy('name').toArray();
  }

  async getActiveGardens(): Promise<Garden[]> {
    return await this.db.gardens.where('isActive').equals(1).toArray();
  }

  async updateGarden(id: string, updates: Partial<Garden>): Promise<void> {
    await this.db.gardens.update(id, { ...updates, updatedAt: new Date() });
  }

  async deleteGarden(id: string): Promise<void> {
    // Also delete associated schedules
    await this.db.schedules.where('gardenId').equals(id).delete();
    await this.db.gardens.delete(id);
  }

  // Data export functionality
  async exportData(): Promise<GardenDataExport> {
    const [plants, seedInventory, gardens, schedules, preferences] = await Promise.all([
      this.db.plants.toArray(),
      this.db.seedInventory.toArray(),
      this.db.gardens.toArray(),
      this.db.schedules.toArray(),
      this.db.preferences.toArray()
    ]);

    return {
      version: '1.0.0',
      exportDate: new Date(),
      gardens,
      plants,
      seedInventory,
      schedules,
      preferences: preferences[0] // Should only be one preferences record
    };
  }

  // Data import functionality
  async importData(data: GardenDataExport): Promise<DataImportResult> {
    const result: DataImportResult = {
      success: false,
      message: '',
      imported: { gardens: 0, plants: 0, seeds: 0, schedules: 0 },
      errors: []
    };

    try {
      await this.db.transaction('rw', [this.db.plants, this.db.seedInventory, this.db.gardens, this.db.schedules, this.db.preferences], async () => {
        // Import plants
        if (data.plants?.length > 0) {
          for (const plant of data.plants) {
            try {
              await this.db.plants.put(plant);
              result.imported.plants++;
            } catch (error) {
              result.errors.push({
                type: 'plant',
                message: `Failed to import plant: ${plant.name}`,
                data: plant
              });
            }
          }
        }

        // Import seed inventory
        if (data.seedInventory?.length > 0) {
          for (const seed of data.seedInventory) {
            try {
              await this.db.seedInventory.put(seed);
              result.imported.seeds++;
            } catch (error) {
              result.errors.push({
                type: 'seed',
                message: `Failed to import seed: ${seed.plantName}`,
                data: seed
              });
            }
          }
        }

        // Import gardens
        if (data.gardens?.length > 0) {
          for (const garden of data.gardens) {
            try {
              await this.db.gardens.put(garden);
              result.imported.gardens++;
            } catch (error) {
              result.errors.push({
                type: 'garden',
                message: `Failed to import garden: ${garden.name}`,
                data: garden
              });
            }
          }
        }

        // Import schedules
        if (data.schedules?.length > 0) {
          for (const schedule of data.schedules) {
            try {
              await this.db.schedules.put(schedule);
              result.imported.schedules++;
            } catch (error) {
              result.errors.push({
                type: 'schedule',
                message: `Failed to import schedule`,
                data: schedule
              });
            }
          }
        }

        // Import preferences
        if (data.preferences) {
          try {
            await this.db.preferences.put(data.preferences);
          } catch (error) {
            result.errors.push({
              type: 'preferences',
              message: 'Failed to import preferences',
              data: data.preferences
            });
          }
        }
      });

      result.success = true;
      result.message = `Successfully imported ${result.imported.plants} plants, ${result.imported.seeds} seeds, ${result.imported.gardens} gardens, and ${result.imported.schedules} schedules`;
      
    } catch (error) {
      result.success = false;
      result.message = `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    return result;
  }

  // Clear all data (for reset functionality)
  async clearAllData(): Promise<void> {
    await this.db.transaction('rw', [this.db.plants, this.db.seedInventory, this.db.gardens, this.db.schedules, this.db.preferences], async () => {
      await this.db.plants.clear();
      await this.db.seedInventory.clear();
      await this.db.gardens.clear();
      await this.db.schedules.clear();
      await this.db.preferences.clear();
    });
  }

  // Database statistics
  async getStats(): Promise<{ plants: number; seeds: number; gardens: number; schedules: number }> {
    const [plants, seeds, gardens, schedules] = await Promise.all([
      this.db.plants.count(),
      this.db.seedInventory.count(),
      this.db.gardens.count(),
      this.db.schedules.count()
    ]);

    return { plants, seeds, gardens, schedules };
  }

  // Private helper methods
  private async createDefaultPreferences(): Promise<void> {
    const defaultPrefs: UserPreferences = {
      id: crypto.randomUUID(),
      location: {
        hardinessZone: '6a',
        lastFrostDate: new Date(new Date().getFullYear(), 3, 15), // April 15
        firstFrostDate: new Date(new Date().getFullYear(), 9, 15) // October 15
      },
      units: 'imperial',
      experienceLevel: 'beginner',
      favoriteCategories: ['vegetable', 'herb'],
      gardeningStyle: ['square-foot'],
      notifications: {
        enabled: true,
        reminderTypes: ['seed-start', 'transplant', 'harvest'],
        frequency: 'weekly'
      },
      dataSync: {
        autoBackup: true,
        backupFrequency: 'weekly'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.db.preferences.add(defaultPrefs);
  }

  private async initializePlantDatabase(): Promise<void> {
    // Import the plant database
    const { PLANT_DATABASE } = await import('@/data/plants');
    
    console.log(`Initializing plant database with ${PLANT_DATABASE.length} varieties...`);
    
    // Add each plant to the database
    for (const plantData of PLANT_DATABASE) {
      try {
        await this.addPlant(plantData);
      } catch (error) {
        console.warn(`Failed to add plant ${plantData.name} - ${plantData.variety}:`, error);
      }
    }
    
    console.log('Plant database initialization complete');
  }
}

// Create and export service instance
export const dbService = new DatabaseService();