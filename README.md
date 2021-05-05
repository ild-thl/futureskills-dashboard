# Futureskills Dashboard

- Das Projekt basiert auf Angular.       
[Angular CLI](https://github.com/angular/angular-cli) version 11.2.11. 

- Installation der Pakete per npm:  `npm install`

## Environment
- /src/environments/environment.ts.example dublizieren und umbennenen in environment.ts
- Für die staging/production Umgebungen bei Bedarf ebenfalls Kopien erstellen.
- ClientId und ClientSecret eintragen (die Werte werden bei der Einrichtung des Backends generiert).

### Development Server
- Starten des Development-Servers: `ng serve`  
- URL: `http://localhost:4200/`

### Build Environments
- Dev: ```npm run build``` oder ```ng build```
- Staging: ```npm run staging``` oder ```ng build --configuration=staging```
- Production: ```npm run production``` oder ```ng build --prod```

### Tests
- Unit-Tests per Jest: ```npm run test```
  - mit Watcher: ```npm run test:watch```
  - mit Coverage: ```npm run test:coverage```
- e2e-Tests per Protractor: ```npm run e2e```

## Extensions für Visual Studio Code
Neu - Einheitliche Formatierung des Quellcodes mit prettier.  
Falls Probleme in Kombination mit TSLint auftauchen - Bescheid geben, dann muss die Datei noch angepasst werden.  
Extension: 
- Prettier - Code Formatter (esbenp.prettier-vscode)

Empfohlen:     
- Angular Snippets (johnpapa.angular2)   
- Angular Language Service (angular.ng-template)


<hr>

# Angular Readme

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Jest](https://jestjs.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
