import axios from "axios";

class Requester {
  private apiBaseUrl: string;
  private defaultOptions: object;

  constructor(apiBaseUrl: string, defaultOptions: object) {
    this.apiBaseUrl = apiBaseUrl;
    this.defaultOptions = defaultOptions;
  }

  public async get(path: string, options?: object): Promise<object> {
    const response = await axios.get(this.apiBaseUrl + path, {
      ...this.defaultOptions,
      ...options,
    });

    return response.data;
  }

  public async post(path: string, body: object, options?: object): Promise<object> {
    const response = await axios.post(
      this.apiBaseUrl + path,
      body,
      {
        ...this.defaultOptions,
        ...options,
      }
    );

    return response.data;
  }

  public async delete(path: string, options?: object): Promise<object> {
    const response = await axios.delete(this.apiBaseUrl + path, {
      ...this.defaultOptions,
      ...options,
    });

    return response.data;
  }
}

export default Requester;
