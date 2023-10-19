const fs = require("fs");
const axios = require("axios");
const yaml = require("js-yaml");

const airbyteOwner = "airbytehq";
const airbyteRepo = "airbyte";
const airbytePath = "airbyte-integrations/connectors";

async function downloadAirbyteIcons() {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${airbyteOwner}/${airbyteRepo}/contents/${airbytePath}`
    );

    for (const entity of response.data) {
      if (entity.type === "dir") {
        const folderEntity = await axios.get(
          `https://api.github.com/repos/${airbyteOwner}/${airbyteRepo}/contents/${entity.path}`
        );

        let iconName = null;

        let metaDataFile = folderEntity.data.find(
          (e) => e.name === "metadata.yaml"
        );

        if (metaDataFile) {
          const metadata = await axios.get(metaDataFile.download_url);
          const metadataYaml = yaml.load(metadata.data);
          iconName = metadataYaml.data.icon;
        }

        if (!iconName) {
          continue;
        }

        let iconFile = folderEntity.data.find((e) => e.name === "icon.svg");

        if (!iconFile) {
          continue;
        }

        const path = `./public/icons/airbyte/${iconName}`;

        downloadIcon(iconFile.download_url, path);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function downloadIcon(url, path) {
  try {
    const iconUrl = await axios.get(url, {
      responseType: "stream",
    });

    const writer = fs.createWriteStream(path);
    iconUrl.data.pipe(writer);

    writer.on("finish", () => {
      writer.close();
      console.log(`Successfully download ${url}`);
    });

    writer.on("error", (err) => {
      // Async delete the file, we don't need to check the result
      fs.unlink(path, (err) => {
        if (err) throw err;
        console.log(`${path} was deleted`);
      });
      console.error(`Something went wrong when download ${url}: ${err}`);
    });
  } catch (err) {
    console.log(err);
  }
}

downloadAirbyteIcons();
