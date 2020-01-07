import Requester from "./Requester";
import request = require("request");
import OutputFormat from "./OutputFormat";
import ConvertOptions from "./ConvertOptions";
import ConversionStatus from "./ConversionStatus";
import Conversion from "./Conversion";
import ConversionItemStep from "./ConversionItemStep";
import ConversionItemStatus from "./ConversionItemStatus";

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
   * Get a list of conversions filtered by status.
   *
   * @param filter The status to filter the conversions by.
   * @param limit The maximum number of conversions to return.
   * @returns A list of conversions.
   */
  public listConversions(
    filter:
      | ConversionItemStep
      | "all"
      | "uploading"
      | "converting"
      | "finished"
      | "failed" = "all",
    limit?: number
  ): Promise<Array<ConversionItemStatus>> {
    return this.requester
      .post("/convert/list", {
        apikey: this.apiKey,
        status: filter,
        count: limit
      })
      .then(({ data }: any) => data)
      .then((items: any[]) =>
        items.map((itm: any) => ({
          id: itm.id,
          status: itm.status,
          minutes: itm.minutes,
          inputFormat: itm.inputformat,
          outputFormat: itm.outputformat,
          fileName: itm.filename,
          error: itm.error
        }))
      );
  }

  /**
   * Synonym for .cancelConversion();
   */
  public deleteFile(id: string) {
    return this.cancelConversion(id);
  }

  /**
   * Cancel a conversion and delete the corresponding file.
   *
   * @param id The id of the conversion
   */
  public cancelConversion(id: string): Promise<any> {
    return this.requester.delete(`/convert/${id}`).then(() => {});
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
