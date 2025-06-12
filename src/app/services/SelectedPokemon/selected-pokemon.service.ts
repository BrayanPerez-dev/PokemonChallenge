import { Injectable } from '@angular/core';
import { IPokemon } from '../../interfaces/IPokemon';

@Injectable({
  providedIn: 'root',
})
export class SelectedPokemonService {
  private localStorageKey = 'selectedPokemons';
  private selectedPokemons: IPokemon[] = [];

  togglePokemonSelection(pokemon: IPokemon): void {
    const selectedPokemons = this.getSavedPokemons();
    const index = selectedPokemons.findIndex(p => p.name === pokemon.name);

    if (index > -1) {
      // Deselect
      selectedPokemons.splice(index, 1);
    } else if (selectedPokemons.length < 3) {
      // Select
      selectedPokemons.push(pokemon);
    }

    this.saveToLocalStorage(selectedPokemons);
  }

  clear(): void {
    localStorage.removeItem(this.localStorageKey);
    this.selectedPokemons = [];
  }

  getSavedPokemons(): IPokemon[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  isSelected(pokemon: IPokemon): boolean {
    return this.getSavedPokemons().some(p => p.name === pokemon.name);
  }

  isSaveDisabled(): boolean {
    return this.getSavedPokemons().length !== 3;
  }

  private saveToLocalStorage(pokemons: IPokemon[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(pokemons));
  }
}
