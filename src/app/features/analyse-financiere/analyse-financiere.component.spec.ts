import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseFinanciereComponent } from './analyse-financiere.component';

describe('AnalyseFinanciereComponent', () => {
  let component: AnalyseFinanciereComponent;
  let fixture: ComponentFixture<AnalyseFinanciereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyseFinanciereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyseFinanciereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
