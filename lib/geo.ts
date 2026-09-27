const EARTH_RADIUS_M = 6371000;
const WALK_METERS_PER_MIN = 80; // ~4.8 km/h average walking speed

export function haversineMeters(a: [number, number], b: [number, number]): number {
  const [lat1, lng1] = a;
  const [lat2, lng2] = b;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * sinLng * sinLng;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function walkMinutes(a: [number, number], b: [number, number]): number {
  return Math.max(0, Math.round(haversineMeters(a, b) / WALK_METERS_PER_MIN));
}
