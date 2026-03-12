# Hydro-Qu&eacute;bec Outage Map

Real-time outage dashboard for Hydro-Qu&eacute;bec, showing power interruptions across Quebec on an interactive map.

## Features

- Live outage points and polygon zones on a dark-themed map
- Clustered markers that expand on zoom
- New outage pulse animation
- Sidebar with sortable municipality table, region filter, and city search
- Weather radar overlay (RainViewer)
- Auto-refreshes every 30 seconds

## Data Sources

- [ArcGIS FeatureServer](https://services5.arcgis.com/0akaykIdiPuMhFIy/arcgis/rest/services/bs_infoPannes_prd_vue/FeatureServer) — outage points and polygons
- [Hydro-Qu&eacute;bec BIS API](https://services-bs.solutions.hydroquebec.com/pan/web/api/v1/bis) — municipality-level outage stats
- [Hydro-Qu&eacute;bec Regions](https://infopannes.solutions.hydroquebec.com/assets/data/bilan-par-region.json) — region hierarchy and coordinates
- [RainViewer](https://www.rainviewer.com/) — weather radar tiles

## Deployment

Static single-file app hosted on GitHub Pages. No backend required.
