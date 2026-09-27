/************************************************************************
// script downloads Open API specification according to setup in api.json
//  and updates version in package.json + pom.xml
*************************************************************************/

import { apiJson, readSpec, downloadSpec } from './api.mjs';
import { updatePackageVersion } from './package.mjs';
import {updatePomVersion} from "./maven.mjs";

async function main() {
  const actualVersion = readSpec()?.info?.version;
  const desiredVersion = apiJson.apiVersion;
  if ( actualVersion === desiredVersion ) {
    console.log(`No update needed. Current version: ${actualVersion}, Desired version: ${desiredVersion}`);
  } else {
    await downloadSpec();
    console.log(`Downloaded API spec version ${desiredVersion}`);
  }
  updatePackageVersion(desiredVersion);
  updatePomVersion(desiredVersion);
}

await main();
