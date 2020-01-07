// uploading,converting,finished,failed,unknown

enum ConversionItemStep {
  Unknown = "unknown",
  Failed = "failed",
  Finish = "finished",
  Convert = "converting",
  Upload = "uploading"
}

export default ConversionItemStep;
