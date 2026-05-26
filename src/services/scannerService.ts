import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export function createScanner(elementId: string): Html5Qrcode {
  return new Html5Qrcode(elementId, {
    formatsToSupport: [
      Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.DATA_MATRIX,
    ],
    verbose: false,
  });
}

export const SCANNER_CONFIG = {
  fps: 10,
  qrbox: { width: 250, height: 250 },
  aspectRatio: 1.0,
};
