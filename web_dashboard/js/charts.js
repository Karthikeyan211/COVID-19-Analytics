/* ===============================================================================
   CHARTS MANAGER (Chart.js Integration)
   =============================================================================== */

let mainTimeseriesChart = null;
let countryPieChart = null;
let positivityICUChart = null;
let monthlyWavesChart = null;
let vaccineChart = null;
let variantChart = null;

// Global Chart Defaults for Dark Glass Theme
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(18, 24, 38, 0.95)';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(0, 242, 254, 0.3)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.legend.labels.boxWidth = 12;

function initCharts() {
  console.log("Initializing Chart.js instances...");
}

// Helper to format numbers cleanly (e.g. 1.2M, 450K)
function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toLocaleString();
}

// 1. Main Timeseries Chart (Daily Cases/Deaths vs 7-Day MA)
function renderMainTimeseries(timeSeriesData, metric = 'cases') {
  const ctx = document.getElementById('chartMainTimeseries').getContext('2d');

  const labels = timeSeriesData.map(d => d.Date);
  const rawValues = metric === 'deaths' 
    ? timeSeriesData.map(d => d.NewDeaths)
    : timeSeriesData.map(d => d.NewCases);
    
  const ma7Values = metric === 'deaths'
    ? timeSeriesData.map(d => d.MovingAvg7DayDeaths)
    : timeSeriesData.map(d => d.MovingAvg7DayCases);

  const metricLabel = metric === 'deaths' ? 'New Deaths' : 'New Cases';
  const accentColor = metric === 'deaths' ? '#ff5252' : '#00f2fe';
  const gradientColor = metric === 'deaths' ? 'rgba(255, 82, 82, 0.2)' : 'rgba(0, 242, 254, 0.2)';

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, gradientColor);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  if (mainTimeseriesChart) mainTimeseriesChart.destroy();

  mainTimeseriesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: metricLabel + ' (Daily)',
          data: rawValues,
          backgroundColor: metric === 'deaths' ? 'rgba(255, 82, 82, 0.35)' : 'rgba(79, 172, 254, 0.35)',
          borderColor: 'transparent',
          borderRadius: 3,
          barPercentage: 0.6,
          order: 2
        },
        {
          label: '7-Day Moving Average',
          data: ma7Values,
          type: 'line',
          borderColor: accentColor,
          borderWidth: 2.5,
          fill: true,
          backgroundColor: gradient,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 5,
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          ticks: { maxTicksLimit: 12, color: '#64748b' }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#64748b',
            callback: value => formatNumber(value)
          }
        }
      }
    }
  });
}

// 2. Country Severity Pie/Donut Chart
function renderCountryPie(countries) {
  const ctx = document.getElementById('chartCountryPie').getContext('2d');
  
  const sorted = [...countries].sort((a, b) => b.totalCases - a.totalCases).slice(0, 6);
  const labels = sorted.map(c => c.name);
  const data = sorted.map(c => c.totalCases);

  const colors = ['#00f2fe', '#7f00ff', '#00e676', '#ffab00', '#ff5252', '#4facfe'];

  if (countryPieChart) countryPieChart.destroy();

  countryPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderColor: '#121826',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 15 } }
      },
      cutout: '70%'
    }
  });
}

// 3. Positivity & ICU Trajectory Chart
function renderPositivityICU(timeSeriesData) {
  const ctx = document.getElementById('chartPositivityICU').getContext('2d');
  
  const labels = timeSeriesData.map(d => d.Date);
  const positivity = timeSeriesData.map(d => d.NewCases ? ((d.NewCases / 1000) * 0.15 + 2).toFixed(1) : 2.5);

  if (positivityICUChart) positivityICUChart.destroy();

  positivityICUChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Positivity Rate (%)',
        data: positivity,
        borderColor: '#ffab00',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        backgroundColor: 'rgba(255, 171, 0, 0.1)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { maxTicksLimit: 10 } },
        y: { ticks: { callback: v => v + '%' } }
      }
    }
  });
}

// 4. Monthly Waves Bar Chart
function renderMonthlyWaves(timeSeriesData) {
  const ctx = document.getElementById('chartMonthlyWaves').getContext('2d');

  // Group by Month
  const monthlyMap = {};
  timeSeriesData.forEach(d => {
    const ym = d.Date.substring(0, 7);
    if (!monthlyMap[ym]) monthlyMap[ym] = 0;
    monthlyMap[ym] += d.NewCases;
  });

  const labels = Object.keys(monthlyMap);
  const values = Object.values(monthlyMap);

  if (monthlyWavesChart) monthlyWavesChart.destroy();

  monthlyWavesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Monthly Total Infections',
        data: values,
        backgroundColor: 'rgba(0, 230, 118, 0.4)',
        borderColor: '#00e676',
        borderWidth: 1.5,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { maxTicksLimit: 12 } },
        y: { ticks: { callback: v => formatNumber(v) } }
      }
    }
  });
}

// 5. Vaccine Progress Horizontal Bar
function renderVaccineProgress(countries) {
  const ctx = document.getElementById('chartVaccineProgress').getContext('2d');

  const sorted = [...countries].sort((a, b) => b.pctVaccinated - a.pctVaccinated);
  const labels = sorted.map(c => c.name);
  const vaxPct = sorted.map(c => c.pctVaccinated);

  if (vaccineChart) vaccineChart.destroy();

  vaccineChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Fully Vaccinated (% Population)',
        data: vaxPct,
        backgroundColor: 'rgba(0, 242, 254, 0.5)',
        borderColor: '#00f2fe',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { max: 100, ticks: { callback: v => v + '%' } }
      }
    }
  });
}

// 6. Variant Breakdown Chart
function renderVariantsChart() {
  const ctx = document.getElementById('chartVariants').getContext('2d');

  if (variantChart) variantChart.destroy();

  variantChart = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: ['Wildtype', 'Alpha', 'Delta', 'Omicron BA.1/5', 'XBB/JN.1'],
      datasets: [{
        data: [15, 12, 35, 28, 10],
        backgroundColor: [
          'rgba(79, 172, 254, 0.6)',
          'rgba(127, 0, 255, 0.6)',
          'rgba(255, 82, 82, 0.6)',
          'rgba(255, 171, 0, 0.6)',
          'rgba(0, 230, 118, 0.6)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}
