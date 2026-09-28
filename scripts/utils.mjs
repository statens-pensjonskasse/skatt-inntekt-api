/*******************************************************************************
 // common functions and paths used by the scripts
 ********************************************************************************/

import {readFileSync, writeFileSync} from 'node:fs';

export function readJson(file) {
    return JSON.parse(readFileSync(file, 'utf8'));
}

export function writeJson(filePath, data) {
    const prettied = JSON.stringify(data, null, 2);
    writeFileSync(filePath, `${prettied}\n`);
}
