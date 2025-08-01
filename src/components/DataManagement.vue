<template>
  <div class="data-management space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold text-garden-800 mb-2">💾 Data Management</h2>
      <p class="text-gray-600">Export, import, and backup your garden data. All data is stored locally in your browser.</p>
    </div>

    <!-- Database Statistics -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Database Statistics</h3>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="text-center p-4 bg-garden-50 rounded-lg">
          <div class="text-2xl font-bold text-garden-600">{{ stats.plants }}</div>
          <div class="text-sm text-gray-600">Plants</div>
        </div>
        <div class="text-center p-4 bg-earth-50 rounded-lg">
          <div class="text-2xl font-bold text-earth-600">{{ stats.seeds }}</div>
          <div class="text-sm text-gray-600">Seeds</div>
        </div>
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ stats.gardens }}</div>
          <div class="text-sm text-gray-600">Gardens</div>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">{{ stats.schedules }}</div>
          <div class="text-sm text-gray-600">Schedules</div>
        </div>
      </div>

      <button
        @click="refreshStats"
        :disabled="loading"
        class="btn-secondary text-sm"
      >
        <span v-if="loading" class="animate-spin mr-2">⟳</span>
        Refresh Stats
      </button>
    </div>

    <!-- Export Data -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">📤 Export Data</h3>
      <p class="text-gray-600 mb-6">Download your garden data for backup or sharing.</p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Export All Data (JSON) -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-2">Complete Backup (JSON)</h4>
          <p class="text-sm text-gray-600 mb-4">Full database backup including all plants, seeds, gardens, and schedules.</p>
          <button
            @click="exportJSON"
            :disabled="loading"
            class="btn-primary w-full text-sm"
          >
            <span v-if="loading" class="animate-spin mr-2">⟳</span>
            Download JSON
          </button>
        </div>

        <!-- Export Plants (CSV) -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-2">Plants Database (CSV)</h4>
          <p class="text-sm text-gray-600 mb-4">Plant information in spreadsheet format for analysis.</p>
          <button
            @click="exportPlantsCSV"
            :disabled="loading"
            class="btn-primary w-full text-sm"
          >
            <span v-if="loading" class="animate-spin mr-2">⟳</span>
            Download CSV
          </button>
        </div>

        <!-- Export Seeds (CSV) -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-2">Seed Inventory (CSV)</h4>
          <p class="text-sm text-gray-600 mb-4">Seed inventory in spreadsheet format for tracking.</p>
          <button
            @click="exportSeedsCSV"
            :disabled="loading || stats.seeds === 0"
            class="btn-primary w-full text-sm"
            :class="{ 'opacity-50': stats.seeds === 0 }"
          >
            <span v-if="loading" class="animate-spin mr-2">⟳</span>
            Download CSV
          </button>
          <p v-if="stats.seeds === 0" class="text-xs text-gray-500 mt-2">No seeds to export</p>
        </div>
      </div>
    </div>

    <!-- Import Data -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">📥 Import Data</h3>
      <p class="text-gray-600 mb-6">Import garden data from a JSON backup file.</p>
      
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          @change="handleFileSelect"
          class="hidden"
        >
        
        <div class="space-y-4">
          <div class="text-4xl">📁</div>
          <div>
            <p class="text-lg font-medium text-gray-900">Choose a backup file to import</p>
            <p class="text-sm text-gray-600">Select a JSON file exported from Garden Gnome</p>
          </div>
          
          <button
            @click="($refs.fileInput as HTMLInputElement)?.click()"
            :disabled="loading"
            class="btn-primary"
          >
            <span v-if="loading" class="animate-spin mr-2">⟳</span>
            Select File
          </button>
        </div>
      </div>

      <!-- Import Options -->
      <div v-if="selectedFile" class="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 class="font-medium text-gray-900 mb-3">Import Options</h4>
        <div class="space-y-3">
          <label class="flex items-center">
            <input
              v-model="importOptions.clearExisting"
              type="checkbox"
              class="rounded text-garden-600 focus:ring-garden-500"
            >
            <span class="ml-2 text-sm text-gray-700">Clear existing data before import</span>
          </label>
          <p class="text-xs text-gray-600">
            ⚠️ Warning: This will permanently delete all current data. Make sure you have a backup!
          </p>
        </div>
        
        <div class="mt-4 flex space-x-3">
          <button
            @click="importData"
            :disabled="loading"
            class="btn-primary"
          >
            <span v-if="loading" class="animate-spin mr-2">⟳</span>
            Import Data
          </button>
          <button
            @click="cancelImport"
            class="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Clear Data -->
    <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
      <h3 class="text-lg font-semibold text-red-900 mb-4">🗑️ Clear All Data</h3>
      <p class="text-red-700 mb-6">
        <strong>Danger Zone:</strong> This will permanently delete all your garden data including plants, seeds, gardens, and schedules.
      </p>
      
      <div v-if="!showClearConfirmation" class="space-y-4">
        <button
          @click="showClearConfirmation = true"
          class="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Clear All Data
        </button>
      </div>

      <div v-else class="space-y-4">
        <div class="bg-red-50 p-4 rounded-lg">
          <p class="text-red-800 font-medium mb-2">Are you absolutely sure?</p>
          <p class="text-red-700 text-sm mb-4">
            This action cannot be undone. All your plants, seeds, gardens, and schedules will be permanently deleted.
          </p>
          <div class="flex space-x-3">
            <button
              @click="clearAllData"
              :disabled="loading"
              class="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <span v-if="loading" class="animate-spin mr-2">⟳</span>
              Yes, Delete Everything
            </button>
            <button
              @click="showClearConfirmation = false"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="fixed bottom-4 right-4 max-w-md z-50">
      <div
        :class="[
          'p-4 rounded-lg shadow-lg',
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        ]"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <p class="font-medium">{{ message.title }}</p>
            <p v-if="message.details" class="text-sm mt-1">{{ message.details }}</p>
          </div>
          <button
            @click="message = null"
            class="ml-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dataExportService } from '@/services/dataExport';
