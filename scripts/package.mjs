/***********************************************************************
 // common functions to process package.json (the published package in repository root)
 ***********************************************************************/

import path from 'node:path';
import {readJson, writeJson} from "./utils.mjs";

const packageJsonPath = path.resolve('package.json');

export const packageJson = readJson(packageJsonPath);

/** Updates package.json version */
export function updatePackageVersion(desiredVersion) {
    if (desiredVersion === packageJson.version) {
        console.log(`No update to package.json`);
    } else {
        const nextPackageJson = {
            ...packageJson,
            version: desiredVersion
        };
        writeJson(packageJsonPath, nextPackageJson);
    }
}
