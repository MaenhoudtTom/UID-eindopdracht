// import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
const providerGeoSearch = new GeoSearch.OpenStreetMapProvider();

// night map
// L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png');

const copyright =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>';
const provider = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", { attribution: copyright });
// const providerNightMap = L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", { attribution: copyright });
const providerNightMap = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { attribution: copyright });

const color = "#235A68";

const key = "6726094d9b499c5b768675800d6e89cd";
const searchControl = new GeoSearch.GeoSearchControl({
  provider: new GeoSearch.OpenStreetMapProvider(),
  style: "bar",
  autoComplete: true,
  autoCompleteDelay: 250,
  color: "#000"
});
let map, layergroup, latitude, longitude, data, input;

const addMarker = function () {
  let uvLevel,
   colorCircle,
   dateSunrise,
   dateNight,
   endSunrise,
   sunset;

  dateSunrise = new Date(data.result.sun_info.sun_times.sunrise);
  dateNight = new Date(data.result.sun_info.sun_times.night);
  endSunrise = new Date(data.result.sun_info.sun_times.sunriseEnd);
  sunset = new Date(data.result.sun_info.sun_times.sunset);

  if (data.result.uv == 0) {
    providerNightMap.addTo(map);
    uvLevel = "Night time";
    colorCircle = "#000";
  }
  else {
    map.removeLayer(providerNightMap);

    if (data.result.uv < 3) {
      uvLevel = "Low";
      colorCircle = "#558B2F";
    } else if (data.result.uv < 6) {
      map.removeLayer(providerNightMap);
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
  }

  console.log(uvLevel);
  layergroup.clearLayers();
  let marker = L.marker([latitude, longitude]).addTo(layergroup);
  marker.bindPopup(`<div class="c-popup">
                    <p>UV level: ${uvLevel}<p>
                    <p>UV-index: ${data.result.uv}</p>
                    <p>Sunrise: ${dateSunrise.getHours()}:${dateSunrise.getMinutes()}</p>
                    <p>End of sunrise: ${endSunrise.getHours()}:${endSunrise.getMinutes()}</p>
                    <p>Sunset: ${sunset.getHours()}:${sunset.getMinutes()}</p>
                    <p>Night: ${dateNight.getHours()}:${dateNight.getMinutes()}</p>
                    </div>`);

  let circle = L.circle([latitude, longitude], {
    color: colorCircle,
    fillColor: colorCircle,
    fillOpacity: 0.3,
    radius: 1000,
  }).addTo(layergroup);
};

const createMap = function () {
  map = L.map("mapid").setView([latitude, longitude], 12);
  provider.addTo(map);

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
  getAPI();
//   addMarker();
};

const getAPI = async () => {

    //opgelet bij het veelvoudig opvragen van data, dagelijks limit van toepassing -> 403: forbidden als gevolg
  data = await fetch(`https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}`, {
    headers: {
      "x-access-token": key,
    },
  })
    .then((r) => r.json())
    .catch((err) => console.error("An error occured:", err));
    //   console.log(data);
    addMarker();
//   createMap();
};

const processCoords = function (posistion) {
    // console.log(posistion);
    latitude = posistion.coords.latitude;
    longitude = posistion.coords.longitude;
    // getAPI();
    createMap();
}

const init = function () {
  console.log("DOM loaded");
  document.documentElement.style.setProperty('--global-color', color);
  navigator.geolocation.getCurrentPosition(processCoords);
};

document.addEventListener("DOMContentLoaded", init);
