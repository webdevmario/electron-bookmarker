# Electron Bookmarker

Initiate application using the following command: `npm start`

## Set Up

- global installation of electron builder: `npm i -g electron-builder`
- local installation of electron builder: `npm i electron-builder --save-dev`

Note: local installation required for build scripts that are taken advantage of here. Installed as a dev dependency in order to not have it included in final build.

## Build

- `build -w zip` (build for Windows and output as a zip file, "dist" folder will be created)
- reference "build" properties in "package.json" to set build specific settings used by Electron Builder
- "win" property handles certificate configuration

## Run Scripts

- `npm run win` - windows build command
- `npm run make-cert` - create a windows self signed certificate (will output a pfx file)

## Certificates

- self signed (development) vs. production (e.g. Comodo)
- self signed certificates may generate a warning during installation
- updating should not work without either included

## Distribution

- obtain your GH token and place in private directory (alongside pfx file)
- execute `GH_TOKEN=XXX electron-builder build -w -p 'onTagOrDraft'`
- relevant files for update process (how repo gets checked)
  - "dist\win-unpacked\resources\app-update.yml"
  - "dist\latest.yml"

## New Release Flow

1. make changes
2. update package.json with new version number
3. commit and push to server
4. set up a release draft based on new version
5. perform build and publish step
6. install from latest installation file produced
