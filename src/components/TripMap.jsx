// Interactive map via the Google Maps JavaScript API -- pannable/zoomable,
// with a click-to-open info window on every pin. Deliberately still
// pins-only, no drawn route: Static Maps' `path` param only ever drew
// straight lines (which misrepresent actual roads), and switching to this
// API doesn't change that call -- real road-following routes would still
// need the separate Directions/Routes API, out of scope for now.
//
// The `<script>` tag and the Maps JS library only ever load once for the
// whole app (module-level singleton `loadGoogleMaps()`), no matter how many
// pages/maps mount as the user navigates around.
//
// `markers` entries are either `{ lat, lon, color, label }` (placed
// directly) or `{ query, color, label }` (a text place name/address --
// resolved client-side via `google.maps.Geocoder`, since unlike Static Maps
// this API can't geocode a marker string server-side). Query results are
// cached module-wide so the same saved place isn't re-geocoded every time a
// page is revisited. Deliberately never hardcode coordinates for these --
// see the comment in src/data/savedPlaces.js for why.
//
// `center`/`zoom` are optional: pass 2+ markers instead and the map
// auto-fits its viewport to them, same as the old Static Maps behavior.
//
// `link` is optional: shown as a small "Open in Google Maps" button over
// the map (can't wrap the whole map in an <a> anymore -- it needs to catch
// clicks/drags itself to pan).
import { useEffect, useRef, useState } from 'react'
import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { mapsSearchUrl } from '../utils/helpers'

setOptions({ key: import.meta.env.VITE_GOOGLE_MAPS_STATIC_KEY, v: 'weekly' })

// Loading the "maps"/"marker"/"geocoding" libraries also populates the
// classes we use (Map, Marker, Geocoder, InfoWindow, LatLngBounds, ...) onto
// the global `google.maps` namespace, which is what the rest of this file
// reads from -- importLibrary()'s own return value is just a subset view of
// the same objects, so there's no need to thread it through everywhere.
let loadPromise = null
function loadGoogleMaps() {
  if (!loadPromise) loadPromise = Promise.all([importLibrary('maps'), importLibrary('marker'), importLibrary('geocoding')])
  return loadPromise
}

const geocodeCache = new Map() // query string -> {lat, lng} | null (null = failed, don't retry)

function geocodeQuery(geocoder, query) {
  if (geocodeCache.has(query)) return Promise.resolve(geocodeCache.get(query))
  return new Promise((resolve) => {
    geocoder.geocode({ address: query }, (results, status) => {
      const loc = status === 'OK' && results?.[0] ? { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() } : null
      geocodeCache.set(query, loc)
      resolve(loc)
    })
  })
}

// A colored teardrop pin, matching the shape of Icon.jsx's `pin` glyph but
// filled solid (this is a rasterized map marker, not a UI stroke icon).
function pinIcon(color) {
  const fill = color || '#F2A93B'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="27" height="37" viewBox="0 0 24 24"><path d="M12 21s7-7.58 7-12a7 7 0 10-14 0c0 4.42 7 12 7 12z" fill="${fill}" stroke="#1a1a1a" stroke-width="0.75"/><circle cx="12" cy="9" r="2.5" fill="#fff"/></svg>`
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(27, 37),
    anchor: new window.google.maps.Point(13.5, 37),
  }
}

export default function TripMap({ center, zoom, markers = [], height = 260, alt, link }) {
  const containerRef = useRef(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    const placed = []
    let infoWindow = null

    loadGoogleMaps()
      .then(async () => {
        if (cancelled || !containerRef.current) return
        const google = window.google

        const map = new google.maps.Map(containerRef.current, {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        })
        const geocoder = new google.maps.Geocoder()
        infoWindow = new google.maps.InfoWindow()
        const bounds = new google.maps.LatLngBounds()

        const placeMarker = (lat, lng, m) => {
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map,
            icon: pinIcon(m.color),
            title: m.label,
          })
          marker.addListener('click', () => {
            const openUrl = mapsSearchUrl(m.query || m.label || `${lat},${lng}`)
            infoWindow.setContent(
              `<div style="font:14px system-ui,sans-serif;max-width:200px;">
                <strong>${m.label || 'Pin'}</strong><br/>
                <a href="${openUrl}" target="_blank" rel="noreferrer">Open in Google Maps ↗</a>
              </div>`,
            )
            infoWindow.open({ map, anchor: marker })
          })
          placed.push(marker)
          bounds.extend(marker.getPosition())
        }

        const resolved = await Promise.all(
          markers.map(async (m) => {
            if (m.lat != null && m.lon != null) return { lat: m.lat, lng: m.lon, m }
            if (m.query) {
              const loc = await geocodeQuery(geocoder, m.query)
              return loc ? { lat: loc.lat, lng: loc.lng, m } : null
            }
            return null
          }),
        )
        if (cancelled) return

        for (const r of resolved) {
          if (r) placeMarker(r.lat, r.lng, r.m)
        }

        if (center && zoom != null) {
          map.setCenter({ lat: center[0], lng: center[1] })
          map.setZoom(zoom)
        } else if (!bounds.isEmpty()) {
          map.fitBounds(bounds)
          google.maps.event.addListenerOnce(map, 'idle', () => {
            if (map.getZoom() > 15) map.setZoom(15)
          })
        } else {
          setStatus('error')
          return
        }

        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      for (const marker of placed) marker.setMap(null)
      infoWindow?.close()
    }
    // Each mount (e.g. navigating to a new day/location) gets a fresh map --
    // no need to diff marker changes in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="map-frame" style={{ height }} role="region" aria-label={alt}>
      {status !== 'ready' && (
        <div className="map-fallback">
          {status === 'loading' ? (
            'Loading map…'
          ) : (
            <>
              Map unavailable.
              {link && <a href={link} target="_blank" rel="noreferrer">Open in Google Maps ↗</a>}
            </>
          )}
        </div>
      )}
      <div ref={containerRef} className="map-canvas" style={{ display: status === 'ready' ? 'block' : 'none' }} />
      {status === 'ready' && link && (
        <a className="map-overlay-link" href={link} target="_blank" rel="noreferrer">Open in Google Maps ↗</a>
      )}
    </div>
  )
}
