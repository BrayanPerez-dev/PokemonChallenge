import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoadingService } from '../../services/Loading/loading.service';
import { MatIconModule } from '@angular/material/icon';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-pokemon-list',
  imports: [FormsModule, CommonModule, MatIconModule, AsyncPipe, ScrollingModule, CommonModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
  standalone: true,
})
export class PokemonListComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  private selectedPokemonService = inject(SelectedPokemonService)
  private loadingService = inject(LoadingService);


  pokemonList: IPokemon[] = [];
  private pageSize = 9;
  private page = 0;
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  searchTerm: string = '';
  errorMessage: string = '';
  selectedPokemon$ = this.selectedPokemonService.selectedPokemons$;

  private searchSubject$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadDefaultPokemons();
    // Subscription with con debounce
    this.startDebounce();

  }

  togglePokemon(pokemon: IPokemon): void {
    this.selectedPokemonService.togglePokemon(pokemon);
  }

  isSelected(pokemon: IPokemon): boolean {
    return this.selectedPokemonService.isSelected(pokemon);
  }


  savePokemon(): void {
    this.loadingService.show();
    this.selectedPokemonService.saveToLocalStorage().subscribe({
      complete: () => {
        this.selectedPokemonService.finishEdit()
        this.loadingService.hide();
      }
    });
  }

  startDebounce() {
    this.searchSubject$
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
  trackByName(index: number, pokemon: IPokemon) {
  return pokemon.name;
}
  onScroll() {
    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    if (end === total && total > 0) {
      this.loadDefaultPokemons();
    }
  }
  loadDefaultPokemons() {
    this.pokemonService.getPokemonList(this.page * this.pageSize, this.pageSize).subscribe({
      next: (data: IPokemonList) => {
        const pokemons = data.results;
        const requests = pokemons.map((p) =>
          this.pokemonService.getPokemonDetails(p.url)
        );

        forkJoin(requests).subscribe((details: IPokemon[]) => {
          this.pokemonList = [...this.pokemonList, ...details];
          this.page++;
        });
        this.errorMessage = '';
      },
    });
  }

  onSearchChange(value: string) {
    this.searchSubject$.next(value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
