# Update auf Angular 13

Aktuelle Version -> auch in der Doku (https://github.com/ild-thl/futureskills-doku/tree/main/Protokolle)

## Globale Voraussetzungen
Bitte updaten:

### Node und npm

- node.js in Version 16/LTS (nicht die neue 17!) https://nodejs.org/en/download/ 
  - Mac: Am besten mit Brew (https://formulae.brew.sh/formula/node@16) installieren.

- npm mind. in Version 8.1
  - Unter Mac ist die Version in Node16 enthalten (Pfad setzen!)
  - Unter Windows:
    - *Kommandozeile als Admin ausführen, Installationspfad ggf. anpassen*
    - cd /c/Programme/nodejs
    - npm install npm@latest
    - npm -v

### YARN

- Wechsel des Package Managers zu yarn (https://yarnpkg.coml).
- Wenn Node.js Version >=16, dann ist Yarn schon installiert.
  - Run:  `corepack enable`
  - Für Windows: corepack muss als Administrator ausgeführt werden

- Wenn Node.js Version <16,
  - Run `npm i -g corepack` (die Variante geht natürlich immer, dann hat man YARN einfach nochmal extra installiert)

- Testen der Version mit `yarn --version`, sollte aktuell 1.22.17 sein.
- wenn nicht: `yarn set version 1.22.17` . (Auch das Setzen der Version muss unter Windows als Admin ausgeführt werden)

- Die Befehle zum Hinzufügen und Ändern von Packages unterscheidet sich von npm.    
Siehe unter https://yarnpkg.com/getting-started/usage    
(z.B: `yarn add` --> Hinzufügen von packages )

## Angular-CLI

- Angular-CLI (falls ihr die auch global installiert habt): @angular/cli@13.1.1 https://www.npmjs.com/package/@angular/cli#usage
  - npm uninstall -g @angular/cli
  - npm cache verify (optional, nicht immer notwendig)
  - npm install -g @angular/cli@13.1.1

- node_modules Ordner löschen, wenn von einer vorhandenen Installation upgedatet wird.

## Änderungen in Angular

### Major Package Änderungen
- RXJS: von 6 auf 7 (Einige Funktionen sind deprecated und werden in 8 entfernt -> todo)
- ng-bootstrap von 9 auf 11 
- cookie-service von 11 auf 13
- ngx-owl-carousel-o von 5 auf 7
- kolkov/editor auf Version 2.0.0

- kein Support mehr für IE
- Typescript Version 4.4

### Allgemeine Änderungen
- Die Rendering Engine wurde jetzt komplett auf Ivy umgestellt, also keine View Engine mehr
  - die einzige Komponente, die noch mit der View Engine kompiliert wurde ist der kolkovEditor, aber es soll bald eine neue Version geben.
- Das Package-Format ist jetzt APF (Angular Package Format), also modernere Module (ES Modules und ES2020), die kompilierten Dateien sind kleiner (knapp 1MB)
- Angular erstellt jetzt einen Cache (.angular/cache). Soll bis zu 68% schneller kompilieren. Ab und zu wenn etwas merkwürdig erscheint, kann man den Ordner einfach mal löschen.
- Unter .vscode konnten schon immer Einstellungen für das Projekt gespeichert werden, die waren aber nicht in Github eingecheckt. Neu sind die Vorschläge für die erforderlichen Plugins im Ordner. Diese sind jetzt auch eingecheckt.

- /deep/ ist deprecated , ::ng-deep scheint aber ok zu sein (todo für die nächsten Versionen)

### Typescript
Schon in Typescript 4.3 gab es viele Änderungen. Es wird Zeit auch einige Features auch zu nutzen. 
Angular 13 passt die tsconfig automatisch entsprechend an, einige Punkte sind aber noch auskommentiert. Das muss in den nächsten Wochen angepasst werden. 

- STRICT Mode in tsconfig.json: Der soll zukünftig angeschaltet werden, d.h alle Variablen müssen initialisiert werden und dürfen kein any type als default haben. Die Anpassung ist etwas aufwändiger.
- strictTemplates für HTML: Soll auch angeschaltet werden, hier werden alle HTML-Templates geprüft, ob die angesprochenen Objekte die Properties besitzen, die angesprochen werden (sehr praktisch!).
- Override (Funktionen, die überschrieben werden müssen explizit mit override gekennzeichnet werden. Ist im Moment nur im KI-Playground und in der Konfiguration für hammer.js relevant)
- Zugriff auf Properties: Der Zugriff darf nicht mehr in der Form `this.route.snapshot.params.id` (ein Beispiel) erfolgen, sondern müssen so angesprochen werden: `['id']`. Das ist zieht sich ebenfalls durch den kompletten Quellcode und muss nach und nach angepasst werden.



### Tests und Linting
- Da Protractor ab 2023 nicht mehr unterstützt wird, gibt es keine Konfiguration mehr für die e2e Testumgebung. 
  - Karma wird weiterhin unterstützt und ist konfiguriert, Jest ist erstmal nicht konfiguriert.
  - Falls ein e2e Test konfiguriert werden soll bietet sich cypress an (für später)
- TSLint war schon länger deprecated und wurde mit der letzten Version entfernt. 
  - Stattdessen bleibt "Prettier" unser Code Formatter (siehe auch README)
  - Neu konfiguriert ist "EsLint" als Linter


### Tools für Visual Studio Code sind konfiguriert, die Extensions bitte installieren
- Prettier - Code Formatter (esbenp.prettier-vscode) 
- Kontextsensitive Hilfe mit Angular Language Service (angular.ng-template)
  - WICHTIG! Die Version funktioniert jetzt richtig, weil wir jetzt mit Ivy arbeiten. 
  - -> Falls ihr in den Einstellungen (Extensions/Angular Language Service) die View-engine angeschaltet habt, dann alles wieder auf die Default-Werte setzen. An dem blauen Balken an der Seite erkennt man, dass Werte geändert wurden. Das wäre unter der Option User(alle Projekte), Workspace (nur für dieses Projekt) oder Folder (bei mehreren Projekten im Workspce) möglich.
- ESLint: (dbaeumer.vscode-eslint)

## KNOWN ISSUES 
Ein paar Sachen sind schon aufgefallen:    

- Da scheinen irgendwo noch Angaben für die Übersetzung (i18) im Quellcode zu sein.
- RXJS7 -> Deprecated functions (->todo)
