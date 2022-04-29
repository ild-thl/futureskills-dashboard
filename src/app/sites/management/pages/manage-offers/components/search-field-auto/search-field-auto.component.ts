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
  selector: 'app-search-field-auto',
  templateUrl: './search-field-auto.component.html',
  styleUrls: ['./search-field-auto.component.scss'],
})
export class SearchFieldAutoComponent implements OnChanges {
  constructor() {}

  @Input() disabled: boolean = false;
  @Input() defaultText: string = '';
  @Output() keyUpEvent = new EventEmitter<string>();
  @ViewChild('searchForm', { static: true }) searchForm: NgForm;
  searchString: string = '';

  onKeyUpEvent(event: any) {
    this.keyUpEvent.emit(event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.defaultText) {
      if (!changes.defaultText.previousValue) {
        //console.log('Changes in String', changes.defaultText.currentValue);
        this.searchString = changes.defaultText.currentValue;
      }
    }
  }
}
