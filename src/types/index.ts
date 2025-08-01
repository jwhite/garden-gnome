// Core data types for Garden Gnome application

export interface Plant {
  id: string;
  name: string;
  variety: string;
  scientificName?: string;
  category: PlantCategory;
  daysToMaturity: number;
  spacingInches: number;
  plantingDepthInches: number;
  sunRequirement: SunRequirement;
  waterRequirement: WaterRequirement;
  soilPH: {
    min: number;
    max: number;
  };
  temperature: {
    minGermination: number;
    maxGermination: number;
    growingMin: number;
    growingMax: number;
  };
  harvestWindow: number; // days
  successivePlantingInterval?: number; // days
  companionPlants: string[]; // plant IDs
  antagonistPlants: string[]; // plant IDs
  rotationFamily: RotationFamily;
  difficultyLevel: DifficultyLevel;
  isPerennial: boolean;
  description: string;
  growingTips: string;
  commonPests: string[];
  commonDiseases: string[];
  nutritionalValue?: string;
  culinaryUses?: string;
  storageInfo?: string;
  seedStartingWeeksBeforeLastFrost?: number;
  directSowWeeksBeforeAfterLastFrost?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeedInventory {
  id: string;
  plantId: string;
  plantName: string; // denormalized for quick access
  variety: string;
  vendor: string;
  purchaseDate: Date;
  expirationDate: Date;
  quantity: number;
  unitType: SeedUnitType;
  lotNumber?: string;
  germinationRate?: number; // percentage
  germinationTestDate?: Date;
  costPerUnit?: number;
  organicCertified: boolean;
  treatmentType?: TreatmentType;
  storageLocation?: string;
  notes?: string;
  isCustomVariety: boolean;
  parentSeedId?: string; // for saved seeds
  createdAt: Date;
  updatedAt: Date;
}

export interface Garden {
  id: string;
  name: string;
  description?: string;
  dimensions: {
    width: number; // in feet
    height: number; // in feet
  };
  squares: GardenSquare[];
  location: {
    latitude?: number;
    longitude?: number;
    address?: string;
    hardinessZone?: string;
    lastFrostDate?: Date;
    firstFrostDate?: Date;
  };
  soilType?: SoilType;
  sunExposure: SunExposure;
  irrigationType?: IrrigationType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GardenSquare {
  id: string;
  x: number; // grid position
  y: number; // grid position
  plantId?: string;
  plantedDate?: Date;
  expectedHarvestDate?: Date;
  actualHarvestDate?: Date;
  quantity?: number;
  notes?: string;
  status: PlantingStatus;
  yieldAmount?: number;
  yieldUnit?: string;
  successRating?: number; // 1-5 scale
}

export interface PlantingSchedule {
  id: string;
  gardenId: string;
  plantId: string;
  squareIds: string[];
  plannedStartDate: Date;
  plannedPlantOutDate?: Date;
  plannedHarvestStartDate: Date;
  plannedHarvestEndDate: Date;
  actualStartDate?: Date;
  actualPlantOutDate?: Date;
  actualHarvestStartDate?: Date;
  actualHarvestEndDate?: Date;
  quantity: number;
  isSuccessionPlanting: boolean;
  successionGroup?: string;
  notes?: string;
  reminders: PlantingReminder[];
  status: ScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlantingReminder {
  id: string;
  type: ReminderType;
  date: Date;
  message: string;
  completed: boolean;
  completedAt?: Date;
}

export interface UserPreferences {
  id: string;
  location: {
    hardinessZone: string;
    lastFrostDate: Date;
    firstFrostDate: Date;
    latitude?: number;
    longitude?: number;
  };
  units: 'metric' | 'imperial';
  experienceLevel: DifficultyLevel;
  favoriteCategories: PlantCategory[];
  gardeningStyle: GardeningStyle[];
  notifications: {
    enabled: boolean;
    reminderTypes: ReminderType[];
    frequency: NotificationFrequency;
  };
  dataSync: {
    lastBackup?: Date;
    autoBackup: boolean;
    backupFrequency: BackupFrequency;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Enums and Union Types
export type PlantCategory = 
  | 'vegetable'
  | 'fruit'
  | 'herb'
  | 'flower'
  | 'grain'
  | 'legume'
  | 'root'
  | 'leafy-green'
  | 'brassica'
  | 'nightshade'
  | 'squash'
  | 'allium';

export type SunRequirement = 'full-sun' | 'partial-sun' | 'partial-shade' | 'full-shade';

export type WaterRequirement = 'low' | 'moderate' | 'high';

export type RotationFamily = 
  | 'nightshade'
  | 'brassica'
  | 'legume'
  | 'allium'
  | 'squash'
  | 'root'
  | 'leafy-green'
  | 'grain'
  | 'perennial';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type SeedUnitType = 'seeds' | 'grams' | 'ounces' | 'packets';

export type TreatmentType = 'untreated' | 'organic-treated' | 'conventional-treated' | 'pelleted';

export type SoilType = 'clay' | 'sand' | 'loam' | 'silt' | 'chalk' | 'peat';

export type SunExposure = 'full-sun' | 'partial-sun' | 'partial-shade' | 'full-shade' | 'mixed';

export type IrrigationType = 'hand-watering' | 'drip' | 'sprinkler' | 'soaker-hose' | 'rain-only';

export type PlantingStatus = 
  | 'empty'
  | 'planned'
  | 'seeded'
  | 'germinated'
  | 'transplanted'
  | 'growing'
  | 'flowering'
  | 'fruiting'
  | 'harvesting'
  | 'harvested'
  | 'composted'
  | 'failed';

export type ScheduleStatus = 'planned' | 'active' | 'completed' | 'cancelled' | 'delayed';

export type ReminderType = 
  | 'seed-start'
  | 'transplant'
  | 'direct-sow'
  | 'water'
  | 'fertilize'
  | 'thin'
  | 'harvest'
  | 'pest-check'
  | 'disease-check'
  | 'succession-plant';

export type GardeningStyle = 
  | 'square-foot'
  | 'container'
  | 'raised-bed'
  | 'in-ground'
  | 'hydroponic'
  | 'vertical'
  | 'greenhouse'
  | 'permaculture';

export type NotificationFrequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly';

export type BackupFrequency = 'daily' | 'weekly' | 'monthly' | 'manual';

// Search and Filter Types
export interface PlantSearchCriteria {
  name?: string;
  category?: PlantCategory[];
  sunRequirement?: SunRequirement[];
  waterRequirement?: WaterRequirement[];
  difficultyLevel?: DifficultyLevel[];
  daysToMaturityMin?: number;
  daysToMaturityMax?: number;
  spacingMin?: number;
  spacingMax?: number;
  isPerennial?: boolean;
  canSuccessionPlant?: boolean;
}

export interface PlantSearchResult {
  plants: Plant[];
  total: number;
  page: number;
  pageSize: number;
}

// Data Export/Import Types
export interface GardenDataExport {
  version: string;
  exportDate: Date;
  gardens: Garden[];
  plants: Plant[];
  seedInventory: SeedInventory[];
  schedules: PlantingSchedule[];
  preferences: UserPreferences;
}

export interface DataImportResult {
  success: boolean;
  message: string;
  imported: {
    gardens: number;
    plants: number;
    seeds: number;
    schedules: number;
  };
  errors: Array<{
    type: string;
    message: string;
    data?: any;
  }>;
}