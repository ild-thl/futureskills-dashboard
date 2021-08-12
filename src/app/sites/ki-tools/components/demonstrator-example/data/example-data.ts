import { KIToolsTypes } from '../../../interfaces/types';

// Daten für die Ki-Anwendungsliste
export class DemonstratorExamples {
  public static exampleText = [
    {
      title: 'DeepL',
      subtitle: 'Texte bearbeiten',
      text: 'Übersetzung von Texten in viele Sprachen.',
      url: 'https://www.deepl.com/de/translator',
      urlText: 'deepl.com/de/translator',
      type: KIToolsTypes.LinkCardType.text,
    },
    {
      title: 'Inferkit',
      subtitle: 'Textgenerierung',
      text: 'Inferkit ergänzt vorgegebene Texte.',
      url: 'https://app.inferkit.com/demo',
      urlText: 'app.inferkit.com/demo',
      type: KIToolsTypes.LinkCardType.text,
    },
    {
      title: 'Quillbot',
      subtitle: 'Paraphrasierungstool',
      text:
        'Quillbot formuliert Textabsätze neu, prüft die Grammatik und schreibt Zusammenfassungen.',
      url: 'https://quillbot.com',
      urlText: 'quillbot.com',
      type: KIToolsTypes.LinkCardType.text,
    },
    {
      title: 'Replika',
      subtitle: 'Bot',
      text: 'Hier kann ein persönlicher Chat-Bot (App) erstellt werden.',
      url: 'https://replika.ai',
      urlText: 'replika.ai',
      type: KIToolsTypes.LinkCardType.default,
    },
    {
      title: 'Quizlet',
      subtitle: 'Personalisiertes Lernen',
      text: 'Quizlet bringt Lerninhalte per Karteikarten näher.',
      url: 'https://quizlet.com/de',
      urlText: 'quizlet.com/de',
      type: KIToolsTypes.LinkCardType.default,
    },
    {
      title: 'Copy.ai',
      subtitle: 'Textgenerierung',
      text: 'Texte speziell für Landing-Pages, Social Media-Posts, Blogs, Werbung.',
      url: 'https://copy.ai',
      urlText: 'copy.ai',
      type: KIToolsTypes.LinkCardType.text,
      },
    {
      title: 'AI Dungeon',
      subtitle: 'Textgenerierung',
      text: 'AI Dungeon erstellt ein text-basiertes RPG.',
      url: 'https://play.aidungeon.io/',
      urlText: 'play.aidungeon.io',
      type: KIToolsTypes.LinkCardType.text,
    },
    {
      title: 'GitHub Pilot',
      subtitle: 'Softwareprogrammierung',
      text: 'OpenAI Projekt zur Generierung von Quellcode (beta)',
      url: 'https://copilot.github.com/',
      urlText: 'copilot.github.com',
      type: KIToolsTypes.LinkCardType.text,
      },
  ];

  public static projectText = [
    {
        title: 'DeepAI',
        subtitle: 'Recherche und News',
        text: 'News, Leifäden und Forschungsergebnisse zum Thema KI',
        url: 'https://deepai.org',
        urlText: 'deepai.org',
        type: KIToolsTypes.LinkCardType.project,
      },
      {
        title: 'OpenAI',
        subtitle: 'Forschung und Entwicklung',
        text: 'Beschreibung',
        url: 'https://www.openai.com',
        urlText: 'openai.com',
        type: KIToolsTypes.LinkCardType.project,
      },
  ]
}
