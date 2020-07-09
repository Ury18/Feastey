import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react'

export const MapContainer = (props) => {

    return (
        <Map google={props.google} zoom={17} center={{ lat: props.lat, lng: props.lng }} initialCenter={{ lat: props.lat, lng: props.lng }}>
                <Marker position={{ lat: props.lat, lng: props.lng }} />
            </Map>
    );
}

export default GoogleApiWrapper({
    apiKey: (process.env.GOOGLE_MAPS_KEY)
})(MapContainer)
