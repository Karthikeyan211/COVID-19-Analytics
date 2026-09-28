# Power BI Implementation Blueprint: COVID-19 Global Analytics

This document provides a comprehensive guide for importing the ETL processed datasets, building the Star Schema data model, and configuring visualizations in **Power BI Desktop**.

---

## 1. Data Model & Relationships (Star Schema)

The dataset is structured as an optimized dimensional model (Star Schema):

```
       +-------------------+
       |    Dim_Country    |
       +-------------------+
       | CountryCode (PK)  |
       | CountryName       |
       | Region            |
       | Continent         |
       | Population        |
       +---------+---------+
                 | 1
                 |
                 | *
       +---------+---------+                 +-------------------+
       | Fact_COVID_Daily  | *-------------1 |     Dim_Date      |
       +-------------------+                 +-------------------+
       | DateKey (FK)      |                 | DateKey (PK)      |
       | CountryCode (FK)  |                 | Date              |
       | NewCases          |                 | Year              |
       | CumulativeCases   |                 | Quarter           |
       | NewDeaths         |                 | MonthName         |
       | PositivityRate    |                 +---------+---------+
       | Hospitalized      |                           | 1
       +---------+---------+                           |
                 |                                     |
                 | 1:1                                 | *
       +---------+---------+                 +---------+---------+
       | Fact_Vaccinations |                 |   Dim_Variant     |
       +-------------------+                 +-------------------+
       | DateKey (FK)      |                 | VariantID (PK)    |
       | CountryCode (FK)  |                 | VariantName       |
       | DailyDoses        |                 | RiskLevel         |
       | FullyVaccinated   |                 +-------------------+
       +-------------------+
```

### Relationship Configuration Table
| From Table | Column | To Table | Column | Cardinality | Cross Filter Direction |
|---|---|---|---|---|---|
| `Fact_COVID_Daily` | `CountryCode` | `Dim_Country` | `CountryCode` | Many to One (`*:1`) | Single |
| `Fact_COVID_Daily` | `DateKey` | `Dim_Date` | `DateKey` | Many to One (`*:1`) | Single |
| `Fact_Vaccinations` | `CountryCode` | `Dim_Country` | `CountryCode` | Many to One (`*:1`) | Single |
| `Fact_Vaccinations` | `DateKey` | `Dim_Date` | `DateKey` | Many to One (`*:1`) | Single |

---

## 2. Power BI Step-by-Step Dashboard Setup

### Page 1: Executive Overview
- **Header Banner**: Dynamic title showing selected Country and Date range.
- **KPI Cards (4 Top Visuals)**:
  1. `Total Cases` (Card with 7-Day MA sparkline).
  2. `Total Deaths` (Card with Case Fatality Rate % subtitle).
  3. `Vaccination Coverage %` (Gauge Visual target set to 85%).
  4. `Surge Risk Index` (Dynamic Card colored via `Status Color Hex` DAX measure).
- **Main Chart**: Line Chart with `Date` on X-Axis, `New Cases` (Bar) and `7-Day Moving Avg Cases` (Line).
- **Geographic Map**: Filled Map / Bubble Map visual using `Lat`, `Long` & `Total Cases` bubble size.

### Page 2: Regional & Comparative Analysis
- **Matrix Visual**: Region > Country Drill-down showing `Total Cases`, `Cases Per 100k`, `Positivity Rate Avg %`, and `Vaccination Coverage %`.
- **Clustered Bar Chart**: Top 10 Countries by `Cases Per 100k Population`.
- **Scatter Plot**: X-Axis: `Vaccination Coverage %`, Y-Axis: `Case Fatality Rate %`, Bubble Size: `Population`. (Helps analyze vaccine efficacy vs mortality).

### Page 3: Vaccination Progress & Immunity Tracker
- **Stacked Area Chart**: `Cumulative Doses Administered` over time by Region.
- **Waterfall Chart**: Transition from `Unvaccinated` to `Single Dose` to `Fully Vaccinated` to `Booster Received`.
- **Donut Chart**: Distribution of doses by country tier.

### Page 4: Variant Surge & Risk Forecasting
- **Ribbon Chart**: Variant dominance breakdown over time (`Dim_Variant[VariantName]`).
- **Forecasting Visual**: Exponential smoothing 14-day projection using Power BI built-in Analytics pane on `7-Day Moving Avg Cases`.

---

## 3. How to Load Data into Power BI

1. Open Power BI Desktop.
2. Click **Get Data** -> **Text/CSV**.
3. Select the 5 generated files from `data/processed/`:
   - `dim_country.csv`
   - `dim_date.csv`
   - `dim_variant.csv`
   - `fact_covid_daily.csv`
   - `fact_vaccinations.csv`
4. Click **Transform Data** in Power Query to confirm column data types (`DateKey` as Whole Number, `Date` as Date, `NewCases` as Whole Number).
5. Load into Data Model and create a dedicated Measure Table named `_Measures`.
6. Copy & paste formulas from `powerbi/dax_measures.dax` into `_Measures`.
