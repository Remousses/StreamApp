import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMangasComponent } from './search-mangas.component';

describe('SearchMangasComponent', () => {
  let component: SearchMangasComponent;
  let fixture: ComponentFixture<SearchMangasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMangasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMangasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
