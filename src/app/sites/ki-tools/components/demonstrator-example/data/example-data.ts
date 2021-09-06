import { KIToolsTypes } from '../../../interfaces/types';

// Daten für die Ki-Anwendungsliste
/**
 * @deprecated
 */
export class DemonstratorExamples {
  public static exampleText: KIToolsTypes.LinkCardData[] = [
    {
      title: 'DeepL',
      subtitle: 'Übersetzung',
      text: 'Übersetzung von Texten in viele Sprachen.',
      url: 'https://www.deepl.com/de/translator',
      urlText: 'deepl.com/de/translator',
      style: KIToolsTypes.LinkCardStyle.text,
    },
    {
      title: 'Image-to-Image',
      subtitle: 'Demo Pix2Pix Tensorflow',
      text: 'Verwandelt Zeichnungen in Bilder.',
      url: 'https://affinelayer.com/pixsrv/',
      urlText: 'affinelayer.com/pixsrv',
      style: KIToolsTypes.LinkCardStyle.images,
    },
    {
      title: 'Inferkit',
      subtitle: 'Demo Textgenerierung (gpt-2)',
      text: 'Ergänzt vorgegebene Texte.',
      url: 'https://app.inferkit.com/demo',
      urlText: 'app.inferkit.com/demo',
      style: KIToolsTypes.LinkCardStyle.text,
    },
    {
      title: 'SketchToCode',
      subtitle: 'Demo Handschrift zu Code',
      text: 'Handschriftliche Designs werden in HTML-Code umgewandelt',
      url: 'https://sketch2code.azurewebsites.net',
      urlText: 'sketch2code.azurewebsites.net',
      style: KIToolsTypes.LinkCardStyle.images,
    },
    {
      title: 'DeepArt',
      subtitle: 'Bildverfremdung',
      text: 'Fotos erhalten in den Stil eines Kunstwerks.',
      url: 'https://deepart.io',
      urlText: 'deepart.io',
      style: KIToolsTypes.LinkCardStyle.images,
    },
    {
      title: 'ThisWordDoesNotExist',
      subtitle: 'Textgenerierung gpt-2',
      text: 'Kreation neuer Wörter.',
      url: 'https://www.thisworddoesnotexist.com',
      urlText: 'thisworddoesnotexist.com',
      style: KIToolsTypes.LinkCardStyle.text,
    },
    {
      title: 'Quillbot',
      subtitle: 'Paraphrasierungstool',
      text:
        'Quillbot formuliert Textabsätze neu, prüft die Grammatik und schreibt Zusammenfassungen.',
      url: 'https://quillbot.com',
      urlText: 'quillbot.com',
      style: KIToolsTypes.LinkCardStyle.text,
    },
    {
      title: 'WhichFaceIsReal',
      subtitle: 'Demo StyleGAN',
      text: 'Beispiel wie mithilfe des StyleGan Algorithmus Gesichter generiert werden können.',
      url: 'https://www.whichfaceisreal.com',
      urlText: 'whichfaceisreal.com',
      style: KIToolsTypes.LinkCardStyle.images,
    },
    {
      title: 'Replika',
      subtitle: 'Bot',
      text: 'Hier kann ein persönlicher Chat-Bot (App) erstellt werden.',
      url: 'https://replika.ai',
      urlText: 'replika.ai',
      style: KIToolsTypes.LinkCardStyle.default,
    },
    {
      title: 'Quizlet',
      subtitle: 'Personalisiertes Lernen',
      text: 'Quizlet bringt Lerninhalte per Karteikarten näher.',
      url: 'https://quizlet.com/de',
      urlText: 'quizlet.com/de',
      style: KIToolsTypes.LinkCardStyle.default,
    },
    {
      title: 'Copy.ai',
      subtitle: 'Textgenerierung (gpt-3)',
      text: 'Texte speziell für Landing-Pages, Social Media-Posts, Blogs, Werbung.',
      url: 'https://copy.ai',
      urlText: 'copy.ai',
      style: KIToolsTypes.LinkCardStyle.text,
      type: KIToolsTypes.LinkCardType.commercial,
    },
    {
      title: 'AI Dungeon',
      text: 'AI Dungeon erstellt ein text-basiertes RPG.',
      url: 'https://play.aidungeon.io/',
      urlText: 'play.aidungeon.io',
      style: KIToolsTypes.LinkCardStyle.text,
    },
    {
      title: 'Text Synth',
      subtitle: 'Demo Textgenerierung (gpt-2)',
      text: 'Ergänzt vorgegebene Texte.',
      url: 'https://bellard.org/textsynth/',
      urlText: 'bellard.org/textsynth',
      style: KIToolsTypes.LinkCardStyle.text,
    },
    {
      title: 'AutoDraw',
      subtitle: 'Zeichen-Tool',
      text: 'Interpretation handschriftlicher Zeichnungen. Teil der AI Experiments von Google.',
      url: 'https://www.autodraw.com',
      urlText: 'autodraw.com',
      style: KIToolsTypes.LinkCardStyle.images,
    },
    {
      title: 'GitHub Pilot',
      subtitle: 'Softwareprogrammierung',
      text: 'OpenAI Projekt zur Generierung von Quellcode (Codex)',
      url: 'https://copilot.github.com/',
      urlText: 'copilot.github.com',
      style: KIToolsTypes.LinkCardStyle.text,
    },
  ];

  public static projectText: KIToolsTypes.LinkCardData[] = [
    {
      title: 'DeepAI',
      text: 'News, Leifäden und Forschungsergebnisse zum Thema KI',
      url: 'https://deepai.org',
      urlText: 'deepai.org',
      style: KIToolsTypes.LinkCardStyle.project,
    },
    {
      title: 'OpenAI',
      text:
        'Beschäftigt sich mit der Forschung und Entwicklung von KI. Wichtige Projekte: gpt-2, gpt-3, Codex',
      url: 'https://www.openai.com',
      urlText: 'openai.com',
      style: KIToolsTypes.LinkCardStyle.project,
    },
    {
      title: 'AI-Experiments with Google',
      text: 'Beispiele und Sammlungen des Google Creative Labs',
      url: 'https://experiments.withgoogle.com/collection/ai',
      urlText: 'experiments.withgoogle.com',
      style: KIToolsTypes.LinkCardStyle.project,
    },
    {
      title: 'Hugging Face',
      text: 'AI-Community mit vielen Projekten',
      url: 'https://huggingface.co',
      urlText: 'huggingface.co',
      style: KIToolsTypes.LinkCardStyle.project,
    },
    {
      title: 'Kaggle',
      text: 'Beispiele, Daten und Quellcode',
      url: 'https://www.kaggle.com/',
      urlText: 'kaggle.com',
      style: KIToolsTypes.LinkCardStyle.project,
    },
  ];
}
