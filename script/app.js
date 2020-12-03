// import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
const providerGeoSearch = new GeoSearch.OpenStreetMapProvider();

const provider = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
const copyright =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>';

const key = "6726094d9b499c5b768675800d6e89cd";
const searchControl = new GeoSearch.GeoSearchControl({
  provider: new GeoSearch.OpenStreetMapProvider(),
  style: "bar",
  autoComplete: true,
  autoCompleteDelay: 250,
});
let map, layergroup, latitude, longitude, data, input;

const logResult = function (result) {
  console.log(result);
};

const addMarker = function () {
  let uvLevel;
  let colorCircle;

  if (data.result.uv < 3) {
    uvLevel = "Low";
    colorCircle = "#558B2F";
  } else if (data.result.uv < 6) {
    uvLevel = "Moderate";
    colorCircle = "#F9A825";
  } else if (data.result.uv < 8) {
    uvLevel = "High";
    colorCircle = "#EF6C00";
  } else if (data.result.uv < 11) {
    uvLevel = "Very high";
    colorCircle = "#B71C1C";
  } else {
    uvLevel = "Extreme";
    colorCircle = "#6A1B9A";
  }

  console.log(uvLevel);
  layergroup.clearLayers();
  let marker = L.marker([latitude, longitude]).addTo(layergroup);
  marker.bindPopup(`<p>UV level: ${uvLevel}<p>
                    <p>UV-index: ${data.result.uv}</p>
                    <p>Sunrise: ${data.result.sun_info.sun_times.sunrise}</p>
                    <p>Night: ${data.result.sun_info.sun_times.night}</p>`);

  let circle = L.circle([latitude, longitude], {
    color: colorCircle,
    fillColor: colorCircle,
    fillOpacity: 0.3,
    radius: 1000,
  }).addTo(map);
};

const createMap = function () {
  map = L.map("mapid").setView([latitude, longitude], 12);
  L.tileLayer(provider, { attribution: copyright }).addTo(map);

  layergroup = L.layerGroup().addTo(map);

  map.addControl(searchControl);
  map.on("geosearch/showlocation", function (result) {
    // console.log("logging cords");
    // console.log(result.location.y);
    // console.log(result.location.x);

    latitude = result.location.y;
    longitude = result.location.x;
    getAPI();
  });
  addMarker();
};

const getAPI = async () => {
  data = await fetch(`https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}`, {
    headers: {
      "x-access-token": key,
    },
  })
    .then((r) => r.json())
    .catch((err) => console.error("An error occured:", err));
//   console.log(data);
  createMap();
};

const processCoords = function (posistion) {
    // console.log(posistion);
    latitude = posistion.coords.latitude;
    longitude = posistion.coords.longitude;
    getAPI();
}

const init = function () {
  console.log("DOM loaded");
  navigator.geolocation.getCurrentPosition(processCoords);
};

document.addEventListener("DOMContentLoaded", init);
