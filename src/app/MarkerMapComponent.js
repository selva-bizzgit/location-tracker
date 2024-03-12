import { useEffect, useRef, useState, memo } from "react";
import styles from "./MarkerMapComponent.css";

function getLocations() {
  const locationsList = [
    [{name: "Nivesh", lat: 11.0168, lng: 76.9558}, {name: "Rajesh", lat: 10.0168, lng: 77.9558}],
    [{name: "Nivesh", lat: 12.0168, lng: 76.9558}, {name: "Rajesh", lat: 10.0168, lng: 75.9558}],
    [{name: "Nivesh", lat: 11.0168, lng: 73.9558}, {name: "Rajesh", lat: 10.0168, lng: 73.9558}],
    [{name: "Nivesh", lat: 11.0168, lng: 74.9558}, {name: "Rajesh", lat: 10.0168, lng: 75.9558}],
  ];
  return locationsList[Math.floor(Math.random() * locationsList.length)];
}

function clearMarkers(markers) {
  markers.forEach(marker => marker.setMap(null));
  markers.length = 0;
}

function _addMarker(markers, map, position) {
  const marker = new window.google.maps.Marker({ map, position });
  markers.push(marker);
  return marker;
}

function addMarker(markers, map, position) {
  _addMarker(markers, map, position);
  map.panTo(position);
}

function addMarkers(markers, map, locations) {
  locations.forEach(location => {
    const marker = _addMarker(markers, map, location);
    const infoWindow = new window.google.maps.InfoWindow({content: location.name});
    marker.addListener("click", () => infoWindow.open({anchor: marker, map}));
    infoWindow.open({anchor: marker, map});
  });
  const bounds = new window.google.maps.LatLngBounds();
  locations?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
  map.fitBounds(bounds);
}

function getMap(ref) {
  const zoom = 11;
  return new window.google.maps.Map(ref.current, {
    zoom,
  });
}

export const MarkerMapComponent = memo(function MarkerMapComponent() {
  const ref = useRef();
  const map = useRef();
  const markers = useRef([]);

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

    console.log("Updating markers.");
    clearMarkers(markers.current);
    addMarkers(markers.current, map.current, locations);
  }, [locations]);

  console.log("rendering map.");
  return <div ref={ref} id="map" />;
});
