import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ArrowForward,
  BoltRounded,
  ElectricMeter,
  MonetizationOn,
  NaturePeople,
  FlashOn,
} from "../utils/icons";

// ── Styled components ───────────────────────────────────────────────────────

const HeroSection = styled(Box)({
  minHeight: "100vh",
  // Multi-layer background: dots on top of the dark gradient.
  // Using a single `background` property with comma-separated layers avoids
  // the CSS conflict where `backgroundImage` overrides the `background` shorthand.
  background: [
    "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
    "linear-gradient(135deg, #071322 0%, #0c2317 55%, #071322 100%)",
  ].join(", "),
  backgroundSize: "28px 28px, 100% 100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-20%",
    right: "-10%",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(46,125,50,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-10%",
    left: "5%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,152,0,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
});

const StatCard = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(1.5, 1),
  borderRadius: 12,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(4px)",
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: "100%",
  borderRadius: 20,
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
  },
}));

// Use shouldForwardProp so `iconBg` isn't forwarded to the DOM element
const IconRing = styled(Box, {
  shouldForwardProp: (prop) => prop !== "iconBg",
})(({ iconBg }) => ({
  width: 64,
  height: 64,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 16,
  background: iconBg || "rgba(46,125,50,0.12)",
  "& svg": { fontSize: "2rem" },
}));

// ── Component ───────────────────────────────────────────────────────────────

