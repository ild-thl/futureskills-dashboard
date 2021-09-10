import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class MultiselectComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() availableKeyWordList: {
    key: string;
    item: string;
  }[];

  // Selected KeyWords
  selectedKommaKeyWords: string | null;
  selectedKeyWordList: KeyWordItem[] = [];

  constructor() {}

  initialized: boolean = false;
  isCollapsed = true;
  isDisabled: boolean = false;
  touched: boolean = false;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    // console.log('AvailableList: ', this.availableKeyWordList);
    this.initializeLists();
  }

  // onChange Function
  onChange = (keyWordList) => {};

  // onTouch Function
  onTouched = () => {};

  // ControlValueAccessor Interface
  writeValue(obj: string): void {
    this.selectedKommaKeyWords = obj;
    // console.log('Value: ', this.selectedKommaKeyWords);
    this.initializeLists();
  }
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

  onCheckBoxChanged(keywordItem: KeyWordItem) {
    const status = this.checkBoxIsSelected(keywordItem);

    if (status) {
      this.remove(keywordItem);
    } else {
      this.add(keywordItem);
    }
    this.selectedKommaKeyWords = this.getKeyWordList(this.selectedKeyWordList);
    this.onChange(this.selectedKommaKeyWords);

    //console.log("New ArrayList: ", this.selectedKeyWordList);
    //console.log("New StringList: ", this.selectedKommaKeyWords);

  }

  checkBoxIsSelected(item: KeyWordItem): boolean {
    if (!this.initialized) return false;
    return this.selectedKeyWordList.includes(item);
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

  private initializeLists() {
    if (this.initialized) return;

    if (this.availableKeyWordList && this.selectedKommaKeyWords) {
      const list = this.getKeyWordListArray(this.selectedKommaKeyWords);
     // console.log('ValueArray: ', list);

      this.availableKeyWordList.forEach((item) => {
        if (list.includes(item.key)) {
          this.selectedKeyWordList.push(item);
        }
      });
      this.initialized = true;
     // console.log('SelectedKeywords: ', this.selectedKeyWordList);
    }
  }

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

  private getKeyWordList(items: KeyWordItem[]): string {
    if (items.length==0) return null;
    return items.map(item=>{
      return (item.key);
    }).join(',');
  }
}
