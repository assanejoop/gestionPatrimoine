import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsArchivageComponent } from './documents-archivage.component';

describe('DocumentsArchivageComponent', () => {
  let component: DocumentsArchivageComponent;
  let fixture: ComponentFixture<DocumentsArchivageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsArchivageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsArchivageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
