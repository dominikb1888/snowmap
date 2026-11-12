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

```html
<style>
  @import url("https://googleapis.com");

  .tube-map {
    font-family: "Railway Sans", "Cabin", "Gill Sans", sans-serif;
    background: #ffffff;
    border: 3px solid #003688;
  }
  .street-line {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .station-label {
    font-size: 11px;
    font-weight: 700;
    fill: #003688;
    letter-spacing: 0.04em;
  }
  .legend-box {
    fill: #ffffff;
    stroke: #003688;
    stroke-width: 2.5px;
  }
</style>
```

# Soho 1854: Cholera Outbreak Diagram

```js
// 1. Load your local GeoJSON files via FileAttachment
const pumps = await FileAttachment("data/pumps.geojson").json();
const deaths = await FileAttachment("data/deaths.geojson").json();
// const streets = await FileAttachment("data/soho_streets.geojson").json();
const streets = JSON.parse("{}");
```

```js
// 2. Helper: Snap street coordinates to Harry Beck's 45-degree octilinear grid
function octilinearLine(coords) {
  if (coords.length < 2) return coords;
  const snapped = [coords[0]];
  for (let i = 1; i < coords.length; i++) {
    const [x0, y0] = snapped[snapped.length - 1];
    const [x1, y1] = coords[i];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const angle = Math.atan2(dy, dx);
    // Round angle to nearest 45 degrees (PI / 4)
    const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
    const dist = Math.hypot(dx, dy);
    snapped.push([
      x0 + Math.cos(snappedAngle) * dist,
      y0 + Math.sin(snappedAngle) * dist,
    ]);
  }
  return snapped;
}
```

```js
// 3. Render the D3 SVG Map
const width = 920;
const height = 680;

// Official Transport for London (TfL) Line Colors
const tflColors = {
  "Oxford Street": "#E32017",   // Central Line Red
  "Regent Street": "#003688",   // Piccadilly Blue
  "Broad Street": "#FFD300",    // Circle Line Yellow
  "Wardour Street": "#00782A",  // District Line Green
  "Dean Street": "#9B0056",     // Metropolitan Magenta
  "default": "#B2B7BB"          // Neutral Zone Gray
};
//
// const projection = d3.geoMercator().fitExtent([[60, 60], [width - 60, height - 60]], streets);
// const pathGenerator = d3.geoPath().projection(projection);
//
// const svg = d3.create("svg")
//   .attr("viewBox", [0, 0, width, height])
//   .attr("class", "tube-map");

// const streetGroup = svg.append("g");
// streets.features.forEach(feature => {
//   const name = feature.properties.name || "default";
//   const color = tflColors[name] || tflColors.default;
//   const isMajor = Boolean(tflColors[name]);
//
//   // Project to screen coordinates, then snap to 45° angles
//   const projectedCoords = feature.geometry.coordinates.map(c => projection(c));
//   const beckCoords = octilinearLine(projectedCoords);
//
//   const line = d3.line()
//     .x(d => d[0])
//     .y(d => d[1])
//     .curve(d3.curveBundle.beta(0.85)); // Rounded Tube corner fillets
//
//   streetGroup.append("path")
//     .datum(beckCoords)
//     .attr("d", line)
//     .attr("class", "street-line")
//     .attr("stroke", color)
//     .attr("stroke-width", isMajor ? 6 : 2.5);
// });
//
// Layer B: Cholera Deaths (TfL Station Ticks / Interchange Circles)
const deathGroup = svg.append("g");
deaths.features.forEach(d =>
  const [x, y] = projection(d.geometry.coordinates);
  const count = d.properties.Count || d.properties.count || 1;

  if (count >= 5) {
    // High-mortality buildings styled as Tube Interchange Stations
    deathGroup.append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", Math.min(4 + count * 0.4, 11))
      .attr("fill", "#ffffff")
      .attr("stroke", "#000000")
      .attr("stroke-width", 2.5);
  } else {
    // Minor deaths styled as classic Tube line ticks
    deathGroup.append("rect")
      .attr("x", x - 2)
      .attr("y", y - 5)
      .attr("width", 4)
      .attr("height", 10)
      .attr("fill", "#111111");
  }
});

// Layer C: Water Pumps (TfL Roundels)
const pumpGroup = svg.append("g");
pumps.features.forEach(p => {
  const [x, y] = projection(p.geometry.coordinates);
  const isBroadSt = (p.properties.name || "").toLowerCase().includes("broad");
  const r = isBroadSt ? 14 : 9;

  const roundel = pumpGroup.append("g")
    .attr("transform", `translate(${x}, ${y})`);

  // Red Outer Ring
  roundel.append("circle")
    .attr("r", r)
    .attr("fill", "#ffffff")
    .attr("stroke", "#E32017")
    .attr("stroke-width", isBroadSt ? 4.5 : 3);

  // Horizontal Blue Bar
  roundel.append("rect")
    .attr("x", -r * 1.25)
    .attr("y", -r * 0.28)
    .attr("width", r * 2.5)
    .attr("height", r * 0.56)
    .attr("fill", "#003688");

  if (isBroadSt) {
    roundel.append("text")
      .attr("x", r + 8)
      .attr("y", 4)
      .attr("class", "station-label")
      .text("BROAD ST PUMP");
  }
});

// Layer D: Tube-Style Legend Box
const legend = svg.append("g").attr("transform", `translate(${width - 240}, ${height - 155})`);
legend.append("rect").attr("width", 215).attr("height", 130).attr("class", "legend-box");
legend.append("text").attr("x", 14).attr("y", 24).attr("class", "station-label").text("1854 SOHO OUTBREAK");

display(svg.node());
```

```

```
