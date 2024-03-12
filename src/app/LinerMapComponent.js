import { useEffect, useRef, useState, memo } from "react";
import styles from "./LinerMapComponent.css";

function getLocations() {
  const locationsList = [
    [{name: "Nivesh", lat: 11.0168, lng: 76.9558}, {name: "Nivesh", lat: 10.0168, lng: 77.9558}],
    [{name: "Nivesh", lat: 12.0168, lng: 76.9558}, {name: "Nivesh", lat: 10.0168, lng: 75.9558}],
    [{name: "Nivesh", lat: 11.0168, lng: 73.9558}, {name: "Nivesh", lat: 10.0168, lng: 73.9558}],
    [{name: "Nivesh", lat: 11.0168, lng: 74.9558}, {name: "Nivesh", lat: 10.0168, lng: 75.9558}],
  ];
  return locationsList[Math.floor(Math.random() * locationsList.length)];
}

function clearLiners(liners) {
  liners.forEach(liner => liner.setMap(null));
  liners.length = 0;
}

function _addLiner(liners, map, positions) {
  const liner = new google.maps.Polyline({
    path: positions,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });
  liner.setMap(map);
  liners.push(liner);
  return liner;
}

function addLiner(liners, map, positions) {
  _addLiner(liners, map, positions);
  const bounds = new window.google.maps.LatLngBounds();
  positions?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
  map.fitBounds(bounds);
}

function getMap(ref) {
  const zoom = 11;
  return new window.google.maps.Map(ref.current, {
    zoom,
  });
}

export const LinerMapComponent = memo(function LinerMapComponent() {
  const ref = useRef();
  const map = useRef();
  const liners = useRef([]);

  const [locations, setLocations] = useState(getLocations());

  useEffect(() => {
    console.log("adding fetching locations call back.");
    const watchId = setInterval(() => {
      console.log("setting locations.");
      setLocations(getLocations());
    },
      20000);
    return () => {
      console.log("clearing fetching locations callback.");
      clearInterval(watchId);
    };
  });

  useEffect(() => {
    if (map.current == null) {
      console.log("map generated.");
      map.current = getMap(ref);
    }

    console.log("Updating liners.");
    clearLiners(liners.current);
    addLiner(liners.current, map.current, locations);
  }, [locations]);

  console.log("rendering map.");
  return <div ref={ref} id="map" />;
});
