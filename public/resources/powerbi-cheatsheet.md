# Power BI Quick Reference
By Learnify AI — Vishwajeet

## Pipeline
Get Data → Transform (Power Query) → Model → Visualize → Publish to Workspace → Schedule Refresh

## Get Data
Excel, CSV, SQL Server, SharePoint, Google Analytics, Dataverse — Get Data → search source.

## Power Query Transformations
Remove Rows / Columns · Split Column · Pivot / Unpivot · Merge & Append Queries · Replace Values · Date columns → expand hierarchy

## DAX Fundamentals
```
Total Sales = SUM(Sales[Amount])
Avg Sales = AVERAGE(Sales[Amount])
YoY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))
Filtered = CALCULATE([Total Sales], 'Region'[Name] = "India")
Running = TOTALYTD([Total Sales], 'Date'[Date])
```

## Relationships
Star schema: fact table (transactions) + dimension tables (date, product, customer). Use 1-to-many, filter direction one-way.

## Visuals — when to use
| Goal | Visual |
| --- | --- |
| Trend over time | Line chart |
| Compare categories | Bar / column |
| Share of total | Donut (max 5) |
| Rank | Table / Matrix |
| Geo | Map |
| KPI | Card / KPI visual |

## Formatting
Sort by values (not alphabet) · Remove gridlines · Consistent colors · Tooltips with details · Title = insight, not label.

## Publish & Share
Publish → Workspace → App → Share link · Row-level security (RLS) under Security tab.

## Performance Tips
Import mode over DirectQuery · Reduce columns · Avoid complex calculated columns (use measures).
