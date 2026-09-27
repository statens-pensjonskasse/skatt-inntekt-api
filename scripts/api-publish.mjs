/******************************************************************
// script updates pom.xml and deploys artifacts to Maven repository
*******************************************************************/

import {readSpec} from './api.mjs';
import {deployToMaven} from "./maven.mjs";

const desiredVersion = readSpec().info.version;
deployToMaven(desiredVersion);
