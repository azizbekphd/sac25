import "./index.css";
import { useState, useRef, useEffect, useContext } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getMapboxToken, toFourDecimalPlaces } from "../../../../utils/mapbox";
import { ImpactParamsContext } from "../../contexts";

mapboxgl.accessToken = getMapboxToken();

const Map = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const impactParams = useContext(ImpactParamsContext);
  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return; // ensure container is available

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard",
      center: [impactParams.params.lng, impactParams.params.lat], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([impactParams.params.lng, impactParams.params.lat])
      .addTo(map.current);
    function onDragEnd() {
      const lngLat = marker.getLngLat();
      impactParams.params.lng = toFourDecimalPlaces(lngLat.lng);
      impactParams.params.lat = toFourDecimalPlaces(lngLat.lat);
    }
    marker.on("dragend", onDragEnd);
    // return () => {
    //     map.current?.remove();
    // };
  }, [expanded]);

  return (
    <div className={`map ${expanded ? "expanded" : ""}`}>
      <button
        className="map-menu-toggler"
        onClick={() => setExpanded(!expanded)}
      >
        <img
          className="maximize-minimize-icon"
          src={`/sac25/icons/${expanded ? "minimize" : "maximize"}.svg`}
        />
      </button>
      <div className="map-menu-content">
        <div className="map-content" ref={mapContainer} />
        <div
          className="map-coords"
        >
          {impactParams && (
            <>
              <p>{impactParams.params.lat}</p>
              <p>{impactParams.params.lng}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
