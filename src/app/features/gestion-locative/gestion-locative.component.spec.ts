import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLocativeComponent } from './gestion-locative.component';

describe('GestionLocativeComponent', () => {
  let component: GestionLocativeComponent;
  let fixture: ComponentFixture<GestionLocativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionLocativeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionLocativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
