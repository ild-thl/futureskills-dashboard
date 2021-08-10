export namespace KIToolsTypes {
  export type Alert = {
    type: string;
    message: string;
  };
  export type ScriptLoadingStatus = {
    isLoaded: boolean;
    isError: boolean;
  };

  export type LinkCardData = {
    title: string;
    subtitle?: string;
    text: string;
    url: string;
    urlText: string;
    type: LinkCardType;
  };
  
  export enum LinkCardType {
    default = 'cardDefault',
    text = 'cardText',
    project = 'cardProject',
  }
}

export interface IShowAlerts {
  alerts: KIToolsTypes.Alert[];
  addAlert(type: string, message: string): void;
  closeAlert(alert: KIToolsTypes.Alert): void;
  closeaAllAlerts(): void;
}


