import { homedir } from "os";
import { resolve } from "path";
import { readFileSync } from "fs";
import { parse } from "yaml";
import { ChiaConfig } from "./types/ChiaConfig";

let chiaRootPath: string = "";

export const getChiaRootPath = (): string => {
  if (chiaRootPath) return chiaRootPath;

  chiaRootPath = resolve(
    homedir(),
    process.env["CHIA_ROOT"] || ".chia/testnet_7"
  );
  
  return chiaRootPath;
};

export const getChiaConfig = (): ChiaConfig => {
  const configFilePath = resolve(getChiaRootPath(), "config", "config.yaml");
  const configFile = readFileSync(configFilePath, "utf8");
  return parse(configFile) as ChiaConfig;
};

export const getChiaFilePath = (relativePath: string): string => {
  return resolve(getChiaRootPath(), relativePath);
};
