import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StaticService } from 'src/app/config/static.service';

export type KeyWordItem = {
  key: string;
  item: string;
};

@Component({
  selector: 'fs-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: MultiselectComponent }],
})
export class MultiselectComponent implements OnInit, ControlValueAccessor {
  @Input() availableKeyWordList: KeyWordItem[];

  // Selected KeyWords aus Form (DB)
  selectedKommaKeyWords: string | null;
  // Selected KeyWords als Array
  selectedKommaKeyWordsArr: string[];

  // Angezeigte Liste im Feld
  selectedKeyWordList: KeyWordItem[] = [];

  // Available KeyWords
  availableKeyWordStringKeys: string[];

  deletedError: boolean = false;

  constructor(private staticConfig: StaticService) {}

  listIsAvailable: boolean = false;
  savedListIsAvailable: boolean = false;

  initialized: boolean = false;
  isCollapsed = true;
  isDisabled: boolean = false;
  touched: boolean = false;

  ngOnInit(): void {
    this.getAvailableKeyWordList();
    this.checkLists();
  }

  // ControlValueAccessor Interface
  writeValue(obj: string): void {
    // Komma-getrennte Liste
    this.selectedKommaKeyWords = obj;
    // Liste als Array
    this.selectedKommaKeyWordsArr = this.getKeyWordListArray(this.selectedKommaKeyWords);
    this.savedListIsAvailable = true;
    //console.log('Komma-Liste aus der DB: ', this.selectedKommaKeyWords);
    //console.log('KeyList aus der DB: ', this.selectedKommaKeyWordsArr);
    this.checkLists();
  }

  private checkLists() {
    if (this.listIsAvailable) {
      if (this.selectedKommaKeyWords != null) {
        this.checkDeleted();
        this.setChipTagsInComponent();
        //console.log('Komma-Liste aus der DB: ', this.selectedKommaKeyWords);
      }
    }
  }

  checkDeleted() {
    const deletedArrayKeys = this.selectedKommaKeyWordsArr
      .filter((item) => {
        return !this.availableKeyWordStringKeys.includes(item);
      })
      .map((delKey) => {
        return { key: delKey, item: delKey };
      });
    this.deletedError = deletedArrayKeys.length > 0;
    //console.log('Deleted Items: ', deletedArrayKeys);
  }

  setChipTagsInComponent() {
    this.availableKeyWordList.forEach((item) => {
      if (this.selectedKommaKeyWordsArr.includes(item.key)) {
        this.selectedKeyWordList.push(item);
      }
    });
    //console.log('SelectedKeywordsinField: ', this.selectedKeyWordList);
  }

  onCheckBoxChanged(keywordItem: KeyWordItem) {
    const status = this.checkBoxIsSelected(keywordItem);
    // console.log('Status:', status);

    if (status) {
      this.remove(keywordItem);
    } else {
      this.add(keywordItem);
    }
    this.changeValues();
    //console.log("New ArrayList: ", this.selectedKeyWordList);
    //console.log("New StringList: ", this.selectedKommaKeyWords);
  }

  checkBoxIsSelected(item: KeyWordItem): boolean {
    return this.selectedKeyWordList.includes(item);
  }

  // onChange Function
  onChange = (keyWordList) => {};

  // onTouch Function
  onTouched = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  //
  markedAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  private changeValues() {
    this.selectedKommaKeyWords = this.getKeyWordList(this.selectedKeyWordList);
    this.deletedError=false;
    this.onChange(this.selectedKommaKeyWords);
  }

  private add(item: KeyWordItem) {
    this.markedAsTouched();
    if (!this.isDisabled) {
      this.selectedKeyWordList.push(item);
    }
  }

  private remove(item: KeyWordItem) {
    this.markedAsTouched();
    if (!this.isDisabled) {
      this.selectedKeyWordList = this.selectedKeyWordList.filter(
        (deleteItem) => item.key !== deleteItem.key
      );
    }
  }

  private getAvailableKeyWordList() {
    const tempList = this.staticConfig.getKeyWords().keywords;
    this.availableKeyWordList = tempList === undefined ? [] : tempList;
    this.availableKeyWordStringKeys = this.getKeysInList();
    //console.log('AvailableKeyWords: ', this.availableKeyWordList);
    this.listIsAvailable = true;
  }

  /**
   * Aus der Stringliste, die Key-Array Liste bilden
   * @param str
   */
  private getKeyWordListArray(str: string | null): string[] {
    if (str) {
      return str.split(',').map((item) => {
        const str = item.trim().toLowerCase();
        return str;
      });
    } else {
      return [];
    }
  }

  /**
   *
   * @param items Aus dem Key-Array wieder eine Stringliste machen
   */
  private getKeyWordList(items: KeyWordItem[]): string {
    if (items.length == 0) return null;
    return items
      .map((item) => {
        return item.key;
      })
      .join(',');
  }

  /**
   * Gibt nur die Keys in der ArrayListe zurück
   */
  private getKeysInList(): string[] {
    return this.availableKeyWordList.map((items: KeyWordItem) => {
      return items.key;
    });
  }
}
