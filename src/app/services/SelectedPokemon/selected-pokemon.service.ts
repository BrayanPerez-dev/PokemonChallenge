import { Injectable } from '@angular/core';
import { IPokemon } from '../../interfaces/IPokemon';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedPokemonService {
  private localStorageKey = 'selectedPokemons';
  private selectedPokemonsSubject = new BehaviorSubject<IPokemon[]>(this.loadFromLocalStorage());
  private hasThreePokemonsSubject = new BehaviorSubject<boolean>(false);
  
  selectedPokemons$ = this.selectedPokemonsSubject.asObservable();
  hasThreePokemons$ = this.hasThreePokemonsSubject.asObservable();
  isEditing$ = new BehaviorSubject<boolean>(false)

  constructor() {
    this.initializeFromLocalStorage();
  }
  
  startEdit() {
    this.isEditing$.next(true);
  }

  finishEdit() {
    this.isEditing$.next(false);
  }

  initializeFromLocalStorage(): void {
    const pokemon = this.loadFromLocalStorage();
    this.selectedPokemonsSubject.next(pokemon);
    this.hasThreePokemonsSubject.next(pokemon.length === 3);
  }

  togglePokemon(pokemon: IPokemon): void {
    const current = this.selectedPokemonsSubject.getValue();
    const index = current.findIndex(p => p.name === pokemon.name);

    let updated: IPokemon[];

    if (index > -1) {
      // Deselect
      updated = [...current.slice(0, index), ...current.slice(index + 1)];
    } else if (current.length < 3) {
      // Select
      updated = [...current, pokemon];
    } else {
      return; // Do not select more than 3
    }

    this.selectedPokemonsSubject.next(updated);
  }

  saveToLocalStorage(): Observable<string> {
    const current = this.selectedPokemonsSubject.getValue();
    localStorage.setItem(this.localStorageKey, JSON.stringify(current));
    this.initializeFromLocalStorage()
    return of('Pokemon saved successfully').pipe(delay(500));
  }

  clear(): void {
    localStorage.removeItem(this.localStorageKey);
    this.selectedPokemonsSubject.next([]);
  }

  private loadFromLocalStorage(): IPokemon[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  isSelected(pokemon: IPokemon): boolean {
    return this.selectedPokemonsSubject.getValue().some(p => p.name === pokemon.name);
  }
  
}
