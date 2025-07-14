import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTaravauxComponent } from './detail-taravaux.component';

describe('DetailTaravauxComponent', () => {
  let component: DetailTaravauxComponent;
  let fixture: ComponentFixture<DetailTaravauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTaravauxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailTaravauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
