skatt-inntekt-api
=================

Repository publishes npm and maven artifacts of Open API specification [inntekt-api](https://app.swaggerhub.com/apis/skatteetaten/inntekt-api/) from skatteetaten, 
tracking updates to versions published on swaggerhub.  
This is a also functional example showing how to use [openapi-artifact-wrapper](https://github.com/statens-pensjonskasse/openapi-artifact-wrapper) and [swagger-tracker](https://github.com/statens-pensjonskasse/swagger-tracker).

Repo is owned and maintained by SPK Team "integrasjon-og-samhandling".  

About inntekt API
-----------------
[inntekt-api](https://app.swaggerhub.com/apis/skatteetaten/inntekt-api/) is
the Open API specification for income (inntekt) from the Norwegian Tax Administration (skatteetaten).  
The API is documented [here](https://skatteetaten.github.io/api-dokumentasjon/en/api/inntekt).

License
-------
`skatt-inntekt-api.json` and `skatt-inntekt-api.yaml` are downloaded from Swaggerhub and can **not** be wrapped with license that is incompatible with that contained in those files.
They are subject to [Skatteetaten's terms of use](https://www.skatteetaten.no/deling/bruksvilkar-for-delingstjenester).  
The published npm and Maven artifacts contain only these files. See [NOTICE](NOTICE).  

As for the remaining code, scripts and workflows in this repository, you may consider them [MIT-0](https://opensource.org/license/mit-0) licensed.

Development
-----------
node required for local development, maven for deployment.  
Branch from main and merge through PRs, as in std SPK workflow.  

### How it works
`api-tracker.json` is used by [swagger-tracker](https://github.com/statens-pensjonskasse/swagger-tracker) for tracking API on swaggerhub.  
`package.json` contains script used to update and manage the API artifacts.  

**Tracking**:
* CI: renovate preset to update desired version in `api-tracker.json` when new version of inntekt-api is found on swaggerhub.
* local: node script `renovate` and

**Updating**: node script `build` will download desired version of the Open API specification from swaggerhub, update package.json and emit pom.xml.

**Wrapping**: package.json and pom.xml specifies artifacts:
*   maven: `no.spk.ios:skatt-inntekt-api` artifacts with type=json and type=yaml, both with classifier=openapi
*   npm: `@statens-pensjonskasse/skatt-inntekt-api` npm package containing skatt-inntekt-api.json + skatt-inntekt-api.yaml

**Publishing**:  
* CI workflow: Update on main branch may trigger build, release and publish npm and maven artifacts.
* local: `npm run tbv` to prepare and verify, commit dirty files, publish with `npm publish --access public` and `mvn deploy`


### SNAPSHOTs and development versions
Should you care to publish SNAPSHOT/development versions of wrapped API artifact, you must do so manually

#### Maven
```
mvn install:install-file \
-DpomFile=pom.xml -DgeneratePom=false -DuniqueVersion=false -Dversion=1.7.0-SNAPSHOT \
-Dclassifier=openapi -Dtype=yaml -Dfile=skatt-inntekt-api.yaml
```
(or `mvn deploy:deploy-file-DrepositoryId=github -Durl=https://maven.pkg.github.com/statens-pensjonskasse/skatt-inntekt-api ...` if you want to distribute SNAPSHOT outside your machine)

#### Node
(you may want to manually rewind version, because npm will forward version to next with provided script)
```
npm version prepatch --preid=alpha --no-git-tag-version
npm publish --tag alpha
git checkout package.json package-lock.json
```
