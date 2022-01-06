# Update auf Angular 13

## Voraussetzungen

- node.js in Version 16 (nicht die neue 17!)
- npm mind. in Version 8.1
- Angular-CLI (falls ihr die auch global installiert habt): @angular/cli@13.1.1

## Sonstige wichtige (Major) Package Änderungen
- RXJS: von 6 auf 7 (Einige Funktionen sind deprecated und werden in 8 entfernt -> todo)
- ng-bootstrap von 9 auf 11 
- cookie-service von 11 auf 13
- ngx-owl-carousel-o von 5 auf 7

- kein Support mehr für IE
- Typescript Version 4.4

## Allgemeine Änderungen Angular
- die Rendering Engine wurde jetzt komplett auf Ivy umgestellt, also keine View Engine mehr
  - die einzige Komponente, die noch mit der View Engine kompiliert wurde ist der kolkovEditor, aber es soll bald eine neue Version geben.
- Das Package-Format ist jetzt APF (Angular Package Format), also modernere Module (ES Modules und ES2020), die kompilierten Dateien sind kleiner (knapp 1MB)
- Angular erstellt jetzt einen Cache (.angular/cache). Soll bis zu 68% schneller kompilieren. Ab und zu wenn etwas merkwürdig erscheint, kann man den Ordner einfach mal löschen.
- RXJS ist jetzt auf Version 7.4. Damit scheinen einige Funktionen DEPRECATED zu sein. Das muss noch angepasst werden.
- Unter .vscode konnten schon immer Einstellungen für das Projekt gespeichert werden, die waren aber nicht in Github eingecheckt. Neu sind die Vorschläge für die erforderlichen Plugins im Ordner. Diese sind jetzt auch eingecheckt.
- STRICT Mode in tsconfig.json: Der soll nach und nach angeschaltet werden (->todo, Anpassungen im Code)

### Tests und Linting
- Da Protractor ab 2023 nicht mehr unterstützt wird, gibt es keine Konfiguration mehr für die e2e Testumgebung. 
  - Karma wird weiterhin unterstützt und ist konfiguriert, Jest ist erstmal nicht konfiguriert.
  - Falls ein e2e Test konfiguriert werden soll bietet sich cypress an (für später)
- TSLint war schon länger deprecated und wurde mit der letzten Version entfernt. 
  - Stattdessen bleibt "Prettier" unser Code Formatter (siehe auch README)
  - Neu konfiguriert ist "EsLint" als Linter

## KNOWN ISSUES 
Ein paar Sachen sind schon aufgefallen:    

- Erste Seite: Buttons 
- Zurück Button in Detailfenster ohne Mousezeiger
- /deep/ ist deprecated , ::ng-deep scheint ok zu sein?