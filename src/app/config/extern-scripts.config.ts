/**
 * Liste der externen Scripts, die nachgeladen werden können
 * Der Service app/src/core/services/scriptLoader übernimmt das Nachladen der Dateien
 */
 export interface IExternScripts {
  name: string;
  src: string;
}
export const ExternScripts: IExternScripts[] = [
  { name: 'tensorflow', src: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.8.0/dist/tf.min.js' },
  { name: 'ml5', src: 'https://unpkg.com/ml5@latest/dist/ml5.min.js'}
];
