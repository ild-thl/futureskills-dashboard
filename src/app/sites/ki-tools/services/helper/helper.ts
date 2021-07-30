import { IShowAlerts, KIToolsTypes } from "../../interfaces/types";

export class KIToolsHelper {
  public static checkLoadedScripts(scripts: any[]): boolean {
    let scriptOk = true;
    for (var script of scripts) {
      if (!script.loaded) {
        console.error(script);
        scriptOk = false;
        break;
      }
    }
    return scriptOk;
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
