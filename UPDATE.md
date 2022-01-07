# Update auf Angular 13

Am besten, man checkt die neue Version in einen neuen Ordner aus. So kann man an beiden Versionen parallel arbeiten.
Der node_modules-Ordner enthält zu viele Änderungen und die .gitignore ist ebenfalls anders konfiguriert (Änderungen in der Ordnerstruktur)

## Globale Voraussetzungen
Bitte updaten:

- node.js in Version 16 (nicht die neue 17!)
- npm mind. in Version 8.1
- Angular-CLI (falls ihr die auch global installiert habt): @angular/cli@13.1.1

## Änderungen in Angular

### Major Package Änderungen
- RXJS: von 6 auf 7 (Einige Funktionen sind deprecated und werden in 8 entfernt -> todo)
- ng-bootstrap von 9 auf 11 
- cookie-service von 11 auf 13
- ngx-owl-carousel-o von 5 auf 7

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
Schon in Typescript 4.3 gab es viele Änderungen. Es wird Zeit auch einige zu nutzen
- STRICT Mode in tsconfig.json: Der soll nach und nach angeschaltet werden, d.h alle Variablen müssen initialisiert werden und dürfen kein any type als default haben
- Override (Funktionen, die überschrieben werden müssen explizit mit override gekennzeichnet werden. Ist im Momment nur im KI-Playground und in der Konfiguration für hammer.js relevant)


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
- RXJS7 -> Ddeprecated functions (->todo)
