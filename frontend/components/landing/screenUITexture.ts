import * as THREE from "three";

let cached: THREE.Texture | null = null;

export function screenUITexture(): THREE.Texture {
  if (cached) return cached;

  const w = 1024;
  const h = 640;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // ---- Deep Space Base ----
  const baseGrad = ctx.createRadialGradient(512, 320, 0, 512, 320, 600);
  baseGrad.addColorStop(0, "#0f0a1a");
  baseGrad.addColorStop(0.6, "#08080d");
  baseGrad.addColorStop(1, "#050508");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, w, h);

  // ---- Hexagonal Grid Overlay ----
  ctx.strokeStyle = "rgba(139, 107, 255, 0.2)";
  ctx.lineWidth = 1;
  for (let y = 0; y < h; y += 32) {
    for (let x = 0; x < w; x += 32) {
      ctx.strokeRect(x, y, 32, 32);
    }
  }

  // ---- Central Core (The AI Brain) ----
  const coreX = 512,
    coreY = 340;
  const coreGrad = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, 160);
  coreGrad.addColorStop(0, "rgba(255, 90, 31, 1)");
  coreGrad.addColorStop(0.4, "rgba(168, 85, 247, 0.8)");
  coreGrad.addColorStop(0.8, "rgba(168, 85, 247, 0.1)");
  coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(coreX, coreY, 160, 0, Math.PI * 2);
  ctx.fill();

  // ---- Pulsing Data Ring (Equalizer) ----
  const angles = [0, 0.5, 1.2, 1.8, 2.5, 3.1, 4.0, 4.8, 5.5];
  for (let i = 0; i < angles.length; i++) {
    const rad = angles[i];
    const len = 40 + Math.sin(i * 2.3) * 30 + 20;
    const x = coreX + Math.cos(rad) * 120;
    const y = coreY + Math.sin(rad) * 120;
    ctx.strokeStyle = i % 2 === 0 ? "#ff5a1f" : "#8b6bff";
    ctx.lineWidth = 4 + (i % 3);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(rad) * len, y + Math.sin(rad) * len);
    ctx.stroke();
  }

  // ---- Telemetry Text Blocks (Simulated) ----
  ctx.fillStyle = "rgba(244, 241, 233, 0.8)";
  ctx.font = "bold 24px monospace";
  ctx.fillText("SYS::ACTIVE", 50, 80);
  ctx.fillStyle = "rgba(139, 107, 255, 0.6)";
  ctx.font = "16px monospace";
  ctx.fillText("NEURAL NETWORK OPTIMIZED", 50, 120);
  ctx.fillStyle = "rgba(255, 90, 31, 0.8)";
  ctx.fillText("AGENT DEPLOYMENT SUCCESS", 50, 160);

  // ---- Bottom Data Stream ----
  const grad = ctx.createLinearGradient(0, h - 40, w, h - 40);
  grad.addColorStop(0, "#8b6bff");
  grad.addColorStop(0.5, "#ff5a1f");
  grad.addColorStop(1, "#8b6bff");
  ctx.fillStyle = grad;
  ctx.fillRect(50, h - 40, 400, 8);
  ctx.fillRect(550, h - 40, 300, 8);

  // ---- Scanning Glow Line (Horizontal) ----
  ctx.fillStyle = "rgba(255, 90, 31, 0.15)";
  ctx.fillRect(0, coreY - 2, w, 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  cached = texture;
  return texture;
}
