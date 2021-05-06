export type FilterFunctionCallbackItem = {
    type: string,
    id: number
}

// Eintrag in der Filter-ComboBox
export type FilterItem = {
  id: number;
  identifier: string;
  description: string;
};

// Liste mit Typ
export class FilterList {
  constructor(
    public type: string,
    public list: FilterItem[]
  ) {}
}
