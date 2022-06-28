const fs = require("fs");
const axios = require("axios");

const owner = "airbytehq";
const repo = "airbyte";
const path = "airbyte-config/init/src/main/resources/icons";

async function downloadAirbyteIcons() {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    );

    for (const icon of response.data) {
      const iconUrl = await axios.get(icon.download_url, {
        responseType: "stream",
      });
      const path = `./public/airbyteIcons/${icon.name}`;
      const writer = fs.createWriteStream(path);
      iconUrl.data.pipe(writer);

      writer.on("finish", () => {
        writer.close();
        console.log(`Successfully download ${icon.name}`);
      });

      writer.on("error", () => {
        // Async delete the file, we don't need to check the result
        fs.unlink(path);
        console.error(`Something went wrong when download ${icon.name}`);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

downloadAirbyteIcons();
