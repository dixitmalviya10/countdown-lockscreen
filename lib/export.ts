import { toBlob, toPng } from "html-to-image";
import type { DevicePreset, DevicePresetId } from "@/types";
import { slugify } from "./utils";

export const DEVICE_PRESETS: Record<DevicePresetId, DevicePreset> = {
  "iphone-16-pro": {
    id: "iphone-16-pro",
    name: "iPhone Lock Screen",
    badge: "1179 × 2556",
    width: 1179,
    height: 2556,
    logicalWidth: 393,
    logicalHeight: 852,
    pixelRatio: 3,
    orientation: "portrait",
  },
  "android-flagship": {
    id: "android-flagship",
    name: "Android Lock Screen",
    badge: "1080 × 2400",
    width: 1080,
    height: 2400,
    logicalWidth: 360,
    logicalHeight: 800,
    pixelRatio: 3,
    orientation: "portrait",
  },
  "desktop-fhd": {
    id: "desktop-fhd",
    name: "Desktop Full HD",
    badge: "1920 × 1080",
    width: 1920,
    height: 1080,
    logicalWidth: 960,
    logicalHeight: 540,
    pixelRatio: 2,
    orientation: "landscape",
  },
  "desktop-qhd": {
    id: "desktop-qhd",
    name: "Desktop Studio QHD",
    badge: "2560 × 1440",
    width: 2560,
    height: 1440,
    logicalWidth: 1280,
    logicalHeight: 720,
    pixelRatio: 2,
    orientation: "landscape",
  },
};

export const DEVICE_PRESET_LIST: DevicePreset[] = Object.values(DEVICE_PRESETS);

export interface ExportResult {
  dataUrl: string;
  blob: Blob;
  filename: string;
  width: number;
  height: number;
}

export async function exportLockScreenPng(
  element: HTMLElement,
  preset: DevicePreset,
  deadlineTitle: string
): Promise<ExportResult> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }

  // Wait two animation frames so any style/font updates settle cleanly
  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r))
  );

  const options = {
    width: preset.logicalWidth,
    height: preset.logicalHeight,
    pixelRatio: preset.pixelRatio,
    cacheBust: true,
    skipAutoScale: true,
    style: {
      transform: "none",
      transformOrigin: "top left",
    },
  };

  const dataUrl = await toPng(element, options);
  const blob =
    (await toBlob(element, options)) ?? (await (await fetch(dataUrl)).blob());

  const filename = `t-minus-${slugify(deadlineTitle)}-${preset.id}.png`;

  return {
    dataUrl,
    blob,
    filename,
    width: preset.width,
    height: preset.height,
  };
}

export function triggerDownload(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
