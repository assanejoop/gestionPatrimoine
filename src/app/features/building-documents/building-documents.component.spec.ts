import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingDocumentsComponent } from './building-documents.component';

describe('BuildingDocumentsComponent', () => {
  let component: BuildingDocumentsComponent;
  let fixture: ComponentFixture<BuildingDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
