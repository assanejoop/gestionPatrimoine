import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravauxMaintenanceComponent } from './travaux-maintenance.component';

describe('TravauxMaintenanceComponent', () => {
  let component: TravauxMaintenanceComponent;
  let fixture: ComponentFixture<TravauxMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravauxMaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravauxMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
