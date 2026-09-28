/* ===============================================================================
   POWER BI EXPLORER MODULE (DAX Library & Schema Viewer)
   =============================================================================== */

const DAX_LIBRARY = [
  {
    name: "Total Cases",
    category: "CORE",
    description: "Calculates the total aggregate confirmed COVID-19 cases.",
    code: `Total Cases = \nSUM(Fact_COVID_Daily[NewCases])`
  },
  {
    name: "Total Deaths",
    category: "CORE",
    description: "Calculates the cumulative fatality toll across selected dimension filters.",
    code: `Total Deaths = \nSUM(Fact_COVID_Daily[NewDeaths])`
  },
  {
    name: "Case Fatality Rate % (CFR)",
    category: "RATIOS",
    description: "Computes the percentage of confirmed cases that resulted in mortality.",
    code: `Case Fatality Rate % = \nDIVIDE(\n    [Total Deaths],\n    [Total Cases],\n    0\n) * 100`
  },
  {
    name: "Cases Per 100k Population",
    category: "RATIOS",
    description: "Normalized infection incidence per 100,000 residents.",
    code: `Cases Per 100k Population = \nDIVIDE(\n    [Total Cases],\n    SUM(Dim_Country[Population]),\n    0\n) * 100000`
  },
  {
    name: "7-Day Moving Avg Cases",
    category: "TIME",
    description: "Smooths daily reporting fluctuations using a 7-day rolling window.",
    code: `7-Day Moving Avg Cases = \nAVERAGEX(\n    DATESINPERIOD(\n        Dim_Date[Date],\n        LASTDATE(Dim_Date[Date]),\n        -7,\n        DAY\n    ),\n    [Total Cases]\n)`
  },
  {
    name: "Week-over-Week (WoW) Growth %",
    category: "TIME",
    description: "Percentage growth in infections compared to the exact prior 7-day period.",
    code: `WoW Case Growth % = \nVAR CurrentWeek = [Total Cases]\nVAR PreviousWeek = CALCULATE([Total Cases], DATEADD(Dim_Date[Date], -7, DAY))\nRETURN\nDIVIDE(CurrentWeek - PreviousWeek, PreviousWeek, 0) * 100`
  },
  {
    name: "Surge Risk Index",
    category: "SURGE",
    description: "Dynamic multi-condition alert classifier based on WoW growth and positivity rate.",
    code: `Surge Risk Index = \nVAR Growth = [WoW Case Growth %]\nVAR Positivity = AVERAGE(Fact_COVID_Daily[PositivityRate])\nRETURN\nSWITCH(\n    TRUE(),\n    Growth > 50 || Positivity > 15, "Critical Surge (Red)",\n    Growth > 20 || Positivity > 8, "Moderate Surge (Orange)",\n    Growth > 0 || Positivity > 3, "Watch Status (Yellow)",\n    "Controlled / Stable (Green)"\n)`
  },
  {
    name: "Vaccination Coverage %",
    category: "RATIOS",
    description: "Percentage of the target population fully vaccinated.",
    code: `Vaccination Coverage % = \nDIVIDE(\n    MAX(Fact_Vaccinations[FullyVaccinated]),\n    SUM(Dim_Country[Population]),\n    0\n) * 100`
  }
];

function renderDAXLibrary(categoryFilter = 'ALL') {
  const container = document.getElementById('daxMeasuresContainer');
  if (!container) return;

  const filtered = categoryFilter === 'ALL' 
    ? DAX_LIBRARY 
    : DAX_LIBRARY.filter(d => d.category === categoryFilter);

  container.innerHTML = filtered.map((measure, idx) => `
    <div style="background: rgba(22, 30, 48, 0.6); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 1.2rem; margin-bottom: 1rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <div>
          <strong style="font-family: 'Outfit'; font-size: 1.05rem; color: var(--primary-cyan);">${measure.name}</strong>
          <span style="font-size: 0.72rem; background: rgba(0, 242, 254, 0.12); color: var(--primary-cyan); padding: 2px 8px; border-radius: 12px; margin-left: 8px;">${measure.category}</span>
        </div>
        <button class="btn-copy" onclick="copyDAXCode(${idx})"><i class="fa-regular fa-copy"></i> Copy DAX</button>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 10px;">${measure.description}</p>
      <pre class="dax-code-box" id="daxCodeSnippet_${idx}"><code>${escapeHtml(measure.code)}</code></pre>
    </div>
  `).join('');
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function copyDAXCode(idx) {
  const code = DAX_LIBRARY[idx].code;
  navigator.clipboard.writeText(code).then(() => {
    alert(`Copied DAX measure "${DAX_LIBRARY[idx].name}" to clipboard!`);
  });
}
