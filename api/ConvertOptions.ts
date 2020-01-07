import OcrSettings from "./OcrSettings";

interface ConvertOptions {
  fileName: string | undefined;
  callbackUrl: string | undefined;
  ocrEnabled: boolean | undefined;
  ocrSettings: OcrSettings | undefined;
}

export default ConvertOptions;
