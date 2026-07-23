import * as THREE from "three";

/** A soft radial-gradient sprite texture, cached per color so we don't regenerate it every render. */
const cache = new Map<string, THREE.Texture>();

export function glowTexture(colorHex: string): THREE.Texture {
  if (cache.has(colorHex)) return cache.get(colorHex)!;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, colorHex);
  gradient.addColorStop(0.35, colorHex);
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  cache.set(colorHex, texture);
  return texture;
}

/** A directional streak texture for the accretion disk — brighter on one edge, fades on the other. */
export function diskGradientTexture(): THREE.Texture {
  const key = "disk-gradient";
  if (cache.has(key)) return cache.get(key)!;

  const w = 512;
  const h = 64;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "rgba(255,177,153,0)");
  gradient.addColorStop(0.5, "rgba(255,90,31,0.95)");
  gradient.addColorStop(0.75, "rgba(195,179,255,0.7)");
  gradient.addColorStop(1, "rgba(195,179,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  cache.set(key, texture);
  return texture;
}
