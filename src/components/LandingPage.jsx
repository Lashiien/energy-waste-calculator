import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Tooltip,
} from "@mui/material";
import { ArrowForward, EmojiEvents, InfoOutlined } from "../utils/icons";
import { dataSources } from "../constants/data";

const contributors = [
  { name: "Humza Raja",     initials: "HR" },
  { name: "Ahmed Lashin",   initials: "AL" },
  { name: "Ahmed Alghanmi", initials: "AA" },
];

const SourcesTooltip = () => (
  <Box sx={{ p: 0.5, maxWidth: 300 }}>
    <Typography variant="caption" fontWeight={700} sx={{ display: "block", mb: 1 }}>
      Data Sources
    </Typography>
    {dataSources.map((s) => (
      <Box key={s.label} sx={{ mb: 1 }}>
        <Typography variant="caption" fontWeight={600} sx={{ display: "block" }}>
          {s.label}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
          {s.detail}
        </Typography>
      </Box>
    ))}
  </Box>
);

const LandingPage = ({ onStart }) => {
  const [certImgError, setCertImgError] = useState(false);

  return (
    <Box sx={{ background: "#fff", minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 10, md: 16 }, borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            fontWeight={700}
            sx={{ fontSize: { xs: "2rem", md: "2.75rem" }, lineHeight: 1.2, mb: 3 }}
          >
            How much is your home wasting on electricity?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 5, lineHeight: 1.8, maxWidth: 420, mx: "auto" }}
          >
            Enter your city and appliances. Get a breakdown of your annual
            energy cost, what you could save, and how fast an upgrade pays off.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={onStart}
            sx={{
              background: "#2e7d32",
              px: 5,
              py: 1.5,
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { background: "#1b5e20", boxShadow: "none" },
            }}
          >
            Start calculation
          </Button>
          <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 2 }}>
            No account needed · 3 minutes
          </Typography>
        </Container>
      </Box>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="md">
          <Typography variant="overline" color="text.disabled" sx={{ display: "block", mb: 4, letterSpacing: 2 }}>
            How it works
          </Typography>
          <Grid container spacing={6}>
            {[
              {
                num:  "01",
                title: "Pick your city",
                body:  "Riyadh, Jeddah, Dammam, or Mecca. Seasonal usage defaults adjust automatically.",
              },
              {
                num:  "02",
                title: "Enter your appliances",
                body:  "How many ACs, fridges, and water heaters — and roughly how old they are.",
              },
              {
                num:  "03",
                title: "Read your report",
                body:  "Annual cost, savings potential, payback period, carbon reduction. Exportable as PDF.",
              },
            ].map((s) => (
              <Grid item xs={12} sm={4} key={s.num}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 800, color: "#f0f0f0", lineHeight: 1, mb: 1.5, fontSize: "3rem" }}
                >
                  {s.num}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {s.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                  {s.body}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CONTEXT ──────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="md">
          <Typography variant="overline" color="text.disabled" sx={{ display: "block", mb: 4, letterSpacing: 2 }}>
            Why this matters
          </Typography>
          <Grid container spacing={6}>
            {[
              {
                title: "Extreme summers",
                body:  "Riyadh hits 45 °C for six months. An old non-inverter AC draws 2 kW — roughly twice what a modern inverter split needs for the same cooling.",
              },
              {
                title: "Tiered billing",
                body:  "SEC's four-tier structure charges 0.38 SAR/kWh at the top slab — more than double the entry rate. Every kWh you cut saves at the highest rate you've reached.",
              },
              {
                title: "Short payback",
                body:  "Inverter ACs and solar water heaters typically pay for themselves in 2–4 years under Saudi usage patterns.",
              },
            ].map((c) => (
              <Grid item xs={12} sm={4} key={c.title}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {c.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                  {c.body}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── RECOGNITION ──────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="sm">
          <Typography variant="overline" color="text.disabled" sx={{ display: "block", mb: 4, letterSpacing: 2 }}>
            Recognition
          </Typography>

          {/* Certificate slot */}
          {!certImgError ? (
            <Box
              component="img"
              src="/certificate.png"
              alt="Award Certificate"
              onError={() => setCertImgError(true)}
              sx={{ width: "100%", display: "block", borderRadius: 2, mb: 2 }}
            />
          ) : (
            <Box
              sx={{
                border: "1.5px dashed",
                borderColor: "divider",
                borderRadius: 2,
                py: 8,
                textAlign: "center",
                mb: 2,
              }}
            >
              <EmojiEvents sx={{ fontSize: 36, color: "text.disabled", mb: 1 }} />
              <Typography variant="caption" color="text.disabled" sx={{ display: "block" }}>
                Add <code>certificate.png</code> to the /public folder
              </Typography>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary">
            Fundamentals of Computer Systems — Class Project
          </Typography>
        </Container>
      </Box>

      {/* ── TEAM ─────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="md">
          <Typography variant="overline" color="text.disabled" sx={{ display: "block", mb: 4, letterSpacing: 2 }}>
            Team
          </Typography>
          <Grid container spacing={4}>
            {contributors.map((c) => (
              <Grid item xs={12} sm={4} key={c.initials}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      {c.initials}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    {c.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <Box sx={{ py: 3 }}>
        <Container maxWidth="md">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" color="text.disabled">
              Rates: SEC residential tariffs · Carbon: KACARE grid factor · Climate: GAMEP 30-yr normals
            </Typography>
            <Tooltip
              title={<SourcesTooltip />}
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: { maxWidth: 320, bgcolor: "#111", "& .MuiTooltip-arrow": { color: "#111" } },
                },
              }}
            >
              <InfoOutlined sx={{ fontSize: 14, color: "text.disabled", cursor: "pointer", flexShrink: 0 }} />
            </Tooltip>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default LandingPage;
