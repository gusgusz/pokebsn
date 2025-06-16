import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemonList(limit = 20, offset = 0): Observable<any[]> {
  return this.http.get<any>(`${this.apiUrl}?limit=${limit}&offset=${offset}`).pipe(
    switchMap((response) => {
      const requests: Observable<any>[] = response.results.map((poke: any) => this.http.get<any>(poke.url));
      return forkJoin(requests) as Observable<any[]>;
    })
  );
}

}

