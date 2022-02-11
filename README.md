# Convertio (An unofficial convertio.co api for nodejs)

Interact with the https://convertio.co API through nodejs! Super simple.

**Attention:** Because this module is very new, some of its api may change in the future.

## Install

`npm install convertio`

## Usage Examples

```ts
const api = new Convertio("<< SECRET API KEY >>");
```

### Convert From Url

```ts
const url = "https://i.imgur.com/AEDX42G.jpg";

api.convertFromUrl(url, "png");
```

### Convert File on Disk

```ts
const fs = require("fs");
const buffer = fs.readFileSync("/path/to/file.pdf");

api.convertFromBuffer(buffer, "docx");
```

### Get Status of Conversion

```ts
const status = await api.getStatus("CONVERSION ID");
console.log(`Step ${status.step} is at ${status.stepPercent}%`);
```

### Write Converted File to Disk

```ts
const fs = require("fs");

const buffer = await api.getFileContent("CONVERSION ID");
fs.writeFileSync("/path/to/file.png", buffer);
```

### Add a Webhook to the Conversion

```ts
const url = "https://i.imgur.com/AEDX42G.jpg";

api.convertFromUrl(url, "png", { callbackUrl: "https://example.com/webhook" });
```

## Roadmap

- Add Direct File Upload For Conversion
