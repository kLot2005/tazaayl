'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapProps {
    zones?: any[];
    trucks?: any[];
    isDrawing?: boolean;
    onDrawComplete?: (polygon: any) => void;
}

export default function Map({ zones = [], trucks = [], isDrawing = false, onDrawComplete }: MapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const draw = useRef<any>(null);
    const [styleLoaded, setStyleLoaded] = useState(false);

    const isTokenValid = MAPBOX_TOKEN && MAPBOX_TOKEN.length > 50 && !MAPBOX_TOKEN.includes('YOUR_MAPBOX');

    useEffect(() => {
        if (!isTokenValid || map.current || !mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [71.43, 51.16],
            zoom: 12,
        });

        draw.current = new MapboxDraw({
            displayControlsDefault: false,
            userProperties: true,
            styles: [
                {
                    'id': 'gl-draw-polygon-fill-active',
                    'type': 'fill',
                    'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
                    'paint': { 'fill-color': '#10b981', 'fill-opacity': 0.3 }
                },
                {
                    'id': 'gl-draw-polygon-stroke-active',
                    'type': 'line',
                    'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
                    'layout': { 'line-cap': 'round', 'line-join': 'round' },
                    'paint': { 'line-color': '#10b981', 'line-width': 3 }
                }
            ]
        });

        map.current.addControl(draw.current);
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        const onMapLoad = () => {
            if (!map.current) return;
            setStyleLoaded(true);

            // Зоны - Заливка (использует цвет из properties)
            if (!map.current.getSource('zones')) {
                map.current.addSource('zones', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

                map.current.addLayer({
                    id: 'zones-fill',
                    type: 'fill',
                    source: 'zones',
                    paint: {
                        'fill-color': ['get', 'color'],
                        'fill-opacity': 0.2
                    }
                });

                map.current.addLayer({
                    id: 'zones-outline',
                    type: 'line',
                    source: 'zones',
                    paint: {
                        'line-color': ['get', 'color'],
                        'line-width': 2,
                        'line-opacity': 0.8
                    }
                });

                // Слой для названий зон
                map.current.addLayer({
                    id: 'zones-labels',
                    type: 'symbol',
                    source: 'zones',
                    layout: {
                        'text-field': ['get', 'name'],
                        'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
                        'text-size': 10,
                        'text-letter-spacing': 0.05,
                        'text-offset': [0, 0],
                        'text-anchor': 'center'
                    },
                    paint: {
                        'text-color': '#ffffff',
                        'text-halo-color': 'rgba(0,0,0,0.8)',
                        'text-halo-width': 2
                    }
                });
            }

            // Машины
            if (!map.current.getSource('trucks')) {
                map.current.addSource('trucks', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
                map.current.addLayer({
                    id: 'trucks-point', type: 'circle', source: 'trucks', paint: {
                        'circle-radius': 8, 'circle-color': '#fbbf24', 'circle-stroke-width': 2, 'circle-stroke-color': '#000', 'circle-opacity': 0.9
                    }
                });
            }

            updateZones(zones);
            updateTrucks(trucks);
        };

        map.current.on('style.load', onMapLoad);

        map.current.on('draw.create', (e: any) => {
            const feature = e.features[0];
            if (onDrawComplete) onDrawComplete(feature.geometry);
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [isTokenValid, onDrawComplete]);

    useEffect(() => {
        if (!draw.current || !map.current || !styleLoaded) return;
        try {
            if (isDrawing) {
                draw.current.changeMode('draw_polygon');
            } else {
                draw.current.changeMode('simple_select');
                draw.current.deleteAll();
            }
        } catch (e) { }
    }, [isDrawing, styleLoaded]);

    const updateZones = (zonesData: any[]) => {
        if (!map.current || !styleLoaded) return;
        const source = map.current.getSource('zones') as mapboxgl.GeoJSONSource;
        if (source) {
            source.setData({
                type: 'FeatureCollection',
                features: zonesData.map(z => ({
                    type: 'Feature',
                    geometry: z.boundary,
                    properties: {
                        id: z.id,
                        name: z.name || 'Unnamed',
                        color: z.color || '#10b981'
                    }
                }))
            });
        }
    };

    const updateTrucks = (trucksData: any[]) => {
        if (!map.current || !styleLoaded) return;
        const source = map.current.getSource('trucks') as mapboxgl.GeoJSONSource;
        if (source) {
            source.setData({
                type: 'FeatureCollection',
                features: trucksData.map(t => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [t.longitude, t.latitude] },
                    properties: { id: t.truckId }
                }))
            });
        }
    };

    useEffect(() => { updateZones(zones); }, [zones, styleLoaded]);
    useEffect(() => { updateTrucks(trucks); }, [trucks, styleLoaded]);

    if (!isTokenValid) {
        return (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center p-8 text-center border border-white/5 rounded-2xl">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] leading-loose">
                    Mapbox Token Not Configured<br />
                    <span className="text-emerald-500/50 italic font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</span>
                </p>
            </div>
        );
    }

    return <div ref={mapContainer} className="w-full h-full bg-zinc-950 rounded-2xl" />;
}
