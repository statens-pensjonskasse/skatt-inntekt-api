/*****************************************************
 // common functions to process API properties in api-registry.json OR package.json
 *****************************************************/

import {writeFileSync} from 'node:fs';
import path from 'node:path';
import {readJson, writeJson} from "./utils.mjs";
import packageJson from '../package.json' with { type: 'json' };
import apiRegistry from '../api-registry.json' with { type: 'json' };
import {updatePackageVersion} from "./package.mjs";
import {updatePomVersion} from "./maven.mjs";
import {apiVersions} from "./swaggerhub.mjs";

/* may specify registry and version in package.json, depending on which renovate setup works
// swaggerhubDependency: { "<registry url>": "<version>" }
const [[registry, desiredVersion]] = Object.entries(packageJson.swaggerhubDependency);
const apiProperties = {
    registry,
    desiredVersion,
    specJson: packageJson.files[0],
    specYaml: packageJson.files[1]
};
 */
const apiProperties = {
    registry: apiRegistry.registry,
    desiredVersion: apiRegistry.desiredVersion,
    localJsonFile: apiRegistry.localJson,
    localYamlFile: apiRegistry.localYaml
};

/** Path to files read/written are relative to where script is run from, not script location as for imports */
const specFile = path.resolve(apiProperties.localJsonFile);
const specYaml = path.resolve(apiProperties.localYamlFile);



/** Downloaded specification, null if not downloaded yet */
function readSpec() {
    try {
        return readJson(specFile);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
        return null;
    }
}

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

async function fetchYaml(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
    return await response.text();
}

/** Download specification for desired version, yaml and json format */
async function updateSpec() {
    const versions = await apiVersions(apiProperties.registry);
    const apiUrl = versions.url(apiProperties.desiredVersion);

    const yamlUrl = apiUrl + "/swagger.yaml";
    writeFileSync(specYaml, await fetchYaml(yamlUrl));
    console.log(`${yamlUrl} downloaded to ${specYaml}`);

    // json file is parsed for currently downloaded version, so we download it after yaml to avoid inconsistent versions
    writeJson(specFile, await fetchJson(apiUrl));
    console.log(`${apiUrl} downloaded to ${specFile}`);

    updatePackageVersion(apiProperties.desiredVersion);
    updatePomVersion(apiProperties.desiredVersion);
}

/** Updates package.json swaggerhubDependency version */
async function renovateApi() {
    const versions = await apiVersions(apiProperties.registry);
    if (apiProperties.desiredVersion === versions.latest) {
        console.log(`No update needed. Current version ${apiProperties.desiredVersion} is latest found on ${apiProperties.registry}`);
    } else {
        // til vi har landa på løsning for versjonering, oppdateres begge mulighetene
        const nextApiRegistry = {
            ...apiRegistry,
            desiredVersion: versions.latest
        };
        writeJson(path.resolve('api-registry.json'), nextApiRegistry);
        console.log(`Updated desiredVersion in api-registry.json: ${versions.latest}`);

        const nextPackageJson = {
            ...packageJson,
            swaggerhubDependency: {
                [apiProperties.registry]: versions.latest
            }
        };
        writeJson(path.resolve('package.json'), nextPackageJson);
        console.log(`Updated swaggerhubDependency in package.json: ${versions.latest}`);
    }

}


export const API = {
    specJson: apiProperties.localJsonFile,
    specYaml: apiProperties.localYamlFile,
    desiredVersion: apiProperties.desiredVersion,
    downloadedVersion: readSpec()?.info?.version,
    updateSpec,
    renovateApi
};
