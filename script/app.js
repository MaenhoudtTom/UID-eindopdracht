"use strict"

const provider = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
const copyright =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>';

const key = "";
let map, layergroup, latitude, longitude, data;

const showResults = function () {

}

const addMarker = function () {
    let uvLevel;
    let colorCircle;

    if (data.result.uv < 3) {
        uvLevel = "Low";
        colorCircle = "#558B2F";
    }
    else if (data.result.uv < 6) {
        uvLevel = "Moderate";
        colorCircle = "#F9A825";
    }
    else if (data.result.uv < 8) {
        uvLevel = "High";
        colorCircle = "#EF6C00";
    }
    else if (data.result.uv < 11) {
        uvLevel = "Very high";
        colorCircle = "#B71C1C";
    }
    else {
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
        radius: 1000
    }).addTo(map);
    showResults();
}

const createMap = function () {

    map = L.map("mapid").setView([latitude, longitude], 12);
    L.tileLayer(provider, { attribution: copyright }).addTo(map);

    layergroup = L.layerGroup().addTo(map);
    addMarker();
}

const getAPI = async (posistion) => {
    console.log(posistion);
    latitude = posistion.coords.latitude;
    longitude = posistion.coords.longitude;

    data = await fetch(`https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}`, {
        headers: {
            'x-access-token': key
        }
    })
    .then(r => r.json())
    .catch((err) => console.error('An error occured:', err));
    console.log(data);
    createMap();
}

const init = function () {
    console.log("DOM loaded");
    navigator.geolocation.getCurrentPosition(getAPI);
}

document.addEventListener("DOMContentLoaded", init);
