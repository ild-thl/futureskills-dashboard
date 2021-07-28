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
