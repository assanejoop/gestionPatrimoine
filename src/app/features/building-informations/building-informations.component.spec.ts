import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingInformationsComponent } from './building-informations.component';

describe('BuildingInformationsComponent', () => {
  let component: BuildingInformationsComponent;
  let fixture: ComponentFixture<BuildingInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingInformationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
