import fs from "fs";

const inlineEnvPrefixes = ["NEXT_PUBLIC", "NEXT_SERVER"];

function main() {
  const updateEnvFile =
    process.env.NEXT_ENV_UPDATE_ENV_FILE === "true" ? true : false;

  // 1. Get the key-value pairs from process.env with key starting with NEXT_PUBLIC
  const inlineEnvKeys = Object.keys(process.env).filter((key) =>
    inlineEnvPrefixes.some((prefix) => key.startsWith(prefix))
  );
  const inlineEnvValues = inlineEnvKeys.map((key) => process.env[key]);

  const inlineEnv = {};
  inlineEnvKeys.forEach((key, index) => {
    inlineEnv[key] = inlineEnvValues[index];
  });

  consoleLogMessageTitleWithColor("info", "Found inlined env variables:");
  console.log(inlineEnv);

  // 2. Get the key-value pairs from .env file
  const envFile = dotEnvParse(fs.readFileSync(".env", "utf8"));
  const localFileEnv = {};
  Object.keys(envFile).forEach((key) => {
    localFileEnv[key] = envFile[key];
  });
  const mergedEnv = { ...localFileEnv, ...inlineEnv };

  consoleLogMessageTitleWithColor("info", "Parsed .env file:");
  console.log(localFileEnv);

  consoleLogMessageTitleWithColor(
    "info",
    "Merge inlined and .env file variables:"
  );
  console.log(mergedEnv);

  // 3. Write the merged key-value pairs to .env file
  if (updateEnvFile) {
    let newEnvFileContent = "";
    Object.keys(mergedEnv).forEach((key) => {
      newEnvFileContent += `${key}=${mergedEnv[key]}\n`;
    });
    fs.writeFileSync(".env", newEnvFileContent);
  }

  // 4. Write the merged key-value pairs to public/__env.js
  const publicEnvJs = `window.__env = ${JSON.stringify(mergedEnv)};\n`;
  fs.writeFileSync("public/__env.js", publicEnvJs);
}

main();

// This script is borrowed from [motdotla/dotenv](https://github.com/motdotla/dotenv/blob/master/lib/main.js)

// Parser src into an Object
function dotEnvParse(src) {
  const obj = {};

  // Convert buffer to string
  let lines = src.toString();

  // Convert line breaks to same format
  lines = lines.replace(/\r\n?/gm, "\n");

  const LINE =
    /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;

  let match;
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1];

    // Default undefined or null to empty string
    let value = match[2] || "";

    // Remove whitespace
    value = value.trim();

    // Check if double quoted
    const maybeQuote = value[0];

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");

    // Expand newlines if double quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, "\n");
      value = value.replace(/\\r/g, "\r");
    }

    // Add to object
    obj[key] = value;
  }

  return obj;
}

function consoleLogMessageTitleWithColor(type, title) {
  switch (type) {
    case "warn":
      console.log("\n");
      console.log(
        "\x1b[33m\x1b[43m%s\x1b[0m",
        "GET_MARKDOWN_VIDEO_META_WARN: ",
        title
      );
      break;

    case "error":
      console.log("\n");
      console.log(
        "\x1b[37m\x1b[41m%s\x1b[0m",
        "GET_MARKDOWN_VIDEO_META_ERROR:",
        title
      );
      break;

    case "info":
      console.log("\n");
      console.log(
        "\x1b[34m\x1b[100m%s\x1b[0m",
        "GET_MARKDOWN_VIDEO_META_INFO:",
        title
      );
      break;

    default:
      console.log(title);
  }
}
