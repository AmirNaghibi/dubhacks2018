import React, { Component } from 'react';
import '../App.css';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline } from 'react-google-maps';
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";
import TWITTER_1 from '../assets/images/twitter-feed1.svg';
import TWITTER_2 from '../assets/images/twitter-feed2.svg';
import Bird from '../assets/images/twitter.svg';

const TEST_TWITTER = [
  { id: 1, svg: TWITTER_1, lat: 47.66003713198761, lng: -122.31556885183716 },
  { id: 2, svg: TWITTER_2, lat: 47.67225652151954, lng: -122.32677793787104 },
];

const { compose, withProps, lifecycle } = require("recompose");

const TEST_START = {
  lat: 47.6564522,
  lng: -122.3277878
};

const TEST_DEST = {
  lat: 47.65641,
  lng: -122.3132624,
};

const TEST_PATH = {
  start: {
    location: {
      lat: 47.6564522,
      lng: -122.3277878
    }
  },
  end: {
    location: {
      lat: 47.65641,
      lng: -122.3132624,
    }
  }
};

const extractHeatmapData = (crimeData) => {
  return crimeData
    .filter(data => data.Latitude && data.Longitude)
    .map(data => (new window.google.maps.LatLng(data.Latitude, data.Longitude)));
};

const extractHeatmapData1 = (crimeData) => {
  const result = [];

  crimeData
    .filter(data => data.Latitude && data.Longitude)
    .forEach(data => {
      result.unshift(data.Latitude);
      result.unshift(data.Longitude);
    });

  return result;
};

const GoogleMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBfzfG_CDAaVM2mYzqBRhQAe70ZX_epyHA&v=3.exp&libraries=geometry,drawing,places,visualization",
    loadingElement: <div style={{ height: '100%', width: '100%' }} />,
    containerElement: <div style={{ height: '100%', width: '100%' }} />,
    mapElement: <div style={{ height: '100%', width: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
    }
  })
)(props => {
  const {
    currentLocation,
    destination,
    crimeData,
    path,
    theme,
    onMapClick,
    onTwitterClick,
    activeTwitterId
  } = props;

  const heatMapOptions = {
    // gradient: ['#dc143c', '#f08080'],
    radius: 25,
  };

  return (
    <GoogleMap
      labelAnchor={new window.google.maps.Point(0, 0)}
      defaultZoom={16}
      defaultOptions={{styles: theme}}
      options={{styles: theme}}
      defaultCenter={currentLocation}
      onClick={onMapClick}
    >
      {/* TODO: add a toast to prompt user to select a destination */}
      <Marker position={currentLocation} />

      {/* Destination Marker */}
      {destination && <Marker position={destination} />}

      {/* Route PolyLine */}
      {(destination && path) && <Polyline
        path={path}
        geodesic={true}
        options={{
          strokeColor: '#ff2527',
          // strokeOpacity: 0.0,
          strokeWeight: 4,
          // icons: [{
          //   icon: lineSymbol,
          //   offset: '0',
          //   repeat: '20px'
          // }],
        }}
      />}

      {/* Heat Map */}
      {crimeData && <HeatmapLayer
        data={extractHeatmapData(crimeData)}
        options={heatMapOptions}
      />}

      {TEST_TWITTER.map((tweet, id)=> <Marker
        key={id}
        icon={{
          path: window.google.maps.SymbolPath.CIRCLE,
          strokeColor: "#03a9f4",
          scale: 6
        }}
        onClick={() => onTwitterClick(tweet.id)}
        position={{ lat: tweet.lat, lng: tweet.lng }}
      />)}

      {/* Crime Markers */}
      {/* TODO - Replace markers with icons */}
      {/*{crimeData && crimeData.map((data, id) => <Marker key={id} position={{lat: data.Latitude, lng: data.Longitude }} />)}*/}
    </GoogleMap>)
  }
);

export default GoogleMapComponent;
