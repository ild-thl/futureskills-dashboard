import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaticService } from 'src/app/config/static.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-landing',
  templateUrl: './manage-landing.component.html',
  styleUrls: ['./manage-landing.component.scss'],
})
export class ManageLandingComponent implements OnInit {
  lnkManageOffers = this.staticConfig.getPathInfo().lnkManageOfferList;
  lnkManageOfferNew = this.staticConfig.getPathInfo().lnkManageOfferNew;
  lnkManageOfferEdit = this.staticConfig.getPathInfo().lnkManageOfferEdit;
  lnkAdminOfferNew = this.staticConfig.getPathInfo().lnkAdminOfferNew;

  courseForm: FormGroup;

  constructor(
    private staticConfig: StaticService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      courseId: [null, Validators.pattern],
    });
  }

  onEditCourse(courseID: any) {
    const value = courseID.courseId;
    if (this.isNumber(value)) {
      this.router.navigate([this.lnkManageOfferEdit, value]);
    }
  }

  private isNumber(value: string | number): boolean {
    return value != null && value !== '' && !isNaN(Number(value.toString()));
  }
}
