/******************************************************************
// script updates pom.xml and deploys artifacts to Maven repository
*******************************************************************/

import {API} from './api.mjs';
import {deployToMaven} from "./maven.mjs";

deployToMaven(API.downloadedVersion);
