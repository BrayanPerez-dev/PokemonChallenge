import { Component, inject, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { IPokemon, IPokemonList } from '../../interfaces/IPokemon';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SelectedPokemonService } from '../../services/SelectedPokemon/selected-pokemon.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/Loading/loading.service';

@Component({
  selector: 'app-pokemon-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
  standalone: true,
})
export class PokemonListComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  private selectedPokemonService = inject(SelectedPokemonService)
  private loadingService = inject(LoadingService);

  pokemonList: IPokemon[] = [];
  searchTerm: string = '';
  errorMessage: string = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadDefaultPokemons();
    // Subscription with con debounce
    this.startDebounce();
  }

  toggle(pokemon: IPokemon): void {
    this.selectedPokemonService.togglePokemonSelection(pokemon);
  }

  isSelected(pokemon: IPokemon): boolean {
    return this.selectedPokemonService.isSelected(pokemon);
  }

  isSaveDisabled(): boolean {
    return this.selectedPokemonService.isSaveDisabled();
  }

  continue(): void {
    if (this.isSaveDisabled()) return;

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    }, 1000);
  }

  startDebounce() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          const trimmed = query.trim().toLowerCase();
          if (trimmed === '') {
            this.loadDefaultPokemons();
            return of(null); // return null if it is void
          }
          return this.pokemonService.getPokemonByNameOrId(trimmed).pipe(
            catchError(() => {
              this.errorMessage = 'Pokémon no encontrado';
              return of(undefined); // returns observable that does not cut the stream
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (result) => {
          if (result === null) {
            this.loadDefaultPokemons();
            return;
          }

          if (result === undefined) {
            this.pokemonList = [];
            return;
          }
          this.pokemonList = [result];
          this.errorMessage = '';
        },
        error: () => {
          this.errorMessage = 'Pokémon no encontrado';
          this.pokemonList = [];
        },
      });
  }

  loadDefaultPokemons() {
    this.pokemonService.getPokemonList().subscribe({
      next: (data: IPokemonList) => {
        const pokemons = data.results;
        const requests = pokemons.map((p) =>
          this.pokemonService.getPokemonDetails(p.url)
        );
        forkJoin(requests).subscribe((details: IPokemon[]) => {
          this.pokemonList = details;
          console.log(details);
        });
        this.errorMessage = '';
      },
    });
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
