'use client';

import { useEffect, useRef, useState, memo } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import React from 'react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapProps {
    zones?: any[];
    trucks?: any[];
    mode?: 'view' | 'draw' | 'edit';
    onDrawComplete?: (polygon: any) => void;
    onZoneUpdate?: (zoneId: number, polygon: any) => void;
    onZoneSelect?: (zone: any) => void;
}

const MapComponent = ({ zones = [], trucks = [], mode = 'view', onDrawComplete, onZoneUpdate, onZoneSelect }: MapProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const draw = useRef<any>(null);
    const [styleLoaded, setStyleLoaded] = useState(false);
    const editingZoneId = useRef<number | null>(null);

    // Реф для GeoJSON данных траков, чтобы избежать лишних аллокаций
    const trucksGeoJSON = useRef<GeoJSON.FeatureCollection>({
        type: 'FeatureCollection',
        features: []
    });

    const onDrawCompleteRef = useRef(onDrawComplete);
    useEffect(() => {
        onDrawCompleteRef.current = onDrawComplete;
    }, [onDrawComplete]);

    const isTokenValid = MAPBOX_TOKEN && MAPBOX_TOKEN.length > 50 && !MAPBOX_TOKEN.includes('YOUR_MAPBOX');

    useEffect(() => {
        if (!isTokenValid || map.current || !mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [71.43, 51.16],
            zoom: 12,
            antialias: true
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
                },
                {
                    'id': 'gl-draw-point-active',
                    'type': 'circle',
                    'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
                    'paint': { 'circle-radius': 7, 'circle-color': '#ffffff', 'circle-stroke-width': 2, 'circle-stroke-color': '#10b981' }
                },
                {
                    'id': 'gl-draw-point-vertex-active',
                    'type': 'circle',
                    'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'vertex']],
                    'paint': { 'circle-radius': 5, 'circle-color': '#10b981' }
                }
            ]
        });

        map.current.addControl(draw.current);
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        const onMapLoad = () => {
            if (!map.current) return;
            const m = map.current;

            // 1. Зоны
            if (!m.getSource('zones')) {
                m.addSource('zones', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
                m.addLayer({
                    id: 'zones-fill', type: 'fill', source: 'zones',
                    paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.2 }
                });
                m.addLayer({
                    id: 'zones-outline', type: 'line', source: 'zones',
                    paint: { 'line-color': ['get', 'color'], 'line-width': 2, 'line-opacity': 0.8 }
                });
                m.addLayer({
                    id: 'zones-labels', type: 'symbol', source: 'zones',
                    layout: {
                        'text-field': ['get', 'name'],
                        'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
                        'text-size': 11,
                        'text-anchor': 'center',
                        'text-allow-overlap': false
                    },
                    paint: {
                        'text-color': '#ffffff',
                        'text-halo-color': 'rgba(0,0,0,0.8)',
                        'text-halo-width': 1.5
                    }
                });
            }

            // 2. Траки
            if (!m.getSource('trucks')) {
                m.addSource('trucks', { type: 'geojson', data: trucksGeoJSON.current, tolerance: 0 });
                m.addLayer({
                    id: 'trucks-point', type: 'circle', source: 'trucks',
                    paint: {
                        'circle-radius': 6,
                        'circle-color': '#fbbf24',
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#ffffff',
                    }
                });
                m.addLayer({
                    id: 'trucks-labels', type: 'symbol', source: 'trucks',
                    layout: {
                        'text-field': ['get', 'plate'],
                        'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
                        'text-size': 10,
                        'text-offset': [0, 1.5],
                        'text-anchor': 'top',
                        'text-allow-overlap': false
                    },
                    paint: { 'text-color': '#ffffff', 'text-halo-color': '#000000', 'text-halo-width': 2 }
                });
            }

            setStyleLoaded(true);

            m.on('click', 'zones-fill', (e) => {
                if (mode !== 'edit') return;
                const feature = e.features?.[0];
                if (!feature || !draw.current) return;
                const zoneId = feature.properties?.id;
                if (!zoneId) return;

                editingZoneId.current = zoneId;
                draw.current.deleteAll();
                const ids = draw.current.add(feature);
                draw.current.changeMode('direct_select', { featureId: ids[0] });
                if (onZoneSelect) onZoneSelect(feature.properties);
            });

            m.on('mouseenter', 'zones-fill', () => {
                if (mode === 'edit') m.getCanvas().style.cursor = 'pointer';
            });
            m.on('mouseleave', 'zones-fill', () => { m.getCanvas().style.cursor = ''; });
        };

        map.current.on('style.load', onMapLoad);

        map.current.on('draw.create', (e: any) => {
            const feature = e.features[0];
            if (onDrawCompleteRef.current) onDrawCompleteRef.current(feature.geometry);
        });

        map.current.on('draw.update', (e: any) => {
            const feature = e.features[0];
            if (editingZoneId.current && onZoneUpdate) {
                onZoneUpdate(editingZoneId.current, feature.geometry);
            }
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
                setStyleLoaded(false);
            }
        };
    }, [isTokenValid, mode]); // Перезапускаем при смене режима для обновления слушателей

    useEffect(() => {
        if (!draw.current || !map.current || !styleLoaded) return;
        try {
            if (mode === 'draw') {
                draw.current.changeMode('draw_polygon');
            } else {
                draw.current.changeMode('simple_select');
                if (mode === 'view') {
                    draw.current.deleteAll();
                    editingZoneId.current = null;
                }
            }
        } catch (e) { }
    }, [mode, styleLoaded]);

    useEffect(() => {
        if (!map.current || !styleLoaded) return;
        const source = map.current.getSource('zones') as mapboxgl.GeoJSONSource;
        if (source) {
            source.setData({
                type: 'FeatureCollection',
                features: (zones || []).map(z => ({
                    type: 'Feature',
                    geometry: z.boundary,
                    properties: { id: z.id, name: z.name || 'Unnamed', color: z.color || '#10b981' }
                }))
            });
        }
    }, [zones, styleLoaded]);

    useEffect(() => {
        if (!map.current || !styleLoaded) return;
        const source = map.current.getSource('trucks') as mapboxgl.GeoJSONSource;
        if (source) {
            trucksGeoJSON.current.features = (trucks || [])
                .filter(t => t.latitude && t.longitude)
                .map(t => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [Number(t.longitude), Number(t.latitude)] },
                    properties: { id: t.truckId, plate: t.plateNumber || `${t.truckId}` }
                } as any));
            source.setData(trucksGeoJSON.current);
        }
    }, [trucks, styleLoaded]);

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

    return <div ref={mapContainer} className="w-full h-full bg-zinc-950 rounded-2xl overflow-hidden" />;
}

export default memo(MapComponent);