import { dbService } from '@/services/database';
import type { DataImportResult } from '@/types';

// State
const stats = ref({ plants: 0, seeds: 0, gardens: 0, schedules: 0 });
const loading = ref(false);
const selectedFile = ref<File | null>(null);
const showClearConfirmation = ref(false);
const message = ref<{
  type: 'success' | 'error' | 'info';
  title: string;
  details?: string;
} | null>(null);

const importOptions = ref({
  clearExisting: false
});

// Methods
async function refreshStats() {
  loading.value = true;
  try {
    stats.value = await dataExportService.getStats();
  } catch (error) {
    showMessage('error', 'Failed to load statistics', error instanceof Error ? error.message : 'Unknown error');
  } finally {
    loading.value = false;
  }
}

async function exportJSON() {
  loading.value = true;
  try {
    await dataExportService.downloadJSON();
    showMessage('success', 'Export successful', 'Your garden data has been downloaded as JSON');
  } catch (error) {
    showMessage('error', 'Export failed', error instanceof Error ? error.message : 'Unknown error');
  } finally {
    loading.value = false;
  }
}

async function exportPlantsCSV() {
  loading.value = true;
  try {
    await dataExportService.downloadPlantsCSV();
    showMessage('success', 'Export successful', 'Your plant database has been downloaded as CSV');
  } catch (error) {
    showMessage('error', 'Export failed', error instanceof Error ? error.message : 'Unknown error');
  } finally {
    loading.value = false;
  }
}

async function exportSeedsCSV() {
  loading.value = true;
  try {
    await dataExportService.downloadSeedInventoryCSV();
    showMessage('success', 'Export successful', 'Your seed inventory has been downloaded as CSV');
  } catch (error) {
    showMessage('error', 'Export failed', error instanceof Error ? error.message : 'Unknown error');
  } finally {
    loading.value = false;
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
}

async function importData() {
  if (!selectedFile.value) return;
  
  loading.value = true;
  try {
    if (importOptions.value.clearExisting) {
      await dataExportService.clearAllData();
    }
    
    const result: DataImportResult = await dataExportService.importFromFile(selectedFile.value);
    
    if (result.success) {
      showMessage('success', 'Import successful', 
        `Imported ${result.imported.plants} plants, ${result.imported.seeds} seeds, ${result.imported.gardens} gardens, and ${result.imported.schedules} schedules`
      );
      await refreshStats();
    } else {
      showMessage('error', 'Import failed', result.message);
    }
  } catch (error) {
    showMessage('error', 'Import failed', error instanceof Error ? error.message : 'Unknown error');
  } finally {
    loading.value = false;
    cancelImport();
  }
}

function cancelImport() {
  selectedFile.value = null;
  importOptions.value.clearExisting = false;
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
}

async function clearAllData() {
  loading.value = true;
  try {
    await dataExportService.clearAllData();
    showMessage('success', 'Data cleared', 'All garden data has been permanently deleted');
    await refreshStats();
  } catch (error) {
    showMessage('error', 'Clear failed', error instanceof Error ? error.message : 'Unknown error');
  } finally {
    loading.value = false;
    showClearConfirmation.value = false;
  }
}

function showMessage(type: 'success' | 'error' | 'info', title: string, details?: string) {
  message.value = { type, title, details };
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (message.value?.type === 'success') {
        message.value = null;
      }
    }, 5000);
  }
}

// Lifecycle
onMounted(refreshStats);
</script>