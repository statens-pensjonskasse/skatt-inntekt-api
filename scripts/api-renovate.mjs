/***********************************************************************
// script updates apiVersion if a newer version is found on swaggerhub
************************************************************************/

import {API} from './api.mjs';

await API.renovateApi();
