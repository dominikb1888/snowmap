# Snowmap

```js
const workbook = FileAttachment("data/Snowmap.xlsx").xlsx();
```

```js
const reports = workbook.sheet("John_Snow_1854_cases", {
  range: "A:D",
  headers: true,
});
```

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

```js
import L from "npm:leaflet";
import proj4 from "npm:proj4";

// Define British National Grid (EPSG:27700) projection formula
proj4.defs(
  "EPSG:27700",
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs",
);
```

```js
// Create and yield the container element
const container = document.createElement("div");
container.style.width = "100%";
container.style.height = "500px";

const map = L.map(container).setView([51.5133, -0.1364], 16);

// Base silhouettes (no labels)
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 16,
    attribution: "Tiles &copy; Esri",
  },
).addTo(map);

// Street labels overlay
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 16,
  },
).addTo(map);

setTimeout(() => {
  map.invalidateSize();
}, 100);

const ORIGIN_LAT = 51.512;
const ORIGIN_LNG = -0.138;
const SCALE_X = 0.00025; // Longitude scaling step per local unit
const SCALE_Y = 0.00025; // Latitude scaling step per local unit

const markersGroup = L.featureGroup();

let lat, lng;

for (const c of reports) {
  const localX = Number(c.x ?? c.Easting ?? c.x_coord);
  const localY = Number(c.y ?? c.Northing ?? c.y_coord);

  if (!isNaN(localX) && !isNaN(localY)) {
    // Transform local coordinates into Soho WGS84 degrees
    const lng = ORIGIN_LNG + localX * SCALE_X;
    const lat = ORIGIN_LAT + localY * SCALE_Y;

    const marker = L.circleMarker([lat, lng], {
      radius: 4,
      fillColor: "#d90429",
      color: "#000000",
      weight: 0.5,
      opacity: 0.9,
      fillOpacity: 0.85,
    });
    markersGroup.addLayer(marker);
  }
}
markersGroup.addTo(map);

// 4. Force map resize calculation first, then fit bounds safely
requestAnimationFrame(() => {
  map.invalidateSize();
  const bounds = markersGroup.getBounds();
  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [20, 20] });
  }
});

display(container);
```

```js
Inputs.table(reports);
```

```

```
