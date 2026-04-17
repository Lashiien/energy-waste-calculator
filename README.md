# Energy Waste Calculator

A React application that calculates potential energy savings for residential and commercial properties in Saudi Arabia.

## Features

- User-friendly interface with step-by-step form
- Calculates energy consumption and costs for current appliances
- Estimates potential savings from upgrading to energy-efficient appliances
- Shows payback period for investments in energy-efficient upgrades
- Simple before/after comparison of energy costs

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application

To start the development server:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

To create a production build:

```bash
npm run build
```

The build files will be located in the `build` directory.

## Technology Stack

- React
- Material UI
- Chart.js

## Project Structure

- `/src/components` - React components
- `/src/constants` - Application constants and data
- `/src/utils` - Utility functions and calculations
- `/public` - Static assets

## Calculation Methodology

The application uses the following factors for calculations:

- Region-specific electricity rates
- Seasonal usage patterns
- Appliance efficiency ratings
- Age-based efficiency degradation
- Typical usage hours
- Current market prices for new appliances
- Available government rebates and incentives

## Future Enhancements

- User accounts for saving and comparing multiple calculations
- Integration with smart home devices for real-time data
- Additional appliance types and more detailed inputs
- Comparison with neighborhood/regional averages
- Localization for additional regions and languages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data sources for regional electricity rates and appliance efficiency
- Material-UI for the component library
- Chart.js for visualization components
