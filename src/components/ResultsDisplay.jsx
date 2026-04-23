import React, { useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  BoltRounded,
  ArrowBack,
  Savings,
  CheckCircleOutline,
  PictureAsPdf,
  TrendingUp,
  InfoOutlined,
} from "../utils/icons";
import { dataSources } from "../constants/data";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// ── Savings bracket plugin ──────────────────────────────────────────────────
// Draws a visual "Save SR X/yr" label between the two bars
const savingsBracketPlugin = {
  id: "savingsBracket",
  afterDraw(chart) {
    const {
      ctx,
      scales: { y },
      data,
    } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data || meta.data.length < 2 || !y) return;

    const bar0 = meta.data[0];
    const bar1 = meta.data[1];
    const val0 = data.datasets[0].data[0];
    const val1 = data.datasets[0].data[1];
    const savings = val0 - val1;
    if (savings <= 0) return;

    const y0   = y.getPixelForValue(val0);
    const y1   = y.getPixelForValue(val1);
    const midY = (y0 + y1) / 2;
    const hw   = (bar0.width || 60) / 2;
    const x0   = bar0.x + hw + 6;
    const x1   = bar1.x - hw - 6;
    const midX = (x0 + x1) / 2;

    if (x1 <= x0 + 20) return; // not enough space

    ctx.save();

    // Dashed bracket
    ctx.strokeStyle = "rgba(46,125,50,0.65)";
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(midX, y0);
    ctx.lineTo(midX, y1);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // Label
    ctx.setLineDash([]);
    ctx.font = "bold 12px Poppins, sans-serif";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";

    const label = `Save SR ${Math.round(savings).toLocaleString()}/yr`;
    const tw    = ctx.measureText(label).width;
    const pad   = 8;
    const bx    = midX - tw / 2 - pad;
    const by    = midY - 13;
    const bw    = tw + pad * 2;
    const bh    = 26;

    // Pill background
    ctx.fillStyle   = "rgba(255,255,255,0.97)";
    ctx.strokeStyle = "rgba(46,125,50,0.55)";
    ctx.lineWidth   = 1;
    const r = 5;
    ctx.beginPath();
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + bw - r, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
    ctx.lineTo(bx + bw, by + bh - r);
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
    ctx.lineTo(bx + r, by + bh);
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
    ctx.lineTo(bx, by + r);
    ctx.quadraticCurveTo(bx, by, bx + r, by);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#1b5e20";
    ctx.fillText(label, midX, midY);
    ctx.restore();
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

const CHART_COLORS = [
  '#1976d2', '#388e3c', '#f57c00', '#7b1fa2',
  '#c62828', '#00838f', '#5d4037', '#455a64',
  '#ef6c00', '#2e7d32', '#6a1b9a', '#ad1457',
];

const getChartColor = (index) => CHART_COLORS[index % CHART_COLORS.length];

const fmt = (n) => `SR ${Math.round(Math.max(0, n)).toLocaleString()}`;

const fmtPayback = (breakEvenMonths) => {
  if (!isFinite(breakEvenMonths) || breakEvenMonths <= 0) return "N/A";
  if (breakEvenMonths < 12) return `${Math.round(breakEvenMonths)} month payback`;
  return `${(breakEvenMonths / 12).toFixed(1)} yr payback`;
};

// ── Component ───────────────────────────────────────────────────────────────

const ResultsDisplay = ({ calculationResults, onBack, onRestart }) => {
  const resultsRef = useRef(null);
  const [exporting, setExporting]     = useState(false);
  const [exportError, setExportError] = useState(null);

  const {
    totalCurrentCost,
    totalPotentialSavings,
    totalReplacementCost,
    totalCarbonReduction,
    actionItems,
    projections,
  } = calculationResults;

  // Guard: after-upgrade cost can never be negative
  const afterUpgradesCost = Math.max(0, totalCurrentCost - totalPotentialSavings);
  const hasSavings        = totalPotentialSavings > 0;

  const paybackLabel = () => {
    if (!hasSavings || !totalReplacementCost) return "N/A";
    const y = totalReplacementCost / totalPotentialSavings;
    if (!isFinite(y)) return "N/A";
    return y < 1
      ? `${Math.round(y * 12)} months`
      : `${y.toFixed(1)} years`;
  };

  // ── PDF export ────────────────────────────────────────────────────────────
  const handleExportPDF = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const el = resultsRef.current;
      if (!el) throw new Error("Results container not found.");

      const canvas = await html2canvas(el, {
        scale:           2,
        useCORS:         true,
        allowTaint:      true,
        backgroundColor: "#ffffff",
        logging:         false,
      });

      const pdf   = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();   // 210 mm
      const pageH = pdf.internal.pageSize.getHeight();  // 297 mm

      // Pixels that fit on one A4 page at canvas scale
      const pixelsPerPage = Math.floor((pageH * canvas.width) / pageW);
      let rendered  = 0;
      let pageIndex = 0;

      while (rendered < canvas.height) {
        const sliceH = Math.min(pixelsPerPage, canvas.height - rendered);

        const slice   = document.createElement("canvas");
        slice.width   = canvas.width;
        slice.height  = sliceH;
        slice.getContext("2d").drawImage(
          canvas, 0, rendered, canvas.width, sliceH, 0, 0, canvas.width, sliceH
        );

        if (pageIndex > 0) pdf.addPage();
        pdf.addImage(
          slice.toDataURL("image/png"),
          "PNG",
          0,
          0,
          pageW,
          Math.round((sliceH * pageW) / canvas.width)
        );

        rendered  += sliceH;
        pageIndex += 1;
      }

      pdf.save("energy-savings-report.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
      setExportError("PDF export failed — please try again.");
    } finally {
      setExporting(false);
    }
  };

  // ── Before/After chart ────────────────────────────────────────────────────
  const comparisonChartData = {
    labels:   ["Current Cost", "After Upgrades"],
    datasets: [
      {
        label: "Annual Energy Cost (SR)",
        data:  [Math.round(totalCurrentCost), Math.round(afterUpgradesCost)],
        backgroundColor: (ctx) => {
          const { chart } = ctx;
          const { chartArea } = chart;
          if (!chartArea) return ctx.dataIndex === 0 ? "#ef5350" : "#43a047";
          const grad = chart.ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          if (ctx.dataIndex === 0) {
            grad.addColorStop(0, "#b71c1c");
            grad.addColorStop(1, "#ff7043");
          } else {
            grad.addColorStop(0, "#1b5e20");
            grad.addColorStop(1, "#66bb6a");
          }
          return grad;
        },
        borderRadius:  10,
        borderSkipped: false,
        barThickness:  80,
      },
    ],
  };

  const comparisonChartOptions = {
    responsive:          true,
    maintainAspectRatio: false,
    animation:           { duration: 800, easing: "easeOutQuart" },
    scales: {
      y: {
        beginAtZero: true,
        grid:  { color: "rgba(0,0,0,0.06)" },
        border: { dash: [4, 4] },
        ticks: {
          callback: (v) => `SR ${v.toLocaleString()}`,
          font:     { size: 11 },
          color:    "#666",
        },
      },
      x: {
        grid:  { display: false },
        ticks: { font: { size: 13, weight: 600 }, color: "#333" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (c) => ` ${fmt(c.parsed.y)}` },
        backgroundColor: "rgba(0,0,0,0.82)",
        padding:         10,
        cornerRadius:    8,
      },
    },
  };

  // ── Appliance breakdown (horizontal bar) ─────────────────────────────────
  const applianceChartData = {
    labels:   actionItems.map((a) => a.name),
    datasets: [
      {
        label:           "Annual Savings (SR)",
        data:            actionItems.map((a) => Math.round(Math.max(0, a.savings))),
        backgroundColor: actionItems.map((_, i) => getChartColor(i)),
        borderRadius:    6,
        barThickness:    28,
      },
    ],
  };

  const applianceChartOptions = {
    indexAxis:           "y",
    responsive:          true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        grid:  { color: "rgba(0,0,0,0.05)" },
        ticks: { callback: (v) => `SR ${v.toLocaleString()}`, font: { size: 11 } },
      },
      y: {
        grid:  { display: false },
        ticks: { font: { size: 13, weight: 600 }, color: "#333" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (c) => ` Save ${fmt(c.parsed.x)}/yr` },
        backgroundColor: "rgba(0,0,0,0.82)",
        padding:         10,
        cornerRadius:    8,
      },
    },
  };

  // ── 5-year projection (line chart) ───────────────────────────────────────
  // Use a static fill colour — avoids gradient callback edge case on first render
  const projectionChartData = projections
    ? {
        labels:   projections.yearlyLabels,
        datasets: [
          {
            label:                "Cumulative Net Savings (SR)",
            data:                 projections.cumulativeSavingsData.map(Math.round),
            borderColor:          "#2e7d32",
            backgroundColor:      "rgba(46,125,50,0.12)",
            fill:                 true,
            tension:              0.4,
            pointRadius:          5,
            pointBackgroundColor: "#2e7d32",
            borderWidth:          2,
          },
        ],
      }
    : null;

  const projectionChartOptions = {
    responsive:          true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid:  { color: "rgba(0,0,0,0.06)" },
        ticks: { callback: (v) => `SR ${v.toLocaleString()}`, font: { size: 11 } },
      },
      x: {
        grid:  { display: false },
        ticks: { font: { size: 12, weight: 500 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (c) => {
            const v = c.parsed.y;
            return v < 0
              ? ` Still paying back: SR ${Math.abs(v).toLocaleString()}`
              : ` Net gain: SR ${v.toLocaleString()}`;
          },
        },
        backgroundColor: "rgba(0,0,0,0.82)",
        padding:         10,
        cornerRadius:    8,
      },
    },
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
        {/* ── Snapshot area (captured by html2canvas) ──────────── */}
        <Box ref={resultsRef} sx={{ background: "transparent" }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Box
              sx={{
                display:         "inline-flex",
                alignItems:      "center",
                justifyContent:  "center",
                width:  80,
                height: 80,
                borderRadius:    "50%",
                background:      "linear-gradient(135deg, #ff9800, #f44336)",
                mb:              2,
                boxShadow:       "0 8px 24px rgba(255,152,0,0.35)",
              }}
            >
              <BoltRounded sx={{ fontSize: 44, color: "#fff" }} />
            </Box>

            {hasSavings ? (
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ color: "#1a1a1a", lineHeight: 1.2, fontSize: { xs: "1.75rem", md: "2.4rem" } }}
                gutterBottom
              >
                You could save{" "}
                <Box
                  component="span"
                  sx={{
                    background:            "linear-gradient(90deg, #2e7d32, #4caf50)",
                    WebkitBackgroundClip:  "text",
                    WebkitTextFillColor:   "transparent",
                  }}
                >
                  {fmt(totalPotentialSavings)}
                </Box>{" "}
                every year
              </Typography>
            ) : (
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ color: "#1b5e20", lineHeight: 1.2, fontSize: { xs: "1.75rem", md: "2.4rem" } }}
                gutterBottom
              >
                Your appliances are already efficient!
              </Typography>
            )}

            <Typography variant="h6" color="text.secondary" fontWeight={400}>
              Your personalised energy analysis for Saudi Arabia
            </Typography>
          </Box>

          {/* Stat cards */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {[
              {
                label:  "Current Annual Cost",
                value:  fmt(totalCurrentCost),
                sub:    "What you pay today",
                bg:     "linear-gradient(135deg, #fff8f6, #fff3f0)",
                border: "#ffccbc",
                color:  "#bf360c",
              },
              {
                label:  "Potential Savings",
                value:  fmt(totalPotentialSavings),
                sub:    "Every year, after upgrades",
                bg:     "linear-gradient(135deg, #f1f8e9, #e8f5e9)",
                border: "#a5d6a7",
                color:  "#1b5e20",
              },
              {
                label:  "Payback Period",
                value:  paybackLabel(),
                sub:    `Investment: ${fmt(totalReplacementCost)}`,
                bg:     "linear-gradient(135deg, #e8eaf6, #ede7f6)",
                border: "#b39ddb",
                color:  "#311b92",
              },
            ].map((c) => (
              <Grid item xs={12} sm={4} key={c.label}>
                <Card
                  elevation={0}
                  sx={{
                    height:       "100%",
                    background:   c.bg,
                    border:       `1.5px solid ${c.border}`,
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ pb: "16px !important" }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}
                    >
                      {c.label}
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      sx={{
                        color:      c.color,
                        my:         0.5,
                        lineHeight: 1.1,
                        fontSize:   { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
                      }}
                    >
                      {c.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.sub}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Before/After Comparison */}
          <Paper
            elevation={0}
            sx={{ p: { xs: 2, sm: 4 }, mb: 4, border: "1.5px solid", borderColor: "divider" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <TrendingUp sx={{ color: "primary.main" }} />
              <Typography variant="h5" fontWeight={700}>
                Before & After Comparison
              </Typography>
            </Box>
            <Box sx={{ height: { xs: 280, md: 360 } }}>
              <Bar
                data={comparisonChartData}
                options={comparisonChartOptions}
                plugins={[savingsBracketPlugin]}
              />
            </Box>
          </Paper>

          {/* Savings by Appliance */}
          {actionItems.length > 0 && (
            <Paper
              elevation={0}
              sx={{ p: { xs: 2, sm: 4 }, mb: 4, border: "1.5px solid", borderColor: "divider" }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Savings by Appliance
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Annual cost reduction per appliance type after upgrading.
              </Typography>
              <Box sx={{ height: Math.max(120, actionItems.length * 72) }}>
                <Bar data={applianceChartData} options={applianceChartOptions} />
              </Box>
            </Paper>
          )}

          {/* 5-Year Projection */}
          {projectionChartData && (
            <Paper
              elevation={0}
              sx={{ p: { xs: 2, sm: 4 }, mb: 4, border: "1.5px solid", borderColor: "divider" }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                5-Year Financial Projection
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Cumulative net savings after the initial investment. The line
                crosses zero at your payback point.
              </Typography>
              <Box sx={{ height: 260 }}>
                <Line data={projectionChartData} options={projectionChartOptions} />
              </Box>
            </Paper>
          )}

          {/* Top Recommendations */}
          <Paper
            elevation={0}
            sx={{ p: { xs: 2, sm: 4 }, mb: 4, border: "1.5px solid", borderColor: "divider" }}
          >
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Top Recommendations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Prioritised by annual savings — highest impact first.
            </Typography>

            {actionItems.length === 0 ? (
              <Alert severity="success">
                Your appliances are already at maximum efficiency — nothing to upgrade!
              </Alert>
            ) : (
              <List disablePadding>
                {actionItems.map((item, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <Divider />}
                    <ListItem sx={{ px: 0, py: 2, alignItems: "flex-start" }}>
                      <ListItemIcon sx={{ mt: 0.5, minWidth: 36 }}>
                        <CheckCircleOutline sx={{ color: "primary.main", fontSize: 22 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography fontWeight={600}>
                            Upgrade your {item.name}
                          </Typography>
                        }
                        secondary={
                          <Box component="span">
                            <Typography
                              component="span"
                              variant="body2"
                              color="success.dark"
                              fontWeight={600}
                            >
                              Save {fmt(item.savings)}/year
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              {" "}· Upgrade cost {fmt(item.replacementCost)} ·{" "}
                              {fmtPayback(item.breakEvenMonths)}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ textAlign: "right", ml: 2, flexShrink: 0 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display:    "inline-block",
                            background: "#e8f5e9",
                            color:      "#1b5e20",
                            borderRadius: 1,
                            px: 1,
                            py: 0.25,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          5-yr:{" "}
                          {item.fiveYearSavings >= 0
                            ? `+${fmt(item.fiveYearSavings)}`
                            : fmt(item.fiveYearSavings)}
                        </Typography>
                      </Box>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>

          {/* Carbon footnote */}
          {totalCarbonReduction > 0 && (
            <Box
              sx={{
                textAlign:  "center",
                py:         2,
                px:         3,
                background: "rgba(46,125,50,0.06)",
                borderRadius: 2,
                mb:         4,
              }}
            >
              <Typography variant="body2" color="primary.dark">
                <strong>
                  {Math.round(totalCarbonReduction).toLocaleString()} kg CO₂
                </strong>{" "}
                saved annually — equivalent to planting{" "}
                {Math.round(totalCarbonReduction / 21)} trees per year.
              </Typography>
            </Box>
          )}

          {/* Data sources footnote */}
          <Box
            sx={{
              mt: 2,
              mb: 4,
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              background: "#fafafa",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <InfoOutlined sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}>
                Methodology &amp; Sources
              </Typography>
            </Box>
            {dataSources.map((s) => (
              <Box key={s.label} sx={{ mb: 1 }}>
                <Typography variant="caption" fontWeight={600} sx={{ display: "inline" }}>
                  {s.label}:{" "}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {s.detail}
                </Typography>
              </Box>
            ))}
            <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 1.5 }}>
              Calculations use annual kWh totals split across SEC tiered slabs. Seasonal
              weights are derived from GAMEP 30-year climate normals. Results are
              estimates — actual savings depend on usage behaviour and local conditions.
            </Typography>
          </Box>
        </Box>

        {/* ── Actions (not captured in PDF snapshot) ──────────── */}
        <Box>
          {exportError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setExportError(null)}>
              {exportError}
            </Alert>
          )}

          <Box
            sx={{
              display:        "flex",
              flexWrap:       "wrap",
              gap:            2,
              justifyContent: "space-between",
              mt:             2,
            }}
          >
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={onBack}>
              Back to Form
            </Button>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={
                  exporting ? (
                    <CircularProgress size={18} sx={{ color: "#fff" }} />
                  ) : (
                    <PictureAsPdf />
                  )
                }
                onClick={handleExportPDF}
                disabled={exporting}
                sx={{
                  background: "linear-gradient(135deg, #ff9800, #f44336)",
                  color:      "#fff",
                  "&:hover": {
                    background: "linear-gradient(135deg, #e68900, #d32f2f)",
                  },
                }}
              >
                {exporting ? "Generating…" : "Export PDF"}
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<Savings />}
                onClick={onRestart}
              >
                Start Over
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ResultsDisplay;
