# Entain - Next to Go Races

A modern, real-time single page application that displays the next 5 upcoming races from the Neds Racing API. Built with Vue.js 3, Pinia, and Tailwind CSS.

![Next to Go](https://img.shields.io/badge/Vue.js-3.5-green)
![Pinia](https://img.shields.io/badge/Pinia-2.2-yellow)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)
![Vitest](https://img.shields.io/badge/Vitest-4.0-brightgreen)
![Tests](https://img.shields.io/badge/tests-100%20passing-success)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

## Features

### Core Functionality
- **Real-time Race Display**: Shows 5 upcoming races sorted by start time
- **Live Countdown Timers**: Each race displays a countdown to its start time
- **Auto-refresh**: Automatically fetches new race data every 30 seconds
- **Smart Filtering**: Races automatically disappear 1 minute after their start time
- **Category Toggle**: Filter races by Greyhound, Harness, or Horse racing

### Technical Highlights
- **Vue.js 3**: Modern reactive framework with Composition API
- **Pinia**: Official state management with clean, intuitive API
- **Tailwind CSS**: Custom-configured with Entain/Neds branding colors
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Polished transitions when races enter/leave the list
- **Comprehensive Testing**: 100 tests with 100% coverage using Vitest


## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser

### Installation

1. **Clone the repository** (or navigate to the project directory)
   ```bash
   cd entain-next-to-go
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   The project includes a `.env` file with the racing category IDs and API configuration:
   
   ```bash
   # Racing Category IDs
   VITE_GREYHOUND_CATEGORY_ID=
   VITE_HARNESS_CATEGORY_ID=
   VITE_HORSE_CATEGORY_ID=
   
   # API Configuration
   VITE_API_BASE_URL=https://api.neds.com.au/rest/v1/racing/
   ```
   


4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173` (or the URL shown in terminal)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm test
```

See the [Testing](#testing) section below for more test commands and options.

## API Integration

This application uses the Neds Racing API:

**Endpoint**: `https://api.neds.com.au/rest/v1/racing/`

**Method**: `nextraces`

**Parameters**:
- `count`: Number of races to fetch (default: 10)

### API Response Structure

The API returns race data including:
- `race_id`: Unique identifier
- `meeting_name`: Name of the racing venue
- `race_number`: Race number at the venue
- `advertised_start`: Race start time (Unix timestamp)
- `category_id`: Category identifier (Greyhound/Harness/Horse)
- `venue_name`, `venue_state`, `venue_country`: Location details

## State Management with Pinia

The application uses Pinia for centralized state management with the following features:

### Race Store (`raceStore.js`)

**State**:
- `races`: Array of all fetched races
- `loading`: Loading state indicator
- `error`: Error message if API fails
- `selectedCategories`: Set of active category filters
- `lastFetchTime`: Timestamp of last successful fetch

**Computed Properties**:
- `filteredRaces`: Automatically filters, sorts, and limits races based on:
  - Selected categories
  - Race start time (removes races > 1 min past start)
  - Time ascending sort
  - First 5 races only

**Actions**:
- `loadRaces()`: Fetch fresh race data from API
- `toggleCategory(id)`: Toggle category filter on/off
- `isCategorySelected(id)`: Check if category is active
- `getCategoryById(id)`: Get category details

## Accessibility

This project attempt to meet WCAG 2.1 Level AA standards.



## Testing

This project includes a comprehensive test suite using **Vitest** with excellent coverage across all components, services, and state management.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm test -- --watch

# Run tests with interactive UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## AI usage

ChatGPT has been referred for some of the issues I encountered given my limited knowledge of Vue










