/***********************************************************************
 // common functions to process package.json
 ***********************************************************************/

import path from 'node:path';
import {writeJson} from "./utils.mjs";
import nodePackage from '../package.json' with { type: 'json' };

export const packageJson = nodePackage;

/** Updates package.json version */
export function updatePackageVersion(desiredVersion) {
    if (desiredVersion === packageJson.version) {
        console.log(`No update to package.json`);
    } else {
        const nextPackageJson = {
            ...packageJson,
            version: desiredVersion
        };
        writeJson(path.resolve('package.json'), nextPackageJson);
    }
}
