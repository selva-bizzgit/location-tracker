"use client"

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MarkerMapComponent } from "./MarkerMapComponent";

const render = (status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

export default function Home() {
  const [locationSharingEnabled, enableLocationSharing] = useState(false);
  useEffect(() => {
    var watchId = null;
    if (locationSharingEnabled) {
      console.log("adding watch position callback.");
      watchId = navigator.geolocation.watchPosition(({ coords: { latitude: lat, longitude: lng } }) => {
        console.log("watching position: " + (lat + " | " + lng));
      },
      () => { },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    }
    return () => {
      if (watchId != null) {
        console.log("clearing watch position callback.");
        navigator.geolocation.clearWatch(watchId);
      }
    }
  }, [locationSharingEnabled]);
  console.log("rendering app.");
  return (
    <div>
      <label>
        <input type="checkbox" checked={locationSharingEnabled} onChange={() => enableLocationSharing(!locationSharingEnabled)} />
        Share Location
      </label>
      <br />
      <label>enter name: <input type="text" /></label>
      <Wrapper apiKey={process.env.NEXT_PUBLIC_API_KEY} render={render}>
        <MarkerMapComponent />
      </Wrapper>
    </div>
  );
}
