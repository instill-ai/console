import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import yaml from "js-yaml";

// Load .env and .env.local files
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  try {
    console.log("Downloading AI component icons...");
    await getComponentIcons("ai");
    await getComponentIcons("data");
    await getComponentIcons("application");
    await getComponentIcons("generic");
    await getComponentIcons("operator");
  } catch (error) {
    console.error(error);
  }
}

type GitHubContent = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "dir" | "file";
  _links: {
    self: string;
    git: string;
    html: string;
  };
  content?: string;
};

async function getComponentIcons(
  componentType: "ai" | "data" | "application" | "generic" | "operator"
) {
  const bathPath =
    "https://api.github.com/repos/instill-ai/pipeline-backend/contents";
  let folderPath: string | null = null;

  try {
    switch (componentType) {
      case "ai":
        folderPath = bathPath + "/pkg/component/ai";
        break;
      case "data":
        folderPath = bathPath + "/pkg/component/data";
        break;
      case "application":
        folderPath = bathPath + "/pkg/component/application";
        break;
      case "generic":
        folderPath = bathPath + "/pkg/component/generic";
        break;
      case "operator":
        folderPath = bathPath + "/pkg/component/operator";
        break;
      default:
        throw new Error("Invalid component type");
    }

    // Get all the component folders in given component type
    const componentFolders = (await fetch(folderPath, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }).then((res) => res.json())) as GitHubContent[] | undefined;

    if (!componentFolders || !componentFolders.length) {
      return [];
    }

    for (const componentFolder of componentFolders) {
      if (componentFolder.type !== "dir") {
        continue;
      }

      const componentFolderContent = (await fetch(componentFolder.url, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }).then((res) => res.json())) as GitHubContent[] | undefined;

      if (!componentFolderContent || !componentFolderContent.length) {
        continue;
      }

      // In the folder, we can find the version like v0, v1, etc. The structure is like this:
      // pkg/component/ai/anthropic/v0
      // We need to get the latest version
      const componentVersions = componentFolderContent
        .map((c) => Number(c.name.replace("v", "")))
        .sort((a, b) => b - a);

      let definitionFileContent: GitHubContent | undefined;
      let targetFolderContent: GitHubContent | undefined;
      let definitionFilePath: string | undefined;

      // Edge case: In some case BE will put an non valid definition file in one specific version folder
      // We will treat it as invalid version try to find the definition file in the previous version
      for (const version of componentVersions) {
        const versionString = `v${version}`;
        targetFolderContent = componentFolderContent.find(
          (c) => c.name === versionString
        );

        if (!targetFolderContent) {
          console.error(
            `Target folder content not found: ${componentFolder.url}`
          );
          continue;
        }

        // We need to get the icon's file name, but to obey the go naming convention, the folder name
        // is named like stabilityai but the icon is named like stability-ai.svg, so we need to get into
        // the definition file and get the icon name

        definitionFilePath =
          bathPath + "/" + targetFolderContent.path + "/config/definition.yaml";

        definitionFileContent = (await fetch(definitionFilePath, {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }).then((res) => res.json())) as GitHubContent | undefined;

        if (!definitionFileContent || !definitionFileContent.content) {
          console.warn(
            `Definition file not found in version ${versionString}, trying previous version.`
          );
          continue;
        }
      }

      if (!definitionFileContent || !definitionFileContent.content) {
        console.error(
          `Definition file content not found: ${definitionFilePath}`
        );
        continue;
      }

      if (!targetFolderContent) {
        console.error(
          `Target folder content not found: ${componentFolder.url}`
        );
        continue;
      }

      // We need to decode the base64 to JSON and get the icon name
      const definition = yaml.load(
        Buffer.from(definitionFileContent.content, "base64").toString("utf-8")
      ) as Record<string, any>;

      if (!definition || !definition.icon) {
        console.error(`Definition not found: ${definitionFileContent.url}`);
        continue;
      }

      // The icon file name will be like assets/openai.svg
      const iconFileName = definition.icon.split("/")[1];

      if (!iconFileName) {
        console.error(`Icon file name not found: ${definition.icon}`);
        continue;
      }

      // The full icon path will be like
      // https://api.github.com/repos/instill-ai/pipeline-backend/contents/pkg/component/ai/cohere/v0/assets/openai.svg
      const iconFilePath =
        bathPath + "/" + targetFolderContent.path + "/assets/" + iconFileName;

      const iconFileContent = (await fetch(iconFilePath, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }).then((res) => res.json())) as GitHubContent | undefined;

      if (!iconFileContent || !iconFileContent.download_url) {
        console.error(`Icon file content not found: ${iconFilePath}`);
        continue;
      }

      downloadIcon(
        iconFileContent.download_url,
        "./public/icons/" + iconFileName
      );
    }

    return componentFolders;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function downloadIcon(url: string, path: string) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download icon: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(path, buffer);
    console.log(`Icon downloaded and saved to: ${path}`);
  } catch (err) {
    console.error(`Error downloading icon: ${err}`);
  }
}

main();
