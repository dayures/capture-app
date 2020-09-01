// @flow
import React from 'react';

type Coordinates = {
  latitude: number,
  longitude: number,
};

export const displayCoordinates = ({ latitude, longitude }: Coordinates) =>
    (<div>
        lat: {latitude} <br />
        long: {longitude}
    </div>);
