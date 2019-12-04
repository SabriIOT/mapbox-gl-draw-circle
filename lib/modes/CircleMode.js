const MapboxDraw = require('@mapbox/mapbox-gl-draw');
const Constants = require('@mapbox/mapbox-gl-draw/src/constants');
const doubleClickZoom = require('@mapbox/mapbox-gl-draw/src/lib/double_click_zoom');
const circle = require('@turf/circle').default;

const CircleMode = { ...MapboxDraw.modes.draw_polygon };
const DEFAULT_RADIUS_IN_KM = 2;

CircleMode.onSetup = (opts) => {
  const polygon = this.newFeature({
    type: Constants.geojsonTypes.FEATURE,
    properties: {
      isCircle: true,
      center: []
    },
    geometry: {
      type: Constants.geojsonTypes.POLYGON,
      coordinates: [[]]
    }
  });

  this.addFeature(polygon);

  this.clearSelectedFeatures();
  doubleClickZoom.disable(this);
  this.updateUIClasses({ mouse: Constants.cursors.ADD });
  this.activateUIButton(Constants.types.POLYGON);
  this.setActionableState({
    trash: true
  });

  return {
    initialRadiusInKm: opts.initialRadiusInKm || DEFAULT_RADIUS_IN_KM,
    polygon,
    currentVertexPosition: 0
  };
};

CircleMode.clickAnywhere = (state, e) => {
  const newState = { ...state };
  if (newState.currentVertexPosition === 0) {
    newState.currentVertexPosition = newState.currentVertexPosition + 1;
    const center = [e.lngLat.lng, e.lngLat.lat];
    const circleFeature = circle(center, newState.initialRadiusInKm);
    newState.polygon.incomingCoords(circleFeature.geometry.coordinates);
    newState.polygon.properties.center = center;
    newState.polygon.properties.radiusInKm = newState.initialRadiusInKm;
  }
  return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [newState.polygon.id] });
};

export default CircleMode;
