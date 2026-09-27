/***********************************************************************
// script updates api.json if a newer API version is found on swaggerhub
************************************************************************/

import {renovateApi} from './api.mjs';

await renovateApi();
