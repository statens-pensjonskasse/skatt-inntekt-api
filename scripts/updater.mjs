import fs from 'node:fs';
import path from 'node:path';
import packageJson from '../package.json' with { type: 'json' };


const packageJsonPath = path.resolve('package.json');
const pomXmlPath = path.resolve('pom.xml');
const desiredVersion = packageJson._OPEN_API_.apiVersion;
const specUrl = packageJson._OPEN_API_.apiUrl;
const specJson = path.resolve(packageJson._OPEN_API_.specJson);

let actualVersion = '0.0.0';
try {
  // gets version from Open API specification
  const apiDocument = (await import(specJson, { with: { type: 'json' } })).default;
  actualVersion = apiDocument.info.version;
} catch (error) {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') {
    throw error;
  }
}

async function downloadSpec() {
  if (!specUrl) {
    throw new Error('Missing _OPEN_API_.apiUrl in package.json');
  }
  const response = await fetch(specUrl);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  }

  const body = await response.json();
  const prettied = JSON.stringify(body, null, 2);
  fs.writeFileSync(path.resolve(specJson), prettied);
}

/** Updates package.json and pom.xml with new API version */
function updateProjectVersions() {
  const nextPackageJson = {
    ...packageJson,
    version: desiredVersion
  };
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(nextPackageJson, null, 2)}\n`);

  const pomXml = fs.readFileSync(pomXmlPath, 'utf8');
  const match = /<version>.+<!--APIVERSION-->/
  const nextPomXml = pomXml.replace(match, `<version>${desiredVersion}<!--APIVERSION-->`);

  if (nextPomXml === pomXml) {
    throw new Error('Could not update project version in pom.xml');
  }

  fs.writeFileSync(pomXmlPath, nextPomXml);
}

async function main() {
  if ( actualVersion === desiredVersion ) {
    console.log(`No update needed. Current version: ${actualVersion}, Desired version: ${desiredVersion}`);
  } else {
    await downloadSpec();
    console.log(`Downloaded API spec version ${desiredVersion}`);
  }
  updateProjectVersions();
}

await main();
