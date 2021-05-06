import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FsbuttonComponent } from './fsbutton.component';

describe('FsbuttonComponent', () => {
  let component: FsbuttonComponent;
  let fixture: ComponentFixture<FsbuttonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FsbuttonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FsbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
