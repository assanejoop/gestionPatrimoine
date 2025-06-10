import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingMaintenanceComponent } from './building-maintenance.component';

describe('BuildingMaintenanceComponent', () => {
  let component: BuildingMaintenanceComponent;
  let fixture: ComponentFixture<BuildingMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingMaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
