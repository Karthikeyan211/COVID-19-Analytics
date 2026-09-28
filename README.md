# COVID-19 Analytics & Power BI Data Studio

An end-to-end COVID-19 global analytics solution featuring a **Python ETL pipeline**, a **Power BI Star Schema data model with 30+ DAX measures**, and a **glassmorphic interactive Web Analytics Dashboard preview**.

---

## 📁 Project Architecture

```
covid19_analytics_dashboard/
├── data/
│   └── processed/            # Power BI-ready CSV datasets
│       ├── dim_country.csv
│       ├── dim_date.csv
│       ├── dim_variant.csv
│       ├── fact_covid_daily.csv
│       └── fact_vaccinations.csv
├── python_etl/
│   └── etl_pipeline.py       # Python ETL pipeline script
├── powerbi/
│   ├── dax_measures.dax      # Complete library of 30+ DAX measures
│   └── powerbi_guide.md      # Data model schema & Power BI setup guide
├── web_dashboard/            # Interactive Web Dashboard Preview
│   ├── index.html
│   ├── css/styles.css
│   ├── js/
│   │   ├── app.js            # Main dashboard controller
│   │   ├── charts.js         # Chart.js visual renderers
│   │   ├── map.js            # Leaflet dark map visualizer
│   │   └── powerbi_explorer.js # DAX explorer & code copy studio
│   └── data/
│       └── covid_dashboard_data.json
└── README.md
```

---

## 🚀 How to Run the Project

### Option 1: View the Live Web Analytics Dashboard

The local web server is currently running on **`http://localhost:8080`**.

To manually start or restart the local web server:

1. Open your terminal in the project directory:
   ```bash
   cd C:\Users\Karthikeyan\.gemini\antigravity-ide\scratch\covid19_analytics_dashboard
   ```
2. Run Python's built-in HTTP server:
   ```bash
   python -m http.server 8080 --directory web_dashboard
   ```
3. Open your browser and navigate to: **`http://localhost:8080`**

---

### Option 2: Re-run the Python ETL Pipeline

If you want to re-process raw data, re-calculate 7-day moving averages, or regenerate the dataset:

1. Open your terminal:
   ```bash
   cd C:\Users\Karthikeyan\.gemini\antigravity-ide\scratch\covid19_analytics_dashboard
   ```
2. Execute the ETL pipeline script:
   ```bash
   python python_etl/etl_pipeline.py
   ```
   *This script cleans, transforms, calculates rolling epidemiology statistics, and outputs updated CSV files to `data/processed/` and updated JSON to `web_dashboard/data/`.*

---

### Option 3: Load Datasets into Power BI Desktop

1. Launch **Power BI Desktop**.
2. Click **Get Data** -> **Text/CSV**.
3. Import the generated CSV files from `data/processed/`:
   - `dim_country.csv`
   - `dim_date.csv`
   - `dim_variant.csv`
   - `fact_covid_daily.csv`
   - `fact_vaccinations.csv`
4. Set up the **Star Schema relationships** as described in `powerbi/powerbi_guide.md`:
   - `Fact_COVID_Daily[CountryCode]` -> `Dim_Country[CountryCode]` (Many-to-1)
   - `Fact_COVID_Daily[DateKey]` -> `Dim_Date[DateKey]` (Many-to-1)
   - `Fact_Vaccinations[CountryCode]` -> `Dim_Country[CountryCode]` (Many-to-1)
   - `Fact_Vaccinations[DateKey]` -> `Dim_Date[DateKey]` (Many-to-1)
5. Create a new measure table named `_Measures` and copy DAX formulas from `powerbi/dax_measures.dax` (or from the **Power BI DAX Studio** tab in the web dashboard).

---

## 🛠️ Features Summary

- **Executive Dashboard**: Interactive KPI metrics, 7-day moving average trend charts, positivity rates, monthly wave matrices.
- **Geographic Heatmap**: Interactive dark map with glowing epidemic markers scaled by infection intensity or vaccination coverage.
- **Vaccine & Variants Tracker**: Doses administered per country and variant dominance timeline.
- **Power BI DAX Studio**: Star Schema interactive diagram and copyable DAX formula library with 1-click clipboard copy buttons.
- **Python ETL Studio**: Direct CSV download buttons and execution pipeline log viewer.
