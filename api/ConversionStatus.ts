import ConversionStep from "./ConversionStep";

interface ConversionStatus {
  id: string;
  step: ConversionStep;
  stepPercent: number;
  minutes: number;
  output: {
    url: string;
    size: number;
    files: object | undefined;
  };
}

export default ConversionStatus;
