import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSavedPokemonComponent } from './list-saved-pokemon.component';

describe('ListSavedPokemonComponent', () => {
  let component: ListSavedPokemonComponent;
  let fixture: ComponentFixture<ListSavedPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSavedPokemonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSavedPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
