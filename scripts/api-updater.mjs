/*******************************************************************************
// script som oppdaterer Open API spesifikasjonen, pom.xml og package.json
// ihht oppsett i api.json 
********************************************************************************/

import fs from 'node:fs';
import path from 'node:path';
import api from '../api.json' with { type: 'json' };

const desiredVersion = api.apiVersion;
const downloadedSpec = path.resolve(api.specJson);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** Version of API found in downloaded specification */
function downloadedVersion() {
  try {
    return readJson(downloadedSpec).info?.version;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    return undefined;
  }
}

/** Download specification */
async function downloadSpec() {
  if (!api.apiUrl) {
    throw new Error('Missing apiUrl in api.json');
  }
  const response = await fetch(api.apiUrl);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  }

  const body = await response.json();
  const prettied = JSON.stringify(body, null, 2);
  fs.writeFileSync(downloadedSpec, prettied);
}

/** Updates package.json and pom.xml with new API version */
function updateProjectVersions() {
  const packageJsonPath = path.resolve('package.json');
  const packageJson = readJson(packageJsonPath);
  if (desiredVersion === packageJson.version) {
    console.log(`No update to package.json`);
  } else {
    const nextPackageJson = {
      ...packageJson,
      version: desiredVersion
    };
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(nextPackageJson, null, 2)}\n`);
  }

  const pomXmlPath = path.resolve('pom.xml');
  const pomXml = fs.readFileSync(pomXmlPath, 'utf8');
  const match = /<version>.+<!--APIVERSION-->/
  const nextPomXml = pomXml.replace(match, `<version>${desiredVersion}<!--APIVERSION-->`);

  if (nextPomXml === pomXml) {
    console.log(`No update to pom.xml`);
  } else {
    fs.writeFileSync(pomXmlPath, nextPomXml);
  }
}

async function main() {
  const actualVersion = downloadedVersion();
  if ( actualVersion === desiredVersion ) {
    console.log(`No update needed. Current version: ${actualVersion}, Desired version: ${desiredVersion}`);
  } else {
    await downloadSpec();
    console.log(`Downloaded API spec version ${desiredVersion}`);
  }
  updateProjectVersions();
}

await main();
