# Futureskills Dashboard

## Voraussetzungen
- Das Projekt basiert auf Angular 13 ([Angular CLI](https://github.com/angular/angular-cli) Version 13.1.2., npm package:  @angular/cli@13.1.2)
- Notwendig: [Node.js](https://nodejs.org/en/) in der LTS Version 16 (NICHT die 17!) 
- mit der Node.js Version 16 wird auch automatisch der Paketinstaller npm in Version 8.1 installiert

### Paketinstaller
WICHTIG: Wir wechseln auf YARN (https://yarnpkg.com/getting-started/install). 

- Wenn Node.js Version >=16, dann ist Yarn schon installiert.
  - Run:  `corepack enable`
  - Für Windows: corepack muss als Administrator ausgeführt werden


- Wenn Node.js Version <16,
  - Run `npm i -g corepack` (die Variante geht natürlich immer, dann hat man YARN einfach nochmal extra installiert)

Danach auf die neueste Version 3.1.x updaten mit : ` yarn set version stable` .
Auch das Update muss unter Windows als Admin ausgeführt werden.

Die Befehle zum Hinzufügen und Ändern von Packages unterscheidet sich von npm.    
Siehe unter https://yarnpkg.com/getting-started/usage    
(z.B: `yarn add` --> Hinzufügen von packages )

## Installation
Einfach nur: `yarn`


## Extensions für Visual Studio Code
### Bitte installieren:    
- Prettier - Code Formatter (esbenp.prettier-vscode) 
- Kontextsensitive Hilfe mit Angular Language Service (angular.ng-template)
- ESLint: (dbaeumer.vscode-eslint)

### optional:    
- Angular Snippets (johnpapa.angular2)   

## Umgebung
Es gibt drei Umgebungen -> (development/staging/production)

- /src/environments/environment.ts.example dublizieren und umbennenen in environment.ts
- Für die staging/production Umgebungen bei Bedarf ebenfalls Kopien erstellen.
- ClientId und ClientSecret eintragen (die Werte werden bei der Einrichtung des Backends generiert).

## Starten der Build/Serve Umgebungen
Alle drei Umgebungen lassen sich mit `ng build` als Webseiten-Projekt exportieren als auch als Entwicklungs-Projekt mit `ng serve` starten. Angular 13 kompiliert per Standard als _production_. Das wurde in diesem Projekt wieder zurück auf _development_ gestellt (wie in Angular 11)!

### SERVE -  (http://localhost:4200)
- Development: `ng serve`  oder `npm run start`
- Theoretisch funktionieren auch die Staging/Prod Umgebungen (die Envs verweisen aber auf externe Server)
  - Staging: `ng serve --configuration=staging` 
  - Production: `ng serve --configuration=production` 

### BUILD -  (unter dist/futureskills-client)
- Development: `ng build`  oder `npm run build`
- Staging: `ng build --configuration=staging`  oder `npm run staging`
- Production: `ng build --configuration=production`   oder `npm run production`

### Linting
- Eslint ist jetzt konfiguriert: `npm run lint`

### Tests
- Unit-Tests per Karma: ```npm run test```

<hr>

# Official Angular Readme

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
