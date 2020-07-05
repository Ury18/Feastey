import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react'

const { GOOGLE_MAPS_KEY } = process.env

export const MapContainer = (props) => {

    return (
        <Map google={props.google} zoom={14} center={{ lat: props.lat, lng: props.lng }} initialCenter={{ lat: props.lat, lng: props.lng }}>
                <Marker position={{ lat: props.lat, lng: props.lng }} />
            </Map>
    );
}

export default GoogleApiWrapper({
    apiKey: (GOOGLE_MAPS_KEY)
})(MapContainer)
