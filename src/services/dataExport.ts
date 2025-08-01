import type { GardenDataExport, DataImportResult } from '@/types';
import { dbService } from './database';

export class DataExportService {
  
  // Export all data to JSON
  async exportToJSON(): Promise<string> {
    try {
      const data = await dbService.exportData();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Export data and trigger download
  async downloadJSON(filename?: string): Promise<void> {
    try {
      const jsonData = await this.exportToJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `garden-gnome-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Export plants to CSV format
  async exportPlantsToCSV(): Promise<string> {
    try {
      const plants = await dbService.getAllPlants();
      
      // CSV headers
      const headers = [
        'Name', 'Variety', 'Scientific Name', 'Category', 'Days to Maturity',
        'Spacing (inches)', 'Planting Depth (inches)', 'Sun Requirement',
        'Water Requirement', 'Soil pH Min', 'Soil pH Max', 'Difficulty Level',
        'Is Perennial', 'Description', 'Growing Tips', 'Companion Plants',
        'Antagonist Plants', 'Rotation Family'
      ];

      // Convert plants to CSV rows
      const rows = plants.map(plant => [
        plant.name,
        plant.variety,
        plant.scientificName || '',
        plant.category,
        plant.daysToMaturity.toString(),
        plant.spacingInches.toString(),
        plant.plantingDepthInches.toString(),
        plant.sunRequirement,
        plant.waterRequirement,
        plant.soilPH.min.toString(),
        plant.soilPH.max.toString(),
        plant.difficultyLevel,
        plant.isPerennial.toString(),
        plant.description,
        plant.growingTips,
        plant.companionPlants.join('; '),
        plant.antagonistPlants.join('; '),
        plant.rotationFamily
      ]);

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
        .join('\n');

      return csvContent;
    } catch (error) {
      throw new Error(`CSV export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Download plants as CSV
  async downloadPlantsCSV(filename?: string): Promise<void> {
    try {
      const csvData = await this.exportPlantsToCSV();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `garden-gnome-plants-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error(`CSV download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Export seed inventory to CSV
  async exportSeedInventoryToCSV(): Promise<string> {
    try {
      const seeds = await dbService.getSeedInventory();
      
      // CSV headers
      const headers = [
        'Plant Name', 'Variety', 'Vendor', 'Purchase Date', 'Expiration Date',
        'Quantity', 'Unit Type', 'Lot Number', 'Germination Rate (%)',
        'Cost Per Unit', 'Organic Certified', 'Treatment Type',
        'Storage Location', 'Notes', 'Is Custom Variety'
      ];

      // Convert seeds to CSV rows
      const rows = seeds.map(seed => [
        seed.plantName,
        seed.variety,
        seed.vendor,
        seed.purchaseDate.toISOString().split('T')[0],
        seed.expirationDate.toISOString().split('T')[0],
        seed.quantity.toString(),
        seed.unitType,
        seed.lotNumber || '',
        seed.germinationRate?.toString() || '',
        seed.costPerUnit?.toString() || '',
        seed.organicCertified.toString(),
        seed.treatmentType || '',
        seed.storageLocation || '',
        seed.notes || '',
        seed.isCustomVariety.toString()
      ]);

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
        .join('\n');

      return csvContent;
    } catch (error) {
      throw new Error(`Seed inventory CSV export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Download seed inventory as CSV
  async downloadSeedInventoryCSV(filename?: string): Promise<void> {
    try {
      const csvData = await this.exportSeedInventoryToCSV();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `garden-gnome-seeds-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error(`Seed inventory CSV download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Import data from JSON
  async importFromJSON(jsonData: string): Promise<DataImportResult> {
    try {
      const data: GardenDataExport = JSON.parse(jsonData);
      
      // Validate data structure
      if (!this.validateImportData(data)) {
        throw new Error('Invalid data format');
      }

      return await dbService.importData(data);
    } catch (error) {
      return {
        success: false,
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        imported: { gardens: 0, plants: 0, seeds: 0, schedules: 0 },
        errors: [{
          type: 'general',
          message: error instanceof Error ? error.message : 'Unknown error'
        }]
      };
    }
  }

  // Import data from file
  async importFromFile(file: File): Promise<DataImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const result = await this.importFromJSON(content);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            message: `File reading failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            imported: { gardens: 0, plants: 0, seeds: 0, schedules: 0 },
            errors: [{
              type: 'file',
              message: error instanceof Error ? error.message : 'Unknown error'
            }]
          });
        }
      };

      reader.onerror = () => {
        resolve({
          success: false,
          message: 'Failed to read file',
          imported: { gardens: 0, plants: 0, seeds: 0, schedules: 0 },
          errors: [{
            type: 'file',
            message: 'File reading error'
          }]
        });
      };

      reader.readAsText(file);
    });
  }

  // Get database statistics
  async getStats(): Promise<{ plants: number; seeds: number; gardens: number; schedules: number }> {
    return await dbService.getStats();
  }

  // Clear all data (with confirmation)
  async clearAllData(): Promise<void> {
    await dbService.clearAllData();
  }

  // Validate import data structure
  private validateImportData(data: any): data is GardenDataExport {
    if (!data || typeof data !== 'object') return false;
    
    // Check required fields
    if (!data.version || !data.exportDate) return false;
    
    // Check arrays exist (can be empty)
    if (!Array.isArray(data.plants)) return false;
    if (!Array.isArray(data.seedInventory)) return false;
    if (!Array.isArray(data.gardens)) return false;
    if (!Array.isArray(data.schedules)) return false;
    
    return true;
  }

  // Create backup with confirmation
  async createBackup(includeSettings: boolean = true): Promise<string> {
    const data = await dbService.exportData();
    
    if (!includeSettings) {
      // Remove preferences from backup
      delete (data as any).preferences;
    }
    
    return JSON.stringify(data, null, 2);
  }

  // Restore from backup
  async restoreFromBackup(backupData: string, clearExisting: boolean = false): Promise<DataImportResult> {
    try {
      if (clearExisting) {
        await this.clearAllData();
      }
      
      return await this.importFromJSON(backupData);
    } catch (error) {
      throw new Error(`Backup restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Create and export service instance
export const dataExportService = new DataExportService();