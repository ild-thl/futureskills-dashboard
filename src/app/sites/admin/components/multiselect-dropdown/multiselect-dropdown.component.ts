import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { StaticService } from 'src/app/config/static.service';

@Component({
  selector: 'fs-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.scss']
})
export class MultiselectDropdownComponent implements OnInit {

    // KeyWords
    keywordsDropdownList = [];
    selectedKeyWords = [];
    keywordsDropdownSettings: IDropdownSettings = {};

  constructor(private staticConfig: StaticService) { }

  ngOnInit(): void {
    this.setKeyWordList();
  }


    //////////////////////////////////////////////
  // KeyWords
  //////////////////////////////////////////////

  setKeyWordList() {
    this.keywordsDropdownList=this.staticConfig.getKeyWords().keywords;
    this.selectedKeyWords = [
      {key : "fs_superkikurs", item: "Super KI-Kurs"}
    ];
    this.keywordsDropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      idField: 'key',
      textField: 'item',
      searchPlaceholderText: 'Suche',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Keine Keywords zur Auswahl'
    };
  }

  onKeywordItemSelect(item: any) {
    console.log(item);
  }
  onKeywordSelectAll(items: any) {
    console.log(items);
  }
}
