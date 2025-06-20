import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';



   interface FavoriteFromAPI {
  id: number;
  user_id: number;
  name: string;
  poke_id: number;
}

 interface EnrichedFavorite {
  id: number;
  poke_id: number;
  name: string;
  image: string;
}

 interface FavoriteApiResponse {
  userId: number;
  favorites: FavoriteFromAPI[];
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {



  private favoritesSubject = new BehaviorSubject<any[]>([]); 
  favorites$ = this.favoritesSubject.asObservable(); 
  
  private apiUrl = `${environment.apiBaseUrl}api/favorites`;

  constructor(private http: HttpClient) {}

 
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  
addFavorite(pokemon: any) {
  const headers = this.getAuthHeaders();

  this.http.post<FavoriteFromAPI>(this.apiUrl, {
    name: pokemon.name,
    poke_id: pokemon.id
  }, { headers }).subscribe({
    next: (response) => {
      console.log('Favorito adicionado com sucesso:', response);
      
      const enriched: EnrichedFavorite = {
        id: response.id,
        poke_id: pokemon.id,
        name: pokemon.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${response.poke_id}.png`,
      };

      this.favoritesSubject.next([
        ...this.favoritesSubject.value,
        enriched
      ]);
    },
    error: (err) => {
      console.error('Erro ao adicionar favorito:', err);
      alert('Ocorreu um erro ao adicionar o favorito. Tente novamente!');
    }
  });
}

removeFavorite(favoriteId: number) {
  const headers = this.getAuthHeaders();

  this.http.delete(`${this.apiUrl}/${favoriteId}`, { headers }).subscribe({
    next: () => {
      this.loadFavorites();
      
    },
    error: (err) => {
      console.error('Erro ao remover favorito:', err);
      alert('Ocorreu um erro ao remover o favorito. Tente novamente!');
    },
  });
}



loadFavorites(): void {
  const headers = this.getAuthHeaders();

  this.http.get<any>(this.apiUrl, { headers }).subscribe({
    next: (favoritesResponse) => {
      

      const userFavorites = favoritesResponse.favorites;

       console.log('Favoritos carregados:1', userFavorites);

      if (!userFavorites || userFavorites.length === 0) {
        this.favoritesSubject.next([]);
        return;
      }
      console.log('Favoritos carregados:2', userFavorites);
      const requests = userFavorites.map((favorite: FavoriteFromAPI) => {
        const poke_id = favorite.poke_id;
        const url = `https://pokeapi.co/api/v2/pokemon/${poke_id}`;

        return this.http.get<any>(url).pipe(
          map((pokeData): EnrichedFavorite => ({
            name: pokeData.name,
            id: favorite.id,
            poke_id,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke_id}.png`,
          }))
        );
      });

      forkJoin<EnrichedFavorite[]>(requests).subscribe({
        next: (enrichedFavorites) => {
          console.log(enrichedFavorites, "enrichedfavorites")
          this.favoritesSubject.next(enrichedFavorites);
        },
        error: (err) => {
          console.error('Erro ao carregar dados dos Pokémons favoritos:', err);
          alert('Erro ao carregar informações dos Pokémons. Tente novamente!');
        }
      });
    },
    error: (err) => {
      console.error('Erro ao listar favoritos:', err);
      alert('Ocorreu um erro ao carregar seus favoritos. Tente novamente!');
    }
  });
}



}
