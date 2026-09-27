/**************************************************************************************************************************
// maven-stuff, like deploy (=publish) Open API specification artifacts, and updating version in pom to reflect API version
**************************************************************************************************************************/

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {readSpec, specFile, specYaml} from './api.mjs';

/** Value of a pom expression as resolved by maven, e.g. project.distributionManagement.repository.url */
function pomValue(expression) {
  const value = execFileSync('mvn', [
    'help:evaluate', `-Dexpression=${expression}`, '-q', '-DforceStdout', '-f', 'pom.xml',
  ], { encoding: 'utf8' }).trim();
  if (!value || value === 'null' || value.startsWith('null object')) {
    throw new Error(`${expression} is not set in pom.xml`);
  }
  return value;
}

/** Writes pom-file */
export function updatePomVersion(desiredVersion) {
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

/** Deploys the specification to the Maven repository */
export function deployToMaven(version) {
  updatePomVersion(version);

  const deploy2url = pomValue('project.distributionManagement.repository.url');
  const yamlFilePath = specYaml;
  const jsonFilePath = specFile;

  const mvnOptions = [
    'deploy:deploy-file',
    '-DrepositoryId=github',
    `-Durl=${deploy2url}`,
    '-DpomFile=pom.xml',
    '-DgeneratePom=false',
    '-DuniqueVersion=false',
    `-Dversion=${version}`,
    '-Dclassifier=openapi',
  ];

  execFileSync('mvn', [...mvnOptions, '-Dtype=yaml', `-Dfile=${yamlFilePath}`], { stdio: 'inherit' });
  execFileSync('mvn', [...mvnOptions, '-Dtype=json', `-Dfile=${jsonFilePath}`], { stdio: 'inherit' });
}
