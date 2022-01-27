import { IShowAlerts, KIToolsTypes } from "../../interfaces/types";

export class KIToolsHelper {
  public static checkLoadedScripts(scripts: any[]): boolean {
    let scriptOk = true;
    for (var script of scripts) {
      if (!script.loaded) {
        //console.error(script);
        scriptOk = false;
        break;
      }
    }
    return scriptOk;
  }

  public static shuffleArray<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }
}

export class AlertList implements IShowAlerts{
  private _alerts: KIToolsTypes.Alert[] = [];
  public get alerts(): KIToolsTypes.Alert[] {
    return this._alerts;
  }
  addAlert(type: string, message: string) {
    this._alerts.push({ type, message });
  }
  closeAlert(alert: KIToolsTypes.Alert) {
    this._alerts.splice(this.alerts.indexOf(alert), 1);
  }
  closeaAllAlerts() {
    this._alerts = [];
  }
}
