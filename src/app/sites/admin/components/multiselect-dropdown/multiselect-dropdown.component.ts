import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { StaticService } from 'src/app/config/static.service';

export type KeyWordItem = {
  key: string;
  item: string;
};

@Component({
  selector: 'fs-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.scss'],
})
export class MultiselectDropdownComponent implements OnInit, OnChanges {
  @Output() selectedKeyWordListChange = new EventEmitter<string>();
  @Input() selectedKeyWordList: string;

  // KeyWords
  keywordsDropdownList: KeyWordItem[] = [];
  selectedKeyWords: KeyWordItem[] = [];
  keywordsDropdownSettings: IDropdownSettings = {};

  constructor(private staticConfig: StaticService) {}

  ngOnInit(): void {
    this.setKeyWordList();
  }

  //////////////////////////////////////////////
  // KeyWords
  //////////////////////////////////////////////

  setKeyWordList() {
    this.keywordsDropdownList = this.staticConfig.getKeyWords().keywords;
    this.keywordsDropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      idField: 'key',
      textField: 'item',
      searchPlaceholderText: 'Suche',
      itemsShowLimit: 3,
      allowSearchFilter: false,
      noDataAvailablePlaceholderText: 'Keine Keywords zur Auswahl',
    };
    // this.selectedKeyWords.push(    {
    //   key: "fs_superkikurs",
    //   item: "Super KI-Kurs"
    // },);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Changes', changes);
    console.log('Keywords:', this.selectedKeyWordList);
    console.log('Dropdown:', this.keywordsDropdownList);
    if (this.selectedKeyWordList !== undefined) {
      const currentValue = this.selectedKeyWordList;
      const list = currentValue.split(',').map((item) => {
        const str = item.trim().toLowerCase();
        return str;
      });
      let tempArray = [];
      this.keywordsDropdownList.forEach(item=>{
        if(list.includes(item.key)){
          console.log("Gefundenes Item:", item);
          tempArray.push(item);
        }
      })

      // Bug
      this.selectedKeyWords = tempArray;

      console.log('List:', list);
      console.log('SelectedItems:', this.selectedKeyWords);
    } else {
      if (this.selectedKeyWordList === null) {
        console.log('NULL');
      }
    }
  }

  onKeywordItemSelect(item: any) {
    console.log('ItemSelect', item);
    console.log('Selected:', this.selectedKeyWords);
  }
  onKeywordSelectAll(items: any) {
    console.log(items);
  }
}
