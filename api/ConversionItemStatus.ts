import ConversionItemStep from "./ConversionItemStep";

interface ConversionItemStatus {
  id: string;
  status: ConversionItemStep;
  minutes: number | string;
  inputFormat: string;
  outputFormat: string;
  fileName: string | undefined;
  error: string | undefined;
}

export default ConversionItemStatus;
