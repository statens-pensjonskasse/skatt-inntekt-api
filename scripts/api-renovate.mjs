/*******************************************************************************
// script som sjekker swaggerhub og oppdaterer api.json hvis nyere versjon finnes 
********************************************************************************/

import fs from 'node:fs';
import path from 'node:path';
import api from '../api.json' with { type: 'json' };

/** Latest versipon of API found on Swaggerhub */
async function latestVersion() {
  const registryUrl = api.registry.replace('{package}', api.package);
  const response = await fetch(registryUrl);
  if (!response.ok) {
    throw new Error(`SwaggerHub request failed: GET ${registryUrl} responded ${response.status} ${response.statusText}`);
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
    ...api,
    apiVersion,
    apiUrl,
  };
}

async function main() {
  const latest = await latestVersion();
  if (api.apiVersion === latest.apiVersion && api.apiUrl === latest.apiUrl) {
    console.log(`No update needed. Current version: ${api.apiVersion}`);
  } else {
    const apiJsonPath = path.resolve('api.json');
    fs.writeFileSync(apiJsonPath, `${JSON.stringify(latest, null, 2)}\n`);
    console.log(`Updated api.json to version ${latest.apiVersion}: ${latest.apiUrl}`);
  }
}

await main();
