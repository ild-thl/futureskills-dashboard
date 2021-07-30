export namespace KIToolsTypes {
  export type Alert = {
    type: string;
    message: string;
  };
  export type ScriptLoadingStatus = {
    isLoaded: boolean, 
    isError: boolean
  }
}

export interface IShowAlerts {
  alerts: KIToolsTypes.Alert[];
  addAlert(type: string, message: string): void;
  closeAlert(alert: KIToolsTypes.Alert): void;
  closeaAllAlerts(): void;
}
