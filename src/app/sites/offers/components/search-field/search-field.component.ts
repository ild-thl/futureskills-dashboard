import { NgForm } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
})
export class SearchFieldComponent implements OnChanges {
  constructor() {}

  @Input() disabled: boolean = false;
  @Input() defaultText: string = '';
  @Output() clicked = new EventEmitter<string>();
  @ViewChild('searchForm', { static: true }) searchForm: NgForm;
  searchString: string = '';

  onClickEvent(value: any) {
    this.clicked.emit(value.searchField);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.defaultText) {
      if (!changes.defaultText.previousValue) {
        console.log('Changes in String', changes.defaultText.currentValue);
        this.searchString = changes.defaultText.currentValue;
      }
    }
  }
}
