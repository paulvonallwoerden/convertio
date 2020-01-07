import Requester from "./Requester";
import request = require("request");
import OutputFormat from "./OutputFormat";
import ConvertOptions from "./ConvertOptions";
import ConversionStatus from "./ConversionStatus";
import Conversion from "./Conversion";

class Converter {
  private apiKey: string;
  private requester: Requester;

  constructor(apiKey: string) {
    this.apiKey = apiKey;

    const options: request.CoreOptions = {};
    this.requester = new Requester("https://api.convertio.co", options);
  }

  /**
   * Convert from an url
   *
   * @param url The url
   * @param outputFormat The output format
   * @param options Additional conversion options
   */
  public convertFromUrl(
    url: string,
    outputFormat: OutputFormat | string,
    options?: ConvertOptions
  ): Promise<Conversion> {
    return this.requester
      .post("/convert", {
        apikey: this.apiKey,
        input: "url",
        file: url,
        filename: options?.fileName,
        outputformat: outputFormat,
        options: this.formatConvertOptions(options)
      })
      .then(({ data }: any) => ({
        id: data.id,
        minutes: data.minutes
      }));
  }

  /**
   * Convert from a buffer
   *
   * @param buffer The buffer with file data
   * @param outputFormat The output format
   * @param options Additional conversion options
   */
  public convertFromBuffer(
    buffer: Buffer,
    outputFormat: OutputFormat | string,
    options?: ConvertOptions
  ): Promise<Conversion> {
    return this.requester
      .post("/convert", {
        apikey: this.apiKey,
        input: "base64",
        file: buffer.toString("base64"),
        filename: options?.fileName,
        outputformat: outputFormat,
        options: this.formatConvertOptions(options)
      })
      .then(({ data }: any) => ({
        id: data.id,
        minutes: data.minutes
      }));
  }

  /**
   * Get status of conversion by id.
   * @param id The id returned by convert.
   */
  public getStatus(id: string): Promise<ConversionStatus> {
    return this.requester
      .get(`/convert/${id}/status`)
      .then(({ data }: any) => ({
        id: data.id,
        step: data.step,
        stepPercent: data.step_percent,
        minutes: data.minutes,
        output: {
          url: data.output.url,
          size: data.output.size,
          files: data.output.files
        }
      }));
  }

  /**
   * Get content of a converted file by id.
   *
   * @returns Buffer of data
   */
  public getFileContent(id: string) {
    return this.requester
      .get(`/convert/${id}/dl/base64`)
      .then(({ data }: any) => Buffer.from(data.content, "base64"));
  }

  /**
   * Format a ConvertOptions object into a native javascript object.
   * With matching keys for the API.
   *
   * @param options The options
   * @returns The options object
   */
  private formatConvertOptions(options: ConvertOptions | undefined): object {
    if (!options) return {};

    return {
      callback_url: options.callbackUrl,
      ocr_enabled: options.ocrEnabled,
      ocr_settings: {
        langs: options.ocrSettings?.languages,
        page_nums: options.ocrSettings?.pageNumbers
      }
    };
  }
}

export default Converter;
