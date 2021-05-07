import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoTeachingComponent } from './info-teaching.component';

describe('InfoTeachingComponent', () => {
  let component: InfoTeachingComponent;
  let fixture: ComponentFixture<InfoTeachingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoTeachingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTeachingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
