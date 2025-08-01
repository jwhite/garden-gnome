# Garden Gnome - Smart Garden Planning Application

A comprehensive garden planning and management application built with Vue.js 3, featuring offline-first architecture and local data storage.

## Features Implemented

### ✅ F1.1 - Local Data Management System
- **IndexedDB Integration**: Using Dexie.js for robust local data storage
- **Offline-First Architecture**: Complete functionality without internet connection
- **Data Export/Import**: JSON and CSV export formats
- **Data Backup & Restore**: Full database backup capabilities
- **Browser Storage**: All data stored locally with user ownership

### ✅ F1.3 - Enhanced Plant Database (200+ Varieties)
- **Comprehensive Plant Database**: 200+ vegetable and herb varieties
- **Advanced Search & Filtering**: Multiple search criteria and filters
- **Detailed Plant Information**: 
  - Growing characteristics (sun, water, soil requirements)
  - Timing data (days to maturity, planting schedules)
  - Companion planting relationships
  - Growing tips and cultivation advice
  - Nutritional and culinary information
- **Plant Categories**: Vegetables, herbs, fruits, leafy greens, roots, legumes, etc.
- **Difficulty Levels**: Beginner, intermediate, and advanced classifications

## Technology Stack

- **Frontend**: Vue.js 3 with Composition API + TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: Pinia for reactive state management
- **Database**: IndexedDB with Dexie.js for local data persistence
- **Styling**: Tailwind CSS with custom garden-themed colors
- **Offline Support**: Service workers and local storage
- **Responsive Design**: Mobile-first responsive interface

## Project Structure

```
src/
├── components/          # Vue components
│   ├── PlantSearch.vue  # Plant database search interface
│   ├── PlantCard.vue    # Individual plant display cards
│   └── DataManagement.vue # Data export/import interface
├── services/            # Business logic services
│   ├── database.ts      # IndexedDB database service
│   └── dataExport.ts    # Data export/import service
├── stores/              # Pinia state stores
│   └── plants.ts        # Plants and seed inventory store
├── types/               # TypeScript type definitions
│   └── index.ts         # Core data types
├── data/                # Static data
│   └── plants.ts        # Plant database with 200+ varieties
└── style.css           # Global styles and Tailwind imports
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Navigate to the application directory**:
   ```bash
   cd garden-gnome-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Navigate to `http://localhost:3000`
   - The application will automatically initialize with the plant database

### Build for Production

```bash
npm run build
```

The production build will be available in the `dist/` directory.

## Key Features

### Plant Database
- **Search Functionality**: Search by name, variety, or description
- **Advanced Filters**: Category, difficulty, sun requirements, days to maturity
- **Plant Details**: Comprehensive growing information and tips
- **Companion Planting**: Shows beneficial and antagonistic plant relationships

### Data Management
- **Local Storage**: All data stored in browser's IndexedDB
- **Export Options**: 
  - Complete backup (JSON format)
  - Plant database (CSV format)
  - Seed inventory (CSV format)
- **Import Functionality**: Restore from JSON backup files
- **Data Statistics**: Real-time database statistics

### Offline-First Design
- **Complete Offline Functionality**: Works without internet connection
- **Local Data Persistence**: Data survives browser restarts
- **Progressive Web App**: Installable on mobile devices
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## Data Model

### Plant Schema
```typescript
interface Plant {
  id: string;
  name: string;
  variety: string;
  category: PlantCategory;
  daysToMaturity: number;
  spacingInches: number;
  sunRequirement: SunRequirement;
  waterRequirement: WaterRequirement;
  difficultyLevel: DifficultyLevel;
  companionPlants: string[];
  antagonistPlants: string[];
  // ... additional fields
}
```

### Seed Inventory Schema
```typescript
interface SeedInventory {
  id: string;
  plantId: string;
  vendor: string;
  purchaseDate: Date;
  expirationDate: Date;
  quantity: number;
  // ... additional tracking fields
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

*IndexedDB and modern JavaScript features required*

## License

MIT License - see LICENSE file for details

## Roadmap

### Phase 1.2 (Next Release)
- Enhanced seed inventory management
- Basic garden layout creator
- Planting schedule generator

### Phase 2 (Future)
- Weather integration
- Advanced garden planning tools
- Community features
- Mobile app versions

---

**Garden Gnome** - Making garden planning simple, smart, and accessible offline! 🌱🏠