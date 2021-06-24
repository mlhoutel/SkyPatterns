# Skypatterns

Project FIL A1 - IMT Atlantique

Authors: LHOUTELLIER Maël, GROS Alexis et SIMON Géraud

Under the supervision of Samir Loudni

## Requirements

- Java v12 or greater
- NodeJS v14 or greater (for build or server deployement, included in the .exe)

## Run project locally

```
npm install # Fetch dependancies
```

### Run with source code

Webapp (from the project root)

```
npm run serve # Compiles and hot-reloads for development

or

npm run build # Compiles and hot-reloads for development
```

Api (from project root/src/api)

```
node index.js
```

## Run as desktop application

Install the compiled Electron app as and .exe or compile it yourself

### Install the compiled app

TODO LINK

### Compile the Electron app

```
npm install # Fetch dependancies

then

npm run electron:serve # Compiles electron app for development

or

npm run electron:build # Compiles electron app for production
```

## Project files

### Source code

Webapp

```
.
├───dist_electron       # Electron build
├───node modules        # Installed dependancies
├───public              # Global ressources
├───src
│   ├───api             # See [Api] below
│   ├───assets          # Project ressources
│   ├───plugins
│   ├───components      # |
│   ├───router          # |
│   ├───services        # | Webapp code
│   ├───store           # |
│   └───views           # |
```

Api

```
api
├───data
│   ├─── status.json # Projects infos
│   └─── colors.json # Colors for the graphs display
├───datasets         # Input datasets
├───results          # Outputs from skypattern.jar
├───routes           # Api code
├───index.js         # Entry point (run with: node index.js)
├───skyppatern.jar   # Data mining program
```

### Compiled app

```
.
├───locales
├───ressources
│   └─── api        # See [Api] above
├───skypattern.exe  # App launcher
```
