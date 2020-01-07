import request from "request";

class Requester {
  private apiBaseUrl: string;
  private defaultOptions: object;

  constructor(apiBaseUrl: string, defaultOptions: object) {
    this.apiBaseUrl = apiBaseUrl;
    this.defaultOptions = defaultOptions;
  }

  public get(path: string, options?: request.CoreOptions): Promise<object> {
    return this.doRequest(path, {
      ...this.defaultOptions,
      ...options,
      method: "GET"
    });
  }

  public post(
    path: string,
    body: object,
    options?: request.CoreOptions
  ): Promise<object> {
    return this.doRequest(path, {
      ...this.defaultOptions,
      ...options,
      body: JSON.stringify(body),
      method: "POST"
    });
  }

  private doRequest(
    path: string,
    options: request.CoreOptions
  ): Promise<object> {
    return new Promise((resolve, reject) =>
      request(this.apiBaseUrl + path, options, (error, response, body) => {
        if (error) return reject(error);
        return resolve(body);
      })
    )
      .then((rawBody: any) => JSON.parse(rawBody))
      .then((body: any) => {
        // The .status field is defined by the convertio API
        if (body.status === "ok") return body;
        else throw body.error;
      });
  }
}

export default Requester;
