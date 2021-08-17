export namespace KIToolsTypes {
  export type Alert = {
    type: string;
    message: string;
  };

  export type ScriptLoadingStatus = {
    isLoaded: boolean;
    isError: boolean;
  };

  // Für die Farbgebung
  export enum LinkCardStyle {
    default = 'cardDefault',
    text = 'cardText',
    project = 'cardProject',
    images = 'cardImages'
  }

  export enum LinkCardType  {
    commercial = 'com',
    free_demo = 'free_demo',
  }

  export type LinkCardData = {
    title: string;
    subtitle?: string;
    text: string;
    url: string;
    urlText: string;
    style: LinkCardStyle;
    type?: LinkCardType;
  };
}

export interface IShowAlerts {
  alerts: KIToolsTypes.Alert[];
  addAlert(type: string, message: string): void;
  closeAlert(alert: KIToolsTypes.Alert): void;
  closeaAllAlerts(): void;
}


