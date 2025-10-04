import './index.css'
import { useState, useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { getMapboxToken, toFourDecimalPlaces } from '../../../../utils/mapbox';

mapboxgl.accessToken = getMapboxToken();

const Map = () => {
    const [ expanded, setExpanded ] = useState<boolean>(false);
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [coordinates, setCoordinates] = useState<string[] | undefined>();
    useEffect(() => {
        if (map.current) return; // initialize map only once
        if (!mapContainer.current) return; // ensure container is available
        
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-74.5, 40], // starting position [lng, lat]
            zoom: 9 // starting zoom

        });

        const marker = new mapboxgl.Marker({ draggable: true}).setLngLat([-74.5, 40]).addTo(map.current);
        function onDragEnd() {
            const lngLat = marker.getLngLat();
            console.log(`${toFourDecimalPlaces(lngLat.lng)}, ${toFourDecimalPlaces(lngLat.lat)}`)
            setCoordinates([
                `Longitude: ${toFourDecimalPlaces(lngLat.lng)}`,
                `Latitude: ${toFourDecimalPlaces(lngLat.lat)}`
            ]); 
        }
        marker.on('dragend', onDragEnd);
        // return () => {
        //     map.current?.remove();
        // };
    }, [expanded])

    return (
        <div className={`map ${expanded ? 'expanded' : ''}`}>
            <button className="map-menu-toggler" onClick={() => setExpanded(!expanded)}>
                <img className="maximize-minimize-icon" src={`/sac25/icons/${expanded ? 'minimize' : 'maximize'}.svg`} />
            </button>
            <div className="map-menu-content">
                <div className="map-content" ref={mapContainer} />
                <div className="map-coords"
        style={{
          display: coordinates ? 'block' : 'none'
        }}
      >
        {coordinates &&
          coordinates.map((coord) => <p style={{ margin: 0 }}>{coord}</p>)}
      </div>
            </div>
        </div>
    )
}

export default Map;
