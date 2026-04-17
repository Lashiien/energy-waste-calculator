import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Air as AirIcon,
  Kitchen as KitchenIcon,
  Shower as ShowerIcon,
  LocationOn as LocationOnIcon,
} from "../utils/icons";
import { homeSizes, defaultApplianceCounts, regions } from "../constants/data";

const steps = ["Property Details", "Appliances", "Usage Patterns"];

const stepDescriptions = [
  "Your city and home type",
  "What you have and how old it is",
  "How long you run each appliance",
];

const InputForm = ({ formData, onDataChange, onSubmit, onBack, calcError }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  // When home size changes, pre-fill appliance counts
  useEffect(() => {
    const size = formData.homeSize;
    if (size && defaultApplianceCounts[size] && formData.appliances.length <= 3) {
      const d = defaultApplianceCounts[size];
      onDataChange({
        appliances: [
          { type: "AC",          count: d.AC,          age: "old" },
          { type: "fridge",      count: d.fridge,      age: "old" },
          { type: "waterHeater", count: d.waterHeater, age: "old" },
        ],
        roomCount: Math.max(d.AC, 4),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.homeSize]);

  // When region changes, update usage defaults to match regional climate
  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    const rd = regions[newRegion] || regions.riyadh;
    onDataChange({
      region: newRegion,
      usagePatterns: {
        ...formData.usagePatterns,
        acSummerHours:              rd.defaultAcHours.summer,
        acWinterHours:              rd.defaultAcHours.winter,
        acSpringFallHours:          rd.defaultAcHours.shoulder,
        waterHeaterSummerHours:     rd.defaultWaterHeaterHours.summer,
        waterHeaterWinterHours:     rd.defaultWaterHeaterHours.winter,
        waterHeaterSpringFallHours: rd.defaultWaterHeaterHours.shoulder,
      },
    });
  };

  const validateStep = () => {
    const errors = {};
    if (activeStep === 1) {
      formData.appliances.forEach((a, i) => {
        if (!Number.isInteger(a.count) || a.count < 1 || a.count > 20) {
          errors[`count_${i}`] = "Must be 1–20";
        }
      });
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (activeStep === steps.length - 1) {
      onSubmit(formData);
    } else {
      setActiveStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      onBack();
    } else {
      setActiveStep((s) => s - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onDataChange({ [name]: value });
  };

  const handleApplianceChange = (index, field, value) => {
    const updated = [...formData.appliances];
    updated[index] = { ...updated[index], [field]: value };
    const newErrors = { ...validationErrors };
    delete newErrors[`count_${index}`];
    setValidationErrors(newErrors);
    onDataChange({ appliances: updated });
  };

  const handleAddAppliance = () => {
    onDataChange({
      appliances: [...formData.appliances, { type: "AC", count: 1, age: "old" }],
    });
  };

  const handleRemoveAppliance = (index) => {
    const updated = [...formData.appliances];
    updated.splice(index, 1);
    onDataChange({ appliances: updated });
  };

  const handleUsageChange = (field, value) => {
    onDataChange({
      usagePatterns: { ...formData.usagePatterns, [field]: value },
    });
  };

  const getApplianceIcon = (type) => {
    const sx = { fontSize: 22, color: "#2e7d32" };
    switch (type) {
      case "AC":          return <AirIcon sx={sx} />;
      case "fridge":      return <KitchenIcon sx={sx} />;
      case "waterHeater": return <ShowerIcon sx={sx} />;
      default:            return <AirIcon sx={sx} />;
    }
  };

  const getAgeOptions = (type) => {
    switch (type) {
      case "AC":
        return [
          { value: "old",      label: "Old (5+ years)" },
          { value: "new",      label: "Standard Efficient" },
          { value: "inverter", label: "Inverter (Most Efficient)" },
        ];
      case "fridge":
        return [
          { value: "old",    label: "Old (5+ years)" },
          { value: "new",    label: "Standard Efficient" },
          { value: "modern", label: "Modern High Efficiency" },
        ];
      case "waterHeater":
        return [
          { value: "old",   label: "Old (5+ years)" },
          { value: "new",   label: "Standard Efficient" },
          { value: "solar", label: "Solar-Assisted" },
        ];
      default:
        return [
          { value: "old", label: "Old (5+ years)" },
          { value: "new", label: "Energy Efficient (New)" },
        ];
    }
  };

  // ── Step renderers ─────────────────────────────────────────────────────────

  const renderPropertyDetails = () => (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Tell us about your property
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Your city matters — Jeddah and Mecca run AC year-round; Riyadh has a proper
        winter. Selecting your region automatically adjusts usage defaults.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="region-label">City / Region</InputLabel>
            <Select
              labelId="region-label"
              value={formData.region || "riyadh"}
              label="City / Region"
              onChange={handleRegionChange}
            >
              {Object.entries(regions).map(([key, r]) => (
                <MenuItem key={key} value={key}>
                  {r.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Property Type</InputLabel>
            <Select
              name="propertyType"
              value={formData.propertyType}
              label="Property Type"
              onChange={handleInputChange}
            >
              <MenuItem value="residential">Residential</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Home Size</InputLabel>
            <Select
              name="homeSize"
              value={formData.homeSize}
              label="Home Size"
              onChange={handleInputChange}
            >
              {Object.entries(homeSizes).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const renderApplianceDetails = () => (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        What appliances do you have?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Pre-filled from your home size. Adjust counts and efficiency — the older
        and less efficient, the more room to save.
      </Typography>

      {formData.appliances.map((appliance, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            mb: 2,
            borderColor: validationErrors[`count_${index}`]
              ? "error.main"
              : "divider",
            transition: "border-color 0.2s",
          }}
        >
          <CardContent sx={{ pb: "16px !important" }}>
            <Grid container spacing={2} alignItems="center">
              {/* Icon box — use rgba on background, NOT opacity on parent */}
              <Grid item sx={{ display: { xs: "none", sm: "flex" } }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: "rgba(46,125,50,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {getApplianceIcon(appliance.type)}
                </Box>
              </Grid>

              <Grid item xs={12} sm>
                <FormControl fullWidth size="small">
                  <InputLabel>Appliance</InputLabel>
                  <Select
                    value={appliance.type}
                    label="Appliance"
                    onChange={(e) =>
                      handleApplianceChange(index, "type", e.target.value)
                    }
                  >
                    <MenuItem value="AC">Air Conditioner</MenuItem>
                    <MenuItem value="fridge">Refrigerator</MenuItem>
                    <MenuItem value="waterHeater">Water Heater</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={5} sm={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Count"
                  type="number"
                  value={appliance.count}
                  error={Boolean(validationErrors[`count_${index}`])}
                  helperText={validationErrors[`count_${index}`] || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    handleApplianceChange(
                      index,
                      "count",
                      isNaN(val) ? 1 : Math.min(20, Math.max(1, val))
                    );
                  }}
                  inputProps={{ min: 1, max: 20 }}
                />
              </Grid>

              <Grid item xs={7} sm>
                <FormControl fullWidth size="small">
                  <InputLabel>Age / Efficiency</InputLabel>
                  <Select
                    value={appliance.age}
                    label="Age / Efficiency"
                    onChange={(e) =>
                      handleApplianceChange(index, "age", e.target.value)
                    }
                  >
                    {getAgeOptions(appliance.type).map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item>
                <Tooltip title="Remove">
                  <span>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleRemoveAppliance(index)}
                      disabled={formData.appliances.length <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddAppliance}
        sx={{ mt: 1 }}
        disabled={formData.appliances.length >= 12}
      >
        Add Appliance
      </Button>
    </Box>
  );

  const renderUsagePatterns = () => {
    const p = formData.usagePatterns;
    const regionData = regions[formData.region] || regions.riyadh;

    return (
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
          <Typography variant="h6" fontWeight={600}>
            Daily usage hours
          </Typography>
          <Chip
            label={regionData.label}
            size="small"
            color="primary"
            variant="outlined"
            icon={<LocationOnIcon />}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Defaults are set for your region. Fine-tune to match your actual habits.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>AC — Summer (hrs/day)</InputLabel>
              <Select
                value={p.acSummerHours ?? 14}
                label="AC — Summer (hrs/day)"
                onChange={(e) => handleUsageChange("acSummerHours", e.target.value)}
              >
                {Array.from({ length: 25 }, (_, h) => (
                  <MenuItem key={h} value={h}>{h} hrs</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>AC — Winter (hrs/day)</InputLabel>
              <Select
                value={p.acWinterHours ?? 6}
                label="AC — Winter (hrs/day)"
                onChange={(e) => handleUsageChange("acWinterHours", e.target.value)}
              >
                {Array.from({ length: 25 }, (_, h) => (
                  <MenuItem key={h} value={h}>{h} hrs</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Water Heater — Winter (hrs/day)</InputLabel>
              <Select
                value={p.waterHeaterWinterHours ?? 4}
                label="Water Heater — Winter (hrs/day)"
                onChange={(e) =>
                  handleUsageChange("waterHeaterWinterHours", e.target.value)
                }
              >
                {Array.from({ length: 9 }, (_, h) => (
                  <MenuItem key={h} value={h}>{h} hrs</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Water Heater — Summer (hrs/day)</InputLabel>
              <Select
                value={p.waterHeaterSummerHours ?? 2}
                label="Water Heater — Summer (hrs/day)"
                onChange={(e) =>
                  handleUsageChange("waterHeaterSummerHours", e.target.value)
                }
              >
                {Array.from({ length: 7 }, (_, h) => (
                  <MenuItem key={h} value={h}>{h} hrs</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Fridge — shortened label for mobile readability */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Fridge — daily run time (hrs/day)</InputLabel>
              <Select
                value={p.fridgeHoursPerDay ?? 8}
                label="Fridge — daily run time (hrs/day)"
                onChange={(e) => handleUsageChange("fridgeHoursPerDay", e.target.value)}
              >
                {[6, 7, 8, 9, 10, 11, 12].map((h) => (
                  <MenuItem key={h} value={h}>
                    {h} hrs
                    {h === 8 ? " (typical)" : h >= 10 ? " (hot climate)" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:  return renderPropertyDetails();
      case 1:  return renderApplianceDetails();
      case 2:  return renderUsagePatterns();
      default: return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0f7f1 0%, #f5f5f5 100%)",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: "primary.dark" }} gutterBottom>
            Energy Waste Calculator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            3 quick steps to reveal your savings potential
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, i) => (
            <Step key={label}>
              <StepLabel
                optional={
                  <Typography variant="caption" color="text.secondary">
                    {stepDescriptions[i]}
                  </Typography>
                }
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card elevation={0} sx={{ border: "1.5px solid", borderColor: "divider" }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            {calcError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {calcError}
              </Alert>
            )}

            {renderStep()}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                {activeStep === 0 ? "Cancel" : "Back"}
              </Button>

              <Button
                variant="contained"
                color={activeStep === steps.length - 1 ? "secondary" : "primary"}
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 4 }}
              >
                {activeStep === steps.length - 1 ? "Calculate Results" : "Next"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default InputForm;
