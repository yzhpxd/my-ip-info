import L from 'leaflet';
import { MapPin, Navigation, Wifi } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import type { GeoLocationInfo } from '../../shared/types';
import type { ProviderResult } from '../types';
import { zhLocation } from '../utils/geoZh';

interface WorldMapProps {
  results: ProviderResult[];
  geo?: GeoLocationInfo;
  isInitialLoading?: boolean;
}

function escapeHtml(str?: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const WorldMap: React.FC<WorldMapProps> = ({ results, geo, isInitialLoading = false }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Convert country code to emoji flag (e.g. "US" -> 🇺🇸)
  const getCountryFlag = (code?: string) => {
    if (code?.length !== 2) return '🌐';
    const codePoints = code
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Extract all points with valid coordinates
  const geoPoints = useMemo(() => {
    return results
      .filter(
        (r) =>
          r.status === 'success' &&
          r.geo &&
          typeof r.geo.latitude === 'number' &&
          typeof r.geo.longitude === 'number' &&
          !Number.isNaN(r.geo.latitude) &&
          !Number.isNaN(r.geo.longitude)
      )
      .map((r) => ({
        provider: r.providerName,
        ip: r.ip,
        lat: r.geo?.latitude ?? 0,
        lng: r.geo?.longitude ?? 0,
        city: r.geo?.city,
        country: r.geo?.country,
        countryCode: r.geo?.countryCode,
        asn: r.geo?.asn,
      }));
  }, [results]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map if not already done
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      }).setView([20, 0], 2);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap tile layer with CSS dark invert filter
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'map-tiles-dark',
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (geoPoints.length > 0) {
      const bounds = L.latLngBounds([]);

      geoPoints.forEach((pt) => {
        const latLng = L.latLng(pt.lat, pt.lng);
        bounds.extend(latLng);

        // Custom Neon Pin Marker Icon
        const icon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: #6366f1;
              border: 2px solid #ffffff;
              box-shadow: 0 0 12px #6366f1;
              position: relative;
            ">
              <span style="
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border-radius: 50%;
                border: 1px solid #6366f1;
                opacity: 0.7;
              "></span>
            </div>
          `,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const locationText = zhLocation(pt.city, pt.country, pt.countryCode);

        const marker = L.marker(latLng, { icon });
        marker.bindPopup(`
          <div class="map-popup" style="padding: 4px 6px; font-family: sans-serif;">
            <div class="map-popup-title" style="font-weight: 700; font-size: 13px; margin-bottom: 2px;">
              ${escapeHtml(pt.provider)}
            </div>
            <div class="map-popup-sub" style="font-size: 11px; margin-bottom: 4px;">
              ${escapeHtml(locationText)}
            </div>
            <div class="map-popup-ip" style="font-family: monospace; font-size: 11px;">
              ${escapeHtml(pt.ip)}
            </div>
            <div class="map-popup-coords" style="font-size: 10px; margin-top: 4px;">
              纬度：${pt.lat.toFixed(4)}，经度：${pt.lng.toFixed(4)}
            </div>
          </div>
        `);

        markersLayer.addLayer(marker);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 10,
          animate: true,
        });
      }
    }

    return () => {
      // clean up on unmount if needed
    };
  }, [geoPoints]);

  const locationTitle = zhLocation(geo?.city, geo?.country, geo?.countryCode);

  return (
    <div className="glass-card" style={{ padding: 'clamp(1.1rem, 3vw, 1.5rem)' }}>
      {/* Geolocation & ISP Info Bar (Paired with Map) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.875rem',
        }}
      >
        {/* Left: Location & Timezone */}
        {isInitialLoading && !geo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              className="skeleton"
              style={{ width: '30px', height: '30px', borderRadius: '50%' }}
            />
            <div>
              <div
                className="skeleton"
                style={{ width: '180px', height: '18px', marginBottom: '4px' }}
              />
              <div className="skeleton" style={{ width: '100px', height: '12px' }} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>
              {getCountryFlag(geo?.countryCode)}
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0 }}>
                  {locationTitle || '正在解析位置…'}
                </h2>
              </div>
              {geo?.timezone && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  时区：{geo.timezone}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Right: ISP and Pins Plotted */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
          {geo?.asOrganization && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wifi size={15} color="var(--accent-primary)" />
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
              >
                {geo.asOrganization}
              </span>
            </div>
          )}

          {geoPoints.length > 0 ? (
            <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
              <Navigation size={12} style={{ marginRight: '4px' }} />
              {geoPoints.length} 个聚合标记
            </span>
          ) : (
            <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
              等待地图坐标
            </span>
          )}
        </div>
      </div>

      {/* Leaflet Map */}
      <div ref={mapContainerRef} className="world-map-container" />
    </div>
  );
};
