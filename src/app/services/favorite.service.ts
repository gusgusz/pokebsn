import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private favoritesSubject = new BehaviorSubject<any[]>([]); // Inicializa a lista de favoritos
  favorites$ = this.favoritesSubject.asObservable(); // Observable de favoritos
  
  private apiUrl = `${environment.apiBaseUrl}/api/favorites`;

  constructor(private http: HttpClient) {}

  // Método para obter os cabeçalhos de autorização com o token
  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Método para adicionar um favorito
  addFavorite(pokemon: any, token: string) {
    const headers = this.getAuthHeaders(token);

    this.http.post(this.apiUrl, { name: pokemon.name }, { headers }).subscribe({
      next: (response: any) => {
        console.log('Favorito adicionado com sucesso:', response);
        // Atualiza a lista de favoritos no BehaviorSubject
        this.favoritesSubject.next([...this.favoritesSubject.value, response]);
      },
      error: (err) => {
        console.error('Erro ao adicionar favorito:', err);
        alert('Ocorreu um erro ao adicionar o favorito. Tente novamente!');
      },
    });
  }

  // Método para remover um favorito
  removeFavorite(favoriteId: number, token: string) {
    const headers = this.getAuthHeaders(token);

    this.http.delete(`${this.apiUrl}/${favoriteId}`, { headers }).subscribe({
      next: (response: any) => {
        console.log('Favorito removido com sucesso:', response);
        // Atualiza a lista de favoritos no BehaviorSubject após remoção
        const updatedFavorites = this.favoritesSubject.value.filter(fav => fav.id !== favoriteId);
        this.favoritesSubject.next(updatedFavorites);
      },
      error: (err) => {
        console.error('Erro ao remover favorito:', err);
        alert('Ocorreu um erro ao remover o favorito. Tente novamente!');
      },
    });
  }

  // Método para carregar os favoritos a partir da API
  loadFavorites(token: string) {
    const headers = this.getAuthHeaders(token);

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (favorites) => {
        console.log('Favoritos carregados:', favorites);
        this.favoritesSubject.next(favorites); // Atualiza os favoritos no BehaviorSubject
      },
      error: (err) => {
        console.error('Erro ao listar favoritos:', err);
        alert('Ocorreu um erro ao carregar seus favoritos. Tente novamente!');
      },
    });
  }
}
