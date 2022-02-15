import { Component } from '@angular/core';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'app-info-teaching',
  templateUrl: './info-teaching.component.html',
  styleUrls: ['./info-teaching.component.scss']
})
export class InfoTeachingComponent {

  headlineText = "Skills, die Ihre Studierenden für die Zukunft brauchen.";
  hrefStringText = "https://toolbox.eduloop.de/";

  image1 = "assets/images/info-teaching-1.png";
  header1 = "Medien & Kommunikation und Social Media & Tools";
  text1 = "Im Modul „Kooperationssysteme und Social Media“ (Pflicht- bzw. Wahlpflichtmodul in den Studiengängen Informationstechnologie und Design bzw. Informatik/Softwaretechnik der TH Lübeck) erbringen die Studierenden eine Teilleistung durch die Belegung der Online-Kurse „Medien & Kommunikation“ sowie „Social Media & Tools“. Die Belegung kann durch ein automatisch generiertes Zertifikat nachgewiesen werden.";

  image2 = "assets/images/info-teaching-2.png";
  header2 = "FutureSkills KI";
  text2 = "Das Modul „<a [routerLink]='lnkKICoursePackage'>FutureSkills KI</a>“ setzt sich aus verschiedenen Online-Kursen zusammen und wird an der CAU Kiel als Wahlmodul (5 ECTS) anerkannt.";

  image3 = "assets/images/info-teaching-ki.png";
  header3 = "Künstliche Intelligenz";
  text3 = "Prof. Mustermann sucht für seine Vorlesung zum Thema Versicherungsrecht eine grundlegende Einführung zum Thema „Künstliche Intelligenz“, um darauf aufbauend mit seinen Studierenden zu erörtern, welche Rolle KI-basierte Systeme z.B. bei der Schadensbewertung spielen könnten. Er findet eine Vorlesungsaufzeichnung „Grundlagen von KI-Systemen“ der Kollegin Prof. Musterfrau der CAU und stellt diese seinen Studierenden im Rahmen einer Vorlesungssitzung zur Verfügung.";

  image4 = "assets/images/info-teaching-videos.png";
  header4 = "Videos bereitstellen";
  text4 = "Prof. Meier hat zusammen mit einem Laboringenieur für ihre Praktika grundlegende Versuchsaufbauten gefilmt und den Studierenden zur Nachbereitung zur Verfügung gestellt. Da andere Lehrende häufig danach  fragten, stellt sie ihre Videos nun stets über die FutureSkills-Plattform zur freien Nutzung zur Verfügung.";

  image5 = "assets/images/FSToolbox-Kachel.jpg";
  header5 = "Praktische Hilfestellungen für Lehrende";
  text5 = "Die Toolbox stellt Lehrenden verschiedene Informationen und Tipps zur Konzeption und Umsetzung digitaler Lehr-/Lernangebote bereit. Sie beinhaltet eine Übersicht verschiedener digitaler Tools, geordnet nach den Anwendungsszenarien, für die sie eingesetzt werden können, mit einer Darstellung der Potentiale und Nachteile. Darüber hinaus beinhaltet die Toolbox Informationen und Hilfestellungen zu Fragen des Urheberrechts, zum Auffinden von frei verwendbaren Lernmaterialien sowie eine Übersicht zur Verwendung freier Lizenzen.";

  constructor(private staticConfig: StaticService) { }

  lnkKICoursePackage = this.staticConfig.getPathInfo().lnkOffers + this.staticConfig.getCourseNumbers().FS_SuperKI;

}
