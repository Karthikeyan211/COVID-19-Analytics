import os
import sys
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def build_dataset():
    print("[1/5] Initializing COVID-19 ETL Data Pipeline...")
    
    # Define directory paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_dir = os.path.join(base_dir, "data", "raw")
    processed_dir = os.path.join(base_dir, "data", "processed")
    web_data_dir = os.path.join(base_dir, "web_dashboard", "data")
    
    for d in [raw_dir, processed_dir, web_data_dir]:
        os.makedirs(d, exist_ok=True)

    print("[2/5] Generating Dimension Tables...")
    
    # 1. Dim_Country
    countries_data = [
        {"CountryCode": "USA", "CountryName": "United States", "Region": "North America", "Continent": "North America", "Population": 331893745, "MedianAge": 38.5, "GDP_per_capita": 65297, "HospitalBeds_per_1k": 2.9, "Lat": 37.0902, "Long": -95.7129},
        {"CountryCode": "IND", "CountryName": "India", "Region": "South Asia", "Continent": "Asia", "Population": 1408044253, "MedianAge": 28.7, "GDP_per_capita": 2100, "HospitalBeds_per_1k": 0.5, "Lat": 20.5937, "Long": 78.9629},
        {"CountryCode": "BRA", "CountryName": "Brazil", "Region": "Latin America", "Continent": "South America", "Population": 214326223, "MedianAge": 33.5, "GDP_per_capita": 8920, "HospitalBeds_per_1k": 2.2, "Lat": -14.2350, "Long": -51.9253},
        {"CountryCode": "GBR", "CountryName": "United Kingdom", "Region": "Western Europe", "Continent": "Europe", "Population": 67326569, "MedianAge": 40.5, "GDP_per_capita": 42330, "HospitalBeds_per_1k": 2.5, "Lat": 55.3781, "Long": -3.4360},
        {"CountryCode": "FRA", "CountryName": "France", "Region": "Western Europe", "Continent": "Europe", "Population": 67749632, "MedianAge": 42.0, "GDP_per_capita": 43510, "HospitalBeds_per_1k": 5.9, "Lat": 46.2276, "Long": 2.2137},
        {"CountryCode": "DEU", "CountryName": "Germany", "Region": "Western Europe", "Continent": "Europe", "Population": 83190556, "MedianAge": 47.8, "GDP_per_capita": 48200, "HospitalBeds_per_1k": 8.0, "Lat": 51.1657, "Long": 10.4515},
        {"CountryCode": "JPN", "CountryName": "Japan", "Region": "East Asia", "Continent": "Asia", "Population": 125681593, "MedianAge": 48.6, "GDP_per_capita": 39300, "HospitalBeds_per_1k": 13.0, "Lat": 36.2048, "Long": 138.2529},
        {"CountryCode": "ZAF", "CountryName": "South Africa", "Region": "Southern Africa", "Continent": "Africa", "Population": 59308690, "MedianAge": 27.6, "GDP_per_capita": 6000, "HospitalBeds_per_1k": 2.3, "Lat": -30.5595, "Long": 22.9375},
        {"CountryCode": "AUS", "CountryName": "Australia", "Region": "Oceania", "Continent": "Oceania", "Population": 25687041, "MedianAge": 37.5, "GDP_per_capita": 51800, "HospitalBeds_per_1k": 3.8, "Lat": -25.2744, "Long": 133.7751},
        {"CountryCode": "CAN", "CountryName": "Canada", "Region": "North America", "Continent": "North America", "Population": 38246108, "MedianAge": 41.1, "GDP_per_capita": 46200, "HospitalBeds_per_1k": 2.5, "Lat": 56.1304, "Long": -106.3468},
        {"CountryCode": "ITA", "CountryName": "Italy", "Region": "Southern Europe", "Continent": "Europe", "Population": 59037474, "MedianAge": 47.3, "GDP_per_capita": 35200, "HospitalBeds_per_1k": 3.2, "Lat": 41.8719, "Long": 12.5674},
        {"CountryCode": "ESP", "CountryName": "Spain", "Region": "Southern Europe", "Continent": "Europe", "Population": 47415750, "MedianAge": 44.9, "GDP_per_capita": 30100, "HospitalBeds_per_1k": 3.0, "Lat": 40.4637, "Long": -3.7492}
    ]
    df_country = pd.DataFrame(countries_data)
    df_country.to_csv(os.path.join(processed_dir, "dim_country.csv"), index=False)
    
    # 2. Dim_Date (2020-01-01 to 2023-12-31)
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2023, 12, 31)
    date_list = [start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)]
    
    date_records = []
    for d in date_list:
        date_records.append({
            "DateKey": int(d.strftime("%Y%m%d")),
            "Date": d.strftime("%Y-%m-%d"),
            "Year": d.year,
            "Quarter": f"Q{(d.month - 1) // 3 + 1}",
            "Month": d.month,
            "MonthName": d.strftime("%B"),
            "WeekOfYear": d.isocalendar()[1],
            "DayOfWeek": d.strftime("%A"),
            "IsWeekend": 1 if d.weekday() >= 5 else 0
        })
    df_date = pd.DataFrame(date_records)
    df_date.to_csv(os.path.join(processed_dir, "dim_date.csv"), index=False)

    # 3. Dim_Variant
    variants_data = [
        {"VariantID": "VAR01", "VariantName": "Wildtype (Original)", "RiskLevel": "Baseline", "FirstDetected": "2019-12-01"},
        {"VariantID": "VAR02", "VariantName": "Alpha (B.1.1.7)", "RiskLevel": "VOC", "FirstDetected": "2020-09-01"},
        {"VariantID": "VAR03", "VariantName": "Beta (B.1.351)", "RiskLevel": "VOC", "FirstDetected": "2020-10-01"},
        {"VariantID": "VAR04", "VariantName": "Gamma (P.1)", "RiskLevel": "VOC", "FirstDetected": "2020-11-01"},
        {"VariantID": "VAR05", "VariantName": "Delta (B.1.617.2)", "RiskLevel": "High VOC", "FirstDetected": "2020-10-01"},
        {"VariantID": "VAR06", "VariantName": "Omicron (BA.1/BA.5)", "RiskLevel": "High VOC", "FirstDetected": "2021-11-01"},
        {"VariantID": "VAR07", "VariantName": "Omicron Subvariants (XBB/JN.1)", "RiskLevel": "VOI", "FirstDetected": "2022-10-01"}
    ]
    df_variant = pd.DataFrame(variants_data)
    df_variant.to_csv(os.path.join(processed_dir, "dim_variant.csv"), index=False)

    print("[3/5] Generating Fact Tables with Realistic Epidemiology Waves...")
    
    np.random.seed(42)
    fact_daily_records = []
    fact_vax_records = []

    for c in countries_data:
        code = c["CountryCode"]
        pop = c["Population"]
        
        # Epidemiology wave parameters for each country
        # Waves: Wave 1 (Spring 2020), Wave 2 (Winter 2020), Wave 3 (Delta Summer 2021), Wave 4 (Omicron Winter 2021-2022), Wave 5 (2022-2023)
        cum_cases = 0
        cum_deaths = 0
        doses_admin = 0
        fully_vax = 0
        boosters = 0

        for d_idx, d in enumerate(date_list):
            dt_str = d.strftime("%Y-%m-%d")
            date_key = int(d.strftime("%Y%m%d"))
            day_num = (d - start_date).days

            # Generate epidemic curve using multi-peak wave functions
            # Wave 1: day 60-120
            w1 = np.exp(-((day_num - 90)/25)**2) * (pop / 330e6) * 30000
            # Wave 2: day 300-390
            w2 = np.exp(-((day_num - 340)/35)**2) * (pop / 330e6) * 180000
            # Wave 3 (Delta): day 540-620
            w3 = np.exp(-((day_num - 580)/30)**2) * (pop / 330e6) * 150000
            # Wave 4 (Omicron mega surge): day 720-780
            w4 = np.exp(-((day_num - 750)/25)**2) * (pop / 330e6) * 750000
            # Wave 5: day 1000-1100
            w5 = np.exp(-((day_num - 1050)/40)**2) * (pop / 330e6) * 120000

            # Base noise & weekly periodicity
            weekend_factor = 0.65 if d.weekday() >= 5 else 1.15
            noise = np.random.uniform(0.85, 1.15)
            
            raw_new_cases = int(max(0, (w1 + w2 + w3 + w4 + w5) * noise * weekend_factor))
            
            # Fatality rate decreases over time due to treatments & vaccines (from 2.5% down to 0.2%)
            cfr_factor = max(0.002, 0.025 * (1 - min(day_num, 1000) / 1100))
            raw_new_deaths = int(max(0, raw_new_cases * cfr_factor * np.random.uniform(0.7, 1.3)))
            
            # Hospitalizations and ICU
            hosp = int(raw_new_cases * np.random.uniform(0.04, 0.08))
            icu = int(hosp * np.random.uniform(0.15, 0.25))
            
            # Positivity rate fluctuates with wave intensity
            positivity = min(35.0, max(0.5, (raw_new_cases / (pop / 10000)) * 0.8 + np.random.uniform(1.0, 3.0)))

            cum_cases += raw_new_cases
            cum_deaths += raw_new_deaths

            # Vaccination rollouts start around day 350 (Late Dec 2020)
            if day_num > 350:
                vax_rate = np.sin(min(np.pi, (day_num - 350) / 600)) * (pop * 0.0025) * np.random.uniform(0.8, 1.2)
                daily_doses = int(max(0, vax_rate))
            else:
                daily_doses = 0

            doses_admin += daily_doses
            fully_vax = int(min(pop * 0.82, doses_admin * 0.46))
            boosters = int(min(pop * 0.55, max(0, (doses_admin - fully_vax * 2) * 0.8)))

            pct_vax = round(min(100.0, (fully_vax / pop) * 100), 2)

            fact_daily_records.append({
                "DateKey": date_key,
                "CountryCode": code,
                "Date": dt_str,
                "NewCases": raw_new_cases,
                "CumulativeCases": cum_cases,
                "NewDeaths": raw_new_deaths,
                "CumulativeDeaths": cum_deaths,
                "ActiveCases": int(raw_new_cases * 14 * np.random.uniform(0.8, 1.1)),
                "PositivityRate": round(positivity, 2),
                "Hospitalized": hosp,
                "ICUPatients": icu
            })

            fact_vax_records.append({
                "DateKey": date_key,
                "CountryCode": code,
                "Date": dt_str,
                "DailyDoses": daily_doses,
                "CumulativeDoses": doses_admin,
                "FullyVaccinated": fully_vax,
                "BoosterDoses": boosters,
                "PctVaccinated": pct_vax
            })

    df_fact_daily = pd.DataFrame(fact_daily_records)
    df_fact_vax = pd.DataFrame(fact_vax_records)

    print("[4/5] Calculating Advanced 7-Day Moving Averages & Metrics...")
    # Calculate 7-day MA for Cases and Deaths per Country
    df_fact_daily.sort_values(["CountryCode", "DateKey"], inplace=True)
    df_fact_daily["MovingAvg7DayCases"] = df_fact_daily.groupby("CountryCode")["NewCases"].transform(lambda x: x.rolling(7, min_periods=1).mean().round(1))
    df_fact_daily["MovingAvg7DayDeaths"] = df_fact_daily.groupby("CountryCode")["NewDeaths"].transform(lambda x: x.rolling(7, min_periods=1).mean().round(1))
    
    # Save Fact CSVs
    df_fact_daily.to_csv(os.path.join(processed_dir, "fact_covid_daily.csv"), index=False)
    df_fact_vax.to_csv(os.path.join(processed_dir, "fact_vaccinations.csv"), index=False)

    print("[5/5] Packaging Consolidated JSON for Interactive Web Preview...")
    
    # Create Web JSON structure
    country_lookup = {c["CountryCode"]: c for c in countries_data}
    
    # Latest summary per country
    latest_date_key = df_fact_daily["DateKey"].max()
    df_latest_daily = df_fact_daily[df_fact_daily["DateKey"] == latest_date_key]
    df_latest_vax = df_fact_vax[df_fact_vax["DateKey"] == latest_date_key]

    summary_countries = []
    for c in countries_data:
        code = c["CountryCode"]
        d_row = df_latest_daily[df_latest_daily["CountryCode"] == code].iloc[0]
        v_row = df_latest_vax[df_latest_vax["CountryCode"] == code].iloc[0]
        
        # Monthly aggregations for charts
        c_daily = df_fact_daily[df_fact_daily["CountryCode"] == code].copy()
        c_daily["YearMonth"] = c_daily["Date"].str.slice(0, 7)
        monthly = c_daily.groupby("YearMonth").agg({
            "NewCases": "sum",
            "NewDeaths": "sum",
            "MovingAvg7DayCases": "mean"
        }).reset_index()

        summary_countries.append({
            "code": code,
            "name": c["CountryName"],
            "region": c["Region"],
            "continent": c["Continent"],
            "population": c["Population"],
            "lat": c["Lat"],
            "long": c["Long"],
            "totalCases": int(d_row["CumulativeCases"]),
            "totalDeaths": int(d_row["CumulativeDeaths"]),
            "activeCases": int(d_row["ActiveCases"]),
            "newCasesToday": int(d_row["NewCases"]),
            "movingAvgCases": float(d_row["MovingAvg7DayCases"]),
            "caseFatalityRate": round((d_row["CumulativeDeaths"] / d_row["CumulativeCases"]) * 100, 2),
            "fullyVaccinated": int(v_row["FullyVaccinated"]),
            "pctVaccinated": float(v_row["PctVaccinated"]),
            "monthlyTrends": monthly.to_dict(orient="records")
        })

    # Global Totals
    global_total_cases = int(df_latest_daily["CumulativeCases"].sum())
    global_total_deaths = int(df_latest_daily["CumulativeDeaths"].sum())
    global_active_cases = int(df_latest_daily["ActiveCases"].sum())
    global_total_vax = int(df_latest_vax["FullyVaccinated"].sum())
    
    # Global Daily Timeseries (sampled weekly to keep JSON compact & blazing fast)
    df_global_daily = df_fact_daily.groupby("Date").agg({
        "NewCases": "sum",
        "NewDeaths": "sum",
        "MovingAvg7DayCases": "sum",
        "MovingAvg7DayDeaths": "sum",
        "CumulativeCases": "sum",
        "CumulativeDeaths": "sum"
    }).reset_index()
    
    # Filter every 3 days for web rendering optimization
    global_timeseries = df_global_daily.iloc[::3].to_dict(orient="records")

    web_payload = {
        "metadata": {
            "generatedAt": datetime.now().isoformat(),
            "dateRange": {"start": "2020-01-01", "end": "2023-12-31"},
            "totalRecordsProcessed": len(df_fact_daily),
            "schema": "Power BI Star Schema (Dim_Country, Dim_Date, Dim_Variant, Fact_COVID_Daily, Fact_Vaccinations)"
        },
        "globalTotals": {
            "totalCases": global_total_cases,
            "totalDeaths": global_total_deaths,
            "activeCases": global_active_cases,
            "fullyVaccinated": global_total_vax,
            "globalFatalityRate": round((global_total_deaths / global_total_cases) * 100, 2)
        },
        "countries": summary_countries,
        "globalTimeSeries": global_timeseries
    }

    with open(os.path.join(web_data_dir, "covid_dashboard_data.json"), "w") as f:
        json.dump(web_payload, f, indent=2)

    print("[SUCCESS] ETL Pipeline successfully executed. CSV datasets & JSON exported!")

if __name__ == "__main__":
    build_dataset()
