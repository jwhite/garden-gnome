import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.css';

// Initialize database
import { dbService } from './services/database';
import { PLANT_DATABASE } from './data/plants';

// Initialize the database with plant data
async function initializeApp() {
  try {
    // Initialize database
    await dbService.initializeDatabase();
    
    // Check if plants are already loaded
    const stats = await dbService.getStats();
    
    if (stats.plants === 0) {
      console.log('Loading initial plant database...');
      
      // Add all plants from our database
      for (const plantData of PLANT_DATABASE) {
        try {
          await dbService.addPlant(plantData);
        } catch (error) {
          console.warn(`Failed to add plant ${plantData.name} - ${plantData.variety}:`, error);
        }
      }
      
      console.log(`Loaded ${PLANT_DATABASE.length} plants into database`);
    }
    
    console.log('Database initialization complete:', await dbService.getStats());
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Create and mount the app
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Initialize database before mounting
initializeApp().then(() => {
  app.mount('#app');
}).catch(error => {
  console.error('App initialization failed:', error);
  // Mount app anyway with fallback behavior
  app.mount('#app');
});