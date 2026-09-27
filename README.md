skatt-inntekt-api
=================

Repository used to track and wrap [inntekt-api](https://app.swaggerhub.com/apis/skatteetaten/inntekt-api/) from skatteetaten on swaggerhub.

**Tracking**: Repo has renovate script to update `api.json` when new version is found on swaggerhub.  
TODO: add workflow to run script and open PR when new version is found.  

**Wrapping**: A version update on main will trigger release and publish npm and maven artifacts containing the Open API specification files (json and yaml)  

**Artifacts**:  
*   maven: `no.spk..ios:skatt-inntekt-api` jar with classifier=openapi, type=json with skatt-inntekt-api.json, type=yaml contains skatt-inntekt-api.yaml
*   npm: `@skatteetaten/skatt-inntekt-api` npm package containing skatt-inntekt-api.json + skatt-inntekt-api.yaml

Repository is owned by SPK Team "integrasjon-og-samhandling"

about inntekt API
-----------------
[inntekt-api](https://app.swaggerhub.com/apis/skatteetaten/inntekt-api/) is
the Open API specification for income (inntekt) from the Norwegian Tax Administration (skatteetaten).  
The API is documented [here](https://skatteetaten.github.io/api-dokumentasjon/en/api/inntekt).

Development
-----------
node required for local development, maven only if you want to deploy stuff manually.  
run scripts in package.json according to needs.  
Open Pull requests for changes.  