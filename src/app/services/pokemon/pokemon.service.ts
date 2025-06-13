import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPokemon, IPokemonList } from '../../interfaces/IPokemon';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrlPokemonList =
    'https://pokeapi.co/api/v2/pokemon';
  private http = inject(HttpClient);

  getPokemonList(page:number=0,pageSize:number=9): Observable<IPokemonList> {
    return this.http.get<IPokemonList>(`${this.apiUrlPokemonList}?limit=${pageSize}&offset=${page}`);
  }

  getPokemonDetails(url: string): Observable<IPokemon> {
    return this.http.get<IPokemon>(url);
  }
  
  getPokemonByNameOrId(query: string): Observable<IPokemon> {
    return this.http.get<IPokemon>(
      `https://pokeapi.co/api/v2/pokemon/${query}`
    );
  }
  
}
