skatt-inntekt-api
=================

Repository publishes npm and maven artifacts of Open API specification [inntekt-api](https://app.swaggerhub.com/apis/skatteetaten/inntekt-api/) from skatteetaten, 
tracking updates to versions published on swaggerhub.  
Repo is owned and maintained by SPK Team "integrasjon-og-samhandling".  

**Tracking**: renovate preset to update desired version in `openapi-artifact.json` when new version of inntekt-api is found on swaggerhub.
(node script `update-spec` can be used on developer PC, does not work yet on CI)  

**Updating**: `update-spec` node script will download desired version of the Open API specification from swaggerhub and update version in package.json and pom.xml.
CI workflow will run this script on all branches should you (or renovate-bot) forget to do so.  

**Wrapping**: package.json and pom.xml specifies artifacts:
*   maven: `no.spk.ios:skatt-inntekt-api` artifacts with type=json and type=yaml, both with classifier=openapi
*   npm: `@statens-pensjonskasse/skatt-inntekt-api` npm package containing skatt-inntekt-api.json + skatt-inntekt-api.yaml

**Publishing**: Update on main branch may trigger release and publish npm and maven artifacts.
(it is possible to deploy independently from developer machine, but any version may only be published once, and maven deploy is not straight forward, refer to source code for details)

### Meta
This is a functional example showing how to use [openapi-artifact-wrapper](https://github.com/statens-pensjonskasse/openapi-artifact-wrapper).  
Given that consumed and published artifacts are found on github packages for organization "statens-pensjonskasse", you may have a hard time using openapi-artifact-wrapper,
even if your repo belongs to that organization, access is restricted and you need PATs and stuff for workflow.  

If you are outside organization "statens-pensjonskasse", don't bother fixing, just fork the code you need.  

We may eventually be able to publish open source artifacts as well as code.


about inntekt API
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
node required for local development, maven only if you want to deploy stuff manually.  
`openapi-artifact.json` is used to track desired version of api, `package.json` contains script used to update and manage the API artifacts.  
Scripts, workflows and renovate rely on [openapi-artifact-wrapper](https://github.com/statens-pensjonskasse/openapi-artifact-wrapper)  

### Branching and Release
1. Branch from main
2. Pull-request and merge to main.
3. github workflow builds, releases and deploys

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
```
npm version prepatch --preid=alpha --no-git-tag-version
npm publish --tag alpha
git checkout package.json package-lock.json
```
