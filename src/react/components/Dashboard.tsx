import { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  useLatestProtocolStats,
  useProtocolStatsHistory,
} from "../hooks/useProtocolStats";
import { useLatestCdpMetrics } from "../hooks/useCdpMetrics";
import { useLatestTVLMetrics, useTVLMetricsHistory } from "../hooks/useTvlMetrics";
import { MetricCard } from "./common/MetricCard";
import { TVLChart } from "./charts/TVLChart";
import { formatCurrency } from "../../utils/formatters";
import { Link } from "react-router-dom";
import { useContractMapping } from "../../contexts/ContractMappingContext";

interface AssetDetailAccordionProps {
  asset: string;
  row: any;
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  dateParams: { start_time: string; end_time: string };
}

function AssetDetailAccordion({
  asset,
  row,
  expanded,
  onChange,
  dateParams,
}: AssetDetailAccordionProps) {
  const theme = useTheme();

  // Fetch historical data for this asset
  const { data: assetHistory, isLoading: assetHistoryLoading } =
    useTVLMetricsHistory(asset, dateParams, {
      enabled: expanded, // Only fetch when expanded
    });

  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      sx={{
        mb: 2,
        borderRadius: "var(--radius-md)",
        "&:before": { display: "none" },
        boxShadow: "none",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          borderRadius: "var(--radius-md)",
          "&.Mui-expanded": {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            mr: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {asset}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                TVL
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatCurrency(row.tvl, 14, 2, "USD")}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Market Cap
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatCurrency(row.marketCap, 14, 2, "USD")}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Protocol Share
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {row.collateralRatio
                  ? `${formatCurrency(row.collateralRatio, 0, 2, "%")}`
                  : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          pt: 3,
          pb: 4,
          px: 3,
        }}
      >
        {/* Supply over time chart */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: "var(--radius-md)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Supply over time
            </Typography>
            {/* Simplified time selector - could be enhanced later */}
            <Typography variant="caption" color="text.secondary">
              30d
            </Typography>
          </Box>
          <TVLChart
            data={assetHistory || []}
            type="asset"
            assetSymbol={asset}
            isLoading={assetHistoryLoading}
            showTitle={false}
          />
        </Paper>

        {/* Two-column layout: Collateralization and Stability Pools */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: "var(--radius-md)",
                height: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Collateralization
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Collateral Locked
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(row.deposits, 7, 2, "XLM")}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Debt Minted
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(row.minted, 7, 2, asset)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Global Ratio
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {row.collateralRatio
                      ? formatCurrency(row.collateralRatio, 0, 2, "%")
                      : "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: "var(--radius-md)",
                height: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Stability Pools
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Deposited
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(row.minted, 7, 2, asset)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    APY
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {/* Placeholder - real APY data not available in current hooks */}
                    11%
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default function Dashboard() {
  const theme = useTheme();
  const contractMapping = useContractMapping();
  const assetSymbols = Object.keys(contractMapping);
  const [expandedAsset, setExpandedAsset] = useState<string | false>(false);

  const dateParams = useMemo(
    () => ({
      start_time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date().toISOString(),
    }),
    [],
  );

  const {
    data: protocolStats,
    isLoading: statsLoading,
    error: statsError,
  } = useLatestProtocolStats();

  const {
    data: statsHistory,
    isLoading: historyLoading,
    error: historyError,
  } = useProtocolStatsHistory(dateParams);

  // Top section metrics
  const topMetrics = [
    {
      title: "Total Value Locked",
      value: protocolStats?.globalMetrics.totalValueLocked,
      format: (val: any) => formatCurrency(val, 14, 2, "USD"),
      change: protocolStats?.growthMetrics.tvlGrowth24h,
    },
    {
      title: "Total Market Cap",
      value: protocolStats?.globalMetrics.totalDebt,
      format: (val: any) => formatCurrency(val, 14, 2, "USD"),
    },
    {
      title: "Total Staked",
      value: protocolStats?.globalMetrics.totalStaked,
      format: (val: any) => formatCurrency(val, 14, 2, "USD"),
    },
    {
      title: "System Collateral Ratio",
      value: protocolStats?.riskMetrics.systemCollateralization,
      format: (value: any) => formatCurrency(value, 0, 2, "%"),
    },
  ];

  const cdpRows = assetSymbols.map((symbol) => {
    const { data: cdpMetrics, error: cdpError } = useLatestCdpMetrics(symbol);
    const { data: tvlMetrics, error: tvlError } = useLatestTVLMetrics(symbol);

    if (cdpError || tvlError) {
      return {
        asset: symbol,
        error: true,
      };
    }

    return {
      asset: symbol,
      collateralRatio: cdpMetrics?.collateralRatio,
      rewardFrequency: "Daily",
      deposits: tvlMetrics?.totalXlmLocked,
      minted: tvlMetrics?.totalXassetsMinted,
      marketCap: tvlMetrics?.totalXassetsMintedUSD,
      tvl: tvlMetrics?.tvlUSD,
    };
  });

  if (statsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load protocol statistics. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      {/* TVL Chart */}
      <Paper component={Box} sx={{ p: 2, mb: 4 }}>
        {historyError ? (
          <Alert severity="error">Failed to load TVL history data</Alert>
        ) : (
          <TVLChart
            data={statsHistory || []}
            type="protocol"
            isLoading={historyLoading}
          />
        )}
      </Paper>

      {/* Top Metrics Grid */}
      <Grid
        container
        spacing={3}
        mb={4}
        className="metric-card-grid"
        id="metric-cards"
        sx={{
          margin: 0,
          width: 1,
          gap: "20px",
        }}
      >
        {topMetrics.map((metric, index) => (
          <Grid
            item
            xs={12}
            md={3}
            key={index}
            className="metric-card-container"
          >
            <MetricCard
              title={metric.title}
              value={metric.format(metric.value)}
              change={metric.change}
              isLoading={statsLoading}
            />
          </Grid>
        ))}
      </Grid>

      {/* Asset Details Accordions */}
      <Box sx={{ mb: 4 }}>
        {cdpRows.map((row) => {
          const handleAccordionChange = (asset: string) => (
            _event: React.SyntheticEvent,
            isExpanded: boolean
          ) => {
            setExpandedAsset(isExpanded ? asset : false);
          };

          if (row.error) {
            return (
              <Alert severity="error" key={row.asset} sx={{ mb: 2 }}>
                Failed to load data for {row.asset}
              </Alert>
            );
          }

          return (
            <AssetDetailAccordion
              key={row.asset}
              asset={row.asset}
              row={row}
              expanded={expandedAsset === row.asset}
              onChange={handleAccordionChange(row.asset)}
              dateParams={dateParams}
            />
          );
        })}
      </Box>

      {/* CDP Table */}
      {/*
      <TableContainer component={Paper} sx={{ border: 5, borderColor: theme.palette.background.paper, borderRadius: 10 }}>
        <Table>
          <TableHead sx={{ borderBottom: 1, borderColor: theme.palette.text.secondary }}>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Total Minted</TableCell>
              <TableCell>SP Deposits</TableCell>
              <TableCell>SP Deposits USD</TableCell>
              <TableCell>Market Cap</TableCell>
              <TableCell>CDP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cdpRows.map((row) => (
              <TableRow key={row.asset}>
                <TableCell>{row.asset}</TableCell>
                {row.error ? (
                  <TableCell colSpan={6}>
                    <Alert severity="error" sx={{ my: 1 }}>
                      Failed to load data for this asset
                    </Alert>
                  </TableCell>
                ) : (
                  <>
                    <TableCell>{formatCurrency(row.minted!, 7, 2, row.asset)}</TableCell>
                    <TableCell>{formatCurrency(row.deposits!, 7, 2, "XLM")}</TableCell>
                    <TableCell>{formatCurrency(row.tvl!, 14, 2, "USD")}</TableCell>
                    <TableCell>{formatCurrency(row.marketCap!, 14, 2, "USD")}</TableCell>
                    <TableCell>
                      <Typography
                        variant="button"
                        component={Link}
                        to={`/cdps/${row.asset}`}
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                      >
                        View
                      </Typography>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      */}

      {/* Global Loading State */}
      {statsLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: theme.palette.background.default,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
