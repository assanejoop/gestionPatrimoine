import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingLocationComponent } from './building-location.component';

describe('BuildingLocationComponent', () => {
  let component: BuildingLocationComponent;
  let fixture: ComponentFixture<BuildingLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
