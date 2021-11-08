// Offer Properties
export type PropertyItem = {
  id: number;
  identifier: string;
  description: string;
};

// Liste mit Typ
export class OfferPropertyList {
  constructor(
    public type: string,
    public list: PropertyItem[]
  ) {}
}

export type PropertyCompleteMap = Map<string, OfferPropertyList>;
export type PropertyIDMap = Map<string, PropertyIDMapItem>;
export type PropertyIDMapItem = Map<number, string>;