const LandingPage = ({ onStart }) => (
  <>
    {/* ── HERO ─────────────────────────────────────────────────────── */}
    <HeroSection>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 0 }, position: "relative", zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left: copy */}
          <Grid item xs={12} md={7}>
            {/* Vision 2030 badge */}
            <Chip
              label="Vision 2030 · Energy Efficiency Initiative"
              size="small"
              icon={
                <FlashOn
                  sx={{ fontSize: "14px !important", color: "#ff9800 !important" }}
                />
              }
              sx={{
                mb: 3,
                background: "rgba(255,152,0,0.12)",
                border: "1px solid rgba(255,152,0,0.3)",
                color: "#ffc947",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />

            <Typography
              variant="h1"
              sx={{
                color: "#ffffff",
                fontSize: { xs: "1.85rem", sm: "2.5rem", md: "3.1rem" },
                fontWeight: 800,
                lineHeight: 1.15,
                mb: 3,
              }}
            >
              Your AC is costing you{" "}
              <Box
                component="span"
                sx={{
                  color: "#ff9800",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(255,152,0,0.4)",
                  textUnderlineOffset: "4px",
                }}
              >
                far more
              </Box>{" "}
              than it should.
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.72)",
                fontWeight: 400,
                lineHeight: 1.75,
                mb: 4,
                maxWidth: 520,
                fontSize: { xs: "0.95rem", md: "1.05rem" },
              }}
            >
              Saudi families pay an average of{" "}
              <Box component="span" sx={{ color: "#ffc947", fontWeight: 600 }}>
                SR 18,000/year
              </Box>{" "}
              on electricity — 40% of it wasted. In 3 minutes, discover exactly
              how much you're losing and what smarter appliances could put back in
              your pocket.
            </Typography>

            {/* Stats row */}
            <Grid container spacing={1.5} sx={{ mb: 5 }}>
              {[
                { value: "SR 18K", label: "avg. annual bill", color: "#ff9800" },
                { value: "40%",    label: "typical savings",  color: "#4caf50" },
                { value: "~3 yrs", label: "avg. payback",     color: "#4caf50" },
              ].map((s) => (
                <Grid item xs={4} key={s.label}>
                  <StatCard>
                    <Typography
                      sx={{
                        color: s.color,
                        fontWeight: 700,
                        lineHeight: 1,
                        fontSize: { xs: "1rem", sm: "1.25rem", md: "1.4rem" },
                      }}
                    >
                      {s.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.55)",
                        display: "block",
                        mt: 0.5,
                        fontSize: { xs: "0.65rem", sm: "0.75rem" },
                        lineHeight: 1.3,
                      }}
                    >
                      {s.label}
                    </Typography>
                  </StatCard>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={onStart}
              sx={{
                background: "linear-gradient(135deg, #ff9800 0%, #f44336 100%)",
                color: "#fff",
                px: { xs: 4, md: 6 },
                py: 1.75,
                borderRadius: "50px",
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                fontWeight: 700,
                letterSpacing: 0.5,
                boxShadow: "0 8px 24px rgba(255,152,0,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #e68900 0%, #d32f2f 100%)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 14px 32px rgba(255,152,0,0.45)",
                },
                transition: "all 0.25s ease",
              }}
            >
              Show Me My Waste
            </Button>

            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1.5, color: "rgba(255,255,255,0.38)" }}
            >
              No account required · Takes 3 minutes
            </Typography>
          </Grid>

          {/* Right: visual — desktop only */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center" }}
          >
            <Box sx={{ position: "relative", width: 320, height: 320 }}>
              {/* Blurred glow bolt */}
              <BoltRounded
                sx={{
                  fontSize: 260,
                  color: "#ff9800",
                  opacity: 0.12,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  filter: "blur(4px)",
                }}
              />
              {/* Crisp bolt */}
              <BoltRounded
                sx={{
                  fontSize: 160,
                  color: "#ff9800",
                  opacity: 0.9,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  filter: "drop-shadow(0 0 24px rgba(255,152,0,0.55))",
                }}
              />

              {/* Floating waste card */}
              <Paper
                elevation={0}
                sx={{
                  position: "absolute",
                  top: "6%",
                  right: "-6%",
                  p: 2,
                  background: "rgba(30,30,40,0.85)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,152,0,0.3)",
                  borderRadius: 3,
                  minWidth: 130,
                }}
              >
                <Typography variant="h5" sx={{ color: "#ff9800", fontWeight: 700 }}>
                  SR 6,200
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)" }}>
                  avg. waste / year
                </Typography>
              </Paper>

              {/* Floating savings card */}
              <Paper
                elevation={0}
                sx={{
                  position: "absolute",
                  bottom: "10%",
                  left: "-4%",
                  p: 2,
                  background: "rgba(20,50,25,0.85)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(76,175,80,0.4)",
                  borderRadius: 3,
                  minWidth: 140,
                }}
              >
                <Typography variant="h5" sx={{ color: "#4caf50", fontWeight: 700 }}>
                  ↓ 40%
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)" }}>
                  savings potential
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll hint */}
      <Box
        sx={{
          textAlign: "center",
          position: "absolute",
          bottom: 24,
          width: "100%",
          zIndex: 1,
        }}
      >
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.28)" }}>
          scroll to learn more ↓
        </Typography>
      </Box>
    </HeroSection>

    {/* ── WHY IT MATTERS ──────────────────────────────────────────── */}
    <Box sx={{ py: { xs: 8, md: 12 }, background: "#fafafa" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Why Saudi homes waste more energy
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 540, mx: "auto" }}
          >
            Three forces are raising your bill — and Vision 2030 efficiency
            programs are creating a narrow window to act.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              icon:   <ElectricMeter sx={{ color: "#f44336" }} />,
              iconBg: "rgba(244,67,54,0.1)",
              title:  "Saudi Summers Are Extreme",
              body:
                "45 °C heat forces ACs to work twice as hard as in Europe. An old-technology unit can consume 80% more power than an equivalent inverter model — without cooling any better.",
              accent: "#f44336",
            },
            {
              icon:   <MonetizationOn sx={{ color: "#ff9800" }} />,
              iconBg: "rgba(255,152,0,0.1)",
              title:  "Tiered Rates Are Rising",
              body:
                "SEC's four-tier structure means the last kilowatt-hour you use costs twice as much as the first. Reducing peak usage saves at the highest rate — multiplying your savings.",
              accent: "#ff9800",
            },
            {
              icon:   <NaturePeople sx={{ color: "#2e7d32" }} />,
              iconBg: "rgba(46,125,50,0.1)",
              title:  "Vision 2030 Incentives",
              body:
                "Saudi Arabia's energy-efficiency roadmap targets a 43% reduction in consumption by 2030. Inverter ACs and solar water heaters pay for themselves in under three years.",
              accent: "#2e7d32",
            },
          ].map((card) => (
            <Grid item xs={12} md={4} key={card.title}>
              <FeatureCard elevation={0} sx={{ border: "1.5px solid rgba(0,0,0,0.07)" }}>
                <IconRing iconBg={card.iconBg}>{card.icon}</IconRing>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                  sx={{ color: card.accent }}
                >
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
                  {card.body}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>

    {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
    <Box sx={{ py: { xs: 8, md: 10 }, background: "#ffffff" }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
          How it works
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6 }}
        >
          Three steps, three minutes.
        </Typography>

        <Grid container spacing={3}>
          {[
            {
              num:   "01",
              title: "Enter your property",
              body:  "Pick your city — Riyadh, Jeddah, Dammam, or Mecca. Climate defaults adjust automatically.",
            },
            {
              num:   "02",
              title: "Tell us your appliances",
              body:  "How many ACs, fridges, and water heaters you have, and roughly how old they are.",
            },
            {
              num:   "03",
              title: "Get your personalised report",
              body:  "See exact SAR savings, payback period, and a PDF report you can share.",
            },
          ].map((step) => (
            <Grid item xs={12} sm={4} key={step.num}>
              <Box sx={{ textAlign: "center", px: 1 }}>
                <Typography
                  variant="h2"
                  sx={{
                    color: "primary.main",
                    opacity: 0.18,
                    fontWeight: 800,
                    lineHeight: 1,
                    mb: 1,
                  }}
                >
                  {step.num}
                </Typography>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                  {step.body}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 7 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={onStart}
            sx={{
              background: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
              px: 6,
              py: 1.75,
              borderRadius: "50px",
              fontSize: "1rem",
              fontWeight: 700,
              boxShadow: "0 8px 24px rgba(46,125,50,0.3)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 14px 32px rgba(46,125,50,0.4)",
              },
              transition: "all 0.25s ease",
            }}
          >
            Start My Calculation
          </Button>
        </Box>
      </Container>
    </Box>

    {/* ── FOOTER ──────────────────────────────────────────────────── */}
    <Box
      sx={{
        py: 3,
        px: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        textAlign: "center",
        background: "#fafafa",
      }}
    >
      <Typography variant="caption" color="text.disabled">
        Built in support of Vision 2030 · Saudi Energy Efficiency Program (SEEP) · Data based on SEC residential tariffs
      </Typography>
    </Box>
  </>
);

export default LandingPage;
