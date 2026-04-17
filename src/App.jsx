import React, { useState, Component } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import LandingPage from "./components/LandingPage";
import InputForm from "./components/InputForm";
import ResultsDisplay from "./components/ResultsDisplay";
import { calculateEnergyCosts } from "./utils/calculations";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32",
      light: "#60ad5e",
      dark: "#005005",
    },
    secondary: {
      main: "#ff9800",
      light: "#ffc947",
      dark: "#c66900",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: 0.3,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0,0,0,0.18)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 4px 16px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
  },
});

// Error boundary for unexpected render failures
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography color="text.secondary" paragraph sx={{ maxWidth: 480 }}>
            {this.state.error?.message ||
              "An unexpected error occurred. Please refresh and try again."}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

const defaultFormData = {
  propertyType: "residential",
  region: "riyadh",
  homeSize: "medium",
  roomCount: 4,
  appliances: [
    { type: "AC", count: 1, age: "old" },
    { type: "fridge", count: 1, age: "old" },
    { type: "waterHeater", count: 1, age: "old" },
  ],
  usagePatterns: {
    acSummerHours: 14,
    acWinterHours: 6,
    acSpringFallHours: 10,
    waterHeaterSummerHours: 2,
    waterHeaterWinterHours: 4,
    waterHeaterSpringFallHours: 3,
    fridgeHoursPerDay: 8,
  },
};

function App() {
  const [currentStep, setCurrentStep]           = useState("landing");
  const [formData, setFormData]                 = useState(defaultFormData);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isCalculating, setIsCalculating]       = useState(false);
  const [calcError, setCalcError]               = useState(null);

  const handleFormDataChange = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleFormSubmit = async () => {
    setIsCalculating(true);
    setCalcError(null);

    // Defer to next tick so the loading spinner renders
    await new Promise((r) => setTimeout(r, 60));

    try {
      const safeData = {
        ...formData,
        appliances:    formData.appliances    || [],
        usagePatterns: formData.usagePatterns || {},
      };

      const processedData = {
        propertyType: safeData.propertyType || "residential",
        region:       safeData.region       || "riyadh",
        homeSize:     safeData.homeSize      || "medium",
        appliances: safeData.appliances.map((appliance) => ({
          ...appliance,
        })),
        usagePatterns: safeData.usagePatterns,
      };

      const results = calculateEnergyCosts(processedData);

      const applianceResults = processedData.appliances.map((appliance) => {
        const savingInfo = results.applianceSavings.find(
          (s) => s.type === appliance.type && s.currentAge === appliance.age
        );
        return {
          name: getApplianceName(appliance.type),
          count: appliance.count,
          age: appliance.age,
          savings: savingInfo ? savingInfo.costSaved : 0,
          carbonReduction: savingInfo ? savingInfo.energySaved * 0.7 : 0,
          breakEvenMonths: savingInfo ? savingInfo.paybackPeriod * 12 : 0,
        };
      });

      const actionItems = results.applianceSavings
        .map((s) => ({
          name:            getApplianceName(s.type),
          savings:         s.costSaved,
          replacementCost: s.upgradeCost,
          rebate:          0,
          breakEvenMonths: s.paybackPeriod * 12,
          carbonReduction: s.energySaved * 0.7,
          fiveYearSavings: s.costSaved * 5 - s.upgradeCost,
        }))
        .sort((a, b) => b.savings - a.savings);

      setCalculationResults({
        applianceResults,
        totalCurrentCost:      results.currentCost,
        totalPotentialSavings: results.costSavings,
        totalReplacementCost:  results.upgradeCosts,
        totalCarbonReduction:  results.carbonSavings,
        actionItems,
        projections: {
          initialInvestment: results.upgradeCosts,
          yearlySavings:     results.costSavings,
          fiveYearNetSavings: results.costSavings * 5 - results.upgradeCosts,
          breakEvenYear:      results.paybackPeriod,
          yearlyLabels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
          cumulativeSavingsData: [1, 2, 3, 4, 5].map(
            (yr) => results.costSavings * yr - results.upgradeCosts
          ),
        },
      });
      setCurrentStep("results");
    } catch (error) {
      console.error("Calculation error:", error);
      setCalcError(error.message || "Calculation failed. Please check your inputs.");
    } finally {
      setIsCalculating(false);
    }
  };

  const getApplianceName = (type) =>
    ({ AC: "Air Conditioner", fridge: "Refrigerator", waterHeater: "Water Heater" }[type] || type);

  const handleRestart = () => {
    setFormData(defaultFormData);
    setCalculationResults(null);
    setCalcError(null);
    setCurrentStep("landing");
  };

  if (isCalculating) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #071322 0%, #0d2818 60%, #071322 100%)",
            gap: 3,
          }}
        >
          <CircularProgress size={60} sx={{ color: "#ff9800" }} />
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.85)" }}>
            Calculating your energy profile…
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        {currentStep === "landing" && (
          <LandingPage onStart={() => setCurrentStep("input")} />
        )}

        {currentStep === "input" && (
          <InputForm
            formData={formData}
            onDataChange={handleFormDataChange}
            onSubmit={handleFormSubmit}
            onBack={handleRestart}
            calcError={calcError}
          />
        )}

        {currentStep === "results" && calculationResults && (
          <ResultsDisplay
            calculationResults={calculationResults}
            onBack={() => setCurrentStep("input")}
            onRestart={handleRestart}
          />
        )}
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
