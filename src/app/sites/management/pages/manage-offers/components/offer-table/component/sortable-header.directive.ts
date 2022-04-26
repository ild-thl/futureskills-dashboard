/* eslint-disable @angular-eslint/no-host-metadata-property */
import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SmallOfferDetailData } from 'src/app/core/models/offer';

// Mögliche Felder zum Sortieren (number/string Felder)
export type SortableKeysInHeader = SmallOfferDetailData & {
  sortflag: number;
};

export type SortColumn = keyof SortableKeysInHeader | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class SortableHeaderDirective implements OnInit {
  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // console.log('Sortable Header', this.sortable);
  }

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}
