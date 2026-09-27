/*******************************************************************************
 // common functions to look into the actual, downloaded json file
 ********************************************************************************/

import {readFileSync, writeFileSync} from 'node:fs';

export function readJson(file) {
    return JSON.parse(readFileSync(file, 'utf8'));
}

export function writeJson(filePath, data) {
    const prettied = JSON.stringify(data, null, 2);
    writeFileSync(filePath, prettied);
}

