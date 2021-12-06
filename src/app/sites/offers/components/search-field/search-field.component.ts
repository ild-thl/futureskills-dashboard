import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
})
export class SearchFieldComponent implements OnChanges {
  constructor(tooltipConfig: NgbTooltipConfig) {
    tooltipConfig.placement = 'top';
    tooltipConfig.openDelay = 500;
    tooltipConfig.tooltipClass = 'tooltip';
  }

  @Input('text') searchText: string = '';
  @Input() disabled: boolean = false;
  @Output('textChange') searchTextChanged = new EventEmitter<string>();
  @Output('clicked') clicked = new EventEmitter<string>();
  fieldText: string = '';

  onClickEvent(value: any) {
    this.clicked.emit(value.searchField);
  }

  onFieldTextChanged(event: any) {
    //console.log('onModelChange: ', event);
    this.fieldText = event;
    this.searchTextChanged.emit(event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchText) {
      //console.log('ngOnChanges', changes);
      this.fieldText = this.searchText;
    }
  }
}
