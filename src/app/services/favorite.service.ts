import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favoritesSubject = new BehaviorSubject<any[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  private webhookUrl = 'https://webhook.site/your-webhook-url'; // Substitua pelo seu URL do Webhook

  constructor(private http: HttpClient) {}

  addFavorite(pokemon: any) {
    const currentFavorites = this.favoritesSubject.value;
    if (!currentFavorites.some(fav => fav.id === pokemon.id)) {
      currentFavorites.push(pokemon);
      this.favoritesSubject.next(currentFavorites);
      this.sendToWebhook(pokemon);
    }
  }

  removeFavorite(pokemonId: number) {
    const updatedFavorites = this.favoritesSubject.value.filter(fav => fav.id !== pokemonId);
    this.favoritesSubject.next(updatedFavorites);
  }

  private sendToWebhook(pokemon: any) {
    this.http.post(this.webhookUrl, pokemon).subscribe({
      next: () => console.log('Favorito enviado com sucesso!'),
      error: (err) => console.error('Erro ao enviar favorito:', err)
    });
  }
}
