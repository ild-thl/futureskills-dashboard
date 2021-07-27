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
