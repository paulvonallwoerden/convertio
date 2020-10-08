import OcrSettings from "./OcrSettings";

interface ConvertOptions {
  fileName?: string;
  callbackUrl?: string;
  ocrEnabled?: boolean;
  ocrSettings?: OcrSettings;
}

export default ConvertOptions;
