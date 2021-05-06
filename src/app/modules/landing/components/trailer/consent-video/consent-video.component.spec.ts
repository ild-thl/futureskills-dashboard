import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentVideoComponent } from './consent-video.component';

describe('ConsentVideoComponent', () => {
  let component: ConsentVideoComponent;
  let fixture: ComponentFixture<ConsentVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
