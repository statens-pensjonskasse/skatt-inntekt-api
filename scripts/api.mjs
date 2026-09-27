/*****************************************************
 // common functions to process project file: api.json
 *****************************************************/

import {writeFileSync} from 'node:fs';
import path from 'node:path';
import {readJson, writeJson} from "./utils.mjs";
import api from '../api.json' with { type: 'json' };

const apiJsonPath = path.resolve('api.json');

export const apiJson = api;

/** Path to file containing the downloaded API specification, may not exist */
export const specFile = path.resolve(api.specJson);
export const specYaml = path.resolve(api.specJson.replace(/\.json$/, '.yaml'));

/** Downloaded specification, null if not downloaded yet */
export function readSpec() {
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

/** Download specifications, yaml and json format */
export async function downloadSpec() {
    const yamlUrl = apiJson.apiUrl + "/swagger.yaml";
    writeFileSync(specYaml, await fetchYaml(yamlUrl));
    console.log(`${yamlUrl} downloaded to ${specYaml}`);

    // json file is parsed for currently downloaded version, so we download it after yaml to avoid inconsistent versions
    writeJson(specFile, await fetchJson(apiJson.apiUrl));
    console.log(`${apiJson.apiUrl} downloaded to ${specFile}`);
}

/** Latest versipon of API found on Swaggerhub */
async function latestVersion() {
    const response = await fetch(apiJson.registry);
    if (!response.ok) {
        throw new Error(`SwaggerHub request failed: GET ${apiJson.registry} responded ${response.status} ${response.statusText}`);
    }

    const swaggerHubInfo = await response.json();
    const version = swaggerHubInfo.defaultVersion;
    if (typeof version !== 'string' || !version) {
        throw new Error('SwaggerHub response did not include a default version');
    }

    const latestApi = swaggerHubInfo.apis?.find((swaggerApi) =>
        swaggerApi.properties?.some((property) =>
            property.type === 'X-Version' && property.value === version
        )
    );
    const apiVersion = latestApi?.properties?.find((property) => property.type === 'X-Version')?.value;
    const apiUrl = latestApi?.properties?.find((property) => property.type === 'Swagger')?.url;
    if (apiVersion !== version || typeof apiUrl !== 'string' || !apiUrl) {
        throw new Error(`SwaggerHub response did not include X-Version and Swagger URL for ${version}`);
    }

    return {
        ...apiJson,
        apiVersion,
        apiUrl,
    };
}

export async function renovateApi() {
    const latest = await latestVersion();
    if (apiJson.apiVersion === latest.apiVersion && apiJson.apiUrl === latest.apiUrl) {
        console.log(`No update needed. Current version: ${apiJson.apiVersion}`);
    } else {
        writeJson(apiJsonPath, latest);
        console.log(`Updated api.json to version ${latest.apiVersion}: ${latest.apiUrl}`);
    }

}   

