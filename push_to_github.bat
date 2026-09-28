@echo off
echo ===================================================
echo   Pushing COVID-19 Analytics Dashboard to GitHub
echo ===================================================

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/covid19-analytics-dashboard.git): "

git init
git add .
git commit -m "Initial commit: COVID-19 Analytics Dashboard (Python ETL + Power BI + Web Preview)"
git branch -M main
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo SUCCESS! Your COVID-19 Analytics Dashboard has been pushed to GitHub.
pause
