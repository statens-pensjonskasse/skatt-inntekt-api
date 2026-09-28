/******************************************************************************
// script downloads Open API specification according to package.json properties
// will also update version of package.json + pom.xml
*******************************************************************************/

import { API } from './api.mjs';

async function main() {
  const actualVersion = API.downloadedVersion;
  const desiredVersion = API.desiredVersion;
  if ( actualVersion === desiredVersion ) {
    console.log(`No update needed. Current version: ${actualVersion}, Desired version: ${desiredVersion}`);
  } else {
    await API.updateSpec();
    console.log(`Updated API spec to version ${desiredVersion}`);
  }
}

await main();
