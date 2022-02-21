import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OfferDataService } from 'src/app/core/data/offer/offer-data.service';

@Component({
  selector: 'app-manage-offers',
  templateUrl: './manage-offers.component.html',
  styleUrls: ['./manage-offers.component.scss']
})
export class ManageOffersComponent implements OnInit {
  private offerListSub: Subscription;
  constructor(private offerDataService: OfferDataService) { }

  ngOnInit(): void {
    this.loadOfferList();
    
  }


  /**
   * LoadOfferList
   */
   loadOfferList() {
    this.offerListSub = this.offerDataService.getSmallOfferListForManagement().subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (error) => {
        console.log(error);
      }
    });
   }

}
