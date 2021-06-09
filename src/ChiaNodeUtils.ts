import { homedir } from "os";
import { resolve } from "path";
import { readFileSync } from "fs";
import { parse } from "yaml";
import { ChiaConfig } from "./types/ChiaConfig";

let chiaRootPath: string = "";

export const getChiaRootPath = (net: string): string => {
  if (chiaRootPath) return chiaRootPath;

  chiaRootPath = resolve(
    homedir(),
    process.env["CHIA_ROOT"] || ".chia/" + net
  );
  return chiaRootPath;
};

export const getChiaConfig = (net: string): ChiaConfig => {
  const configFilePath = resolve(getChiaRootPath(net), "config", "config.yaml");
  const configFile = readFileSync(configFilePath, "utf8");
  return parse(configFile) as ChiaConfig;
};

export const getChiaFilePath = (net: string, relativePath: string): string => {
  return resolve(getChiaRootPath(net), relativePath);
};
