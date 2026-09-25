skatt-inntekt-api
=================

Repo is used to track and wrap [skatteetaten inntekt-api](https://app.swaggerhub.com/apis/skatteetaten/inntekt-api/) on swaggerhub.

**Tracking**: Repo is set up so renovate should open Pull Request when a new versions of specification is listed on swaggerhub

**Wrapping**: A merge to main branch is followed by release-tagging and publishing npm and maven artifacts containing the Open API specification  

**Artifacts**:  
*   maven: `no.spk..ios:skatt-inntekt-api` jar with classifier=openapi, containing skatt-inntekt-api.json + skatt-inntekt-api.yaml
*   npm: `@skatteetaten/skatt-inntekt-api` npm package containing skatt-inntekt-api.json + skatt-inntekt-api.yaml

about inntekt API
-----------------
[skatteetaten inntekt-api](https://app.swaggerhub.com/apis/skatteetaten/inntekt-api/) is
the Open API specification for income (inntekt) from the Norwegian Tax Administration (skatteetaten).  
The API is documented [here](https://skatteetaten.github.io/api-dokumentasjon/en/api/inntekt).

skatt-inntekt-api eies og forvaltes av team-integrasjon-og-samhandling
