import packageJSON from "../package.json" assert { type: "json" };
import yaml from "js-yaml";
import fs from "fs";

function main() {
  if (packageJSON.pnpm) {
    if (packageJSON.pnpm.overrides) {
      throw new Error(
        `Pnpm overrides can only be used in local development, please don't push it to production. Please check package.json file`
      );
    }
  }

  try {
    const lock = yaml.load(fs.readFileSync("./pnpm-lock.yaml", "utf8"));

    if (lock.overrides) {
      if (Object.keys(lock.overrides).length !== 0) {
        throw new Error(
          `Pnpm overrides can only be used in local development, please don't push it to production. Please check pnpm-lock.yaml file`
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

main();
