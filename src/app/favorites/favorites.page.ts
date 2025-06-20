import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../services/favorite.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-favorites',
  standalone: true,
  providers: [FavoriteService],
  imports: [CommonModule, IonicModule, RouterModule, FormsModule],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  favorites: any[] = []; 
  filteredFavorites: any[] = []; 
  searchTerm: string = ''; 
  showSuggestions: boolean = false; 

  constructor(
    private favoriteService: FavoriteService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    
    if (token) {
  
      this.favoriteService.loadFavorites();
      
    
      this.favoriteService.favorites$.subscribe((favorites) => {
        this.favorites = favorites;
        this.filteredFavorites = [...this.favorites]; 
        this.loadPokemonImages(); 
      });
    } else {
      console.error('Token de autenticação não encontrado');
    }
  }

  loadPokemonImages() {
    this.filteredFavorites.forEach(pokemon => {
   
      this.http.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`).subscribe((data: any) => {
        pokemon.imageUrl = data.sprites.other['official-artwork'].front_default; // Atualiza a URL da imagem
      });
    });
  }

 
  onSearchInput() {
    this.showSuggestions = true;
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.filteredFavorites = this.favorites.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredFavorites = [...this.favorites]; // Reseta para todos os favoritos quando o campo de pesquisa estiver vazio
    }
  }

  // Limpa as sugestões de pesquisa
  clearSuggestions() {
    this.showSuggestions = false;
  }

  // Ao selecionar um Pokémon da lista de favoritos
  onPokemonSelected(suggestion: any) {
    this.router.navigate([`/pokemon/${suggestion.name}`]); // Navega para a página de detalhes do Pokémon
    this.clearSuggestions(); // Limpa as sugestões após seleção
  }

  // Alterna o status de favorito de um Pokémon
  toggleFavorite(pokemon: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token não encontrado");
      return;
    }

    const isFavorite = this.isFavorite(pokemon);
    if (isFavorite) {
      this.removeFavoriteFromAPI(pokemon.id, token); 
    } else {
      this.addFavoriteToAPI(pokemon, token);
    }
  }

  // Verifica se o Pokémon é favorito
  isFavorite(pokemon: any): boolean {
    return this.favorites.some(fav => fav.poke_id === pokemon.id);
  }

  // Navega para a página de detalhes do Pokémon
  goToPokemon(pokemonName: string) {
    this.router.navigate([`/pokemon/${pokemonName}`]);
  }

  // Faz o logout do usuário
  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  // Adiciona um Pokémon aos favoritos na API
  addFavoriteToAPI(pokemon: any, token: string) {
    this.favoriteService.addFavorite(pokemon);
  }

  // Remove um Pokémon dos favoritos na API
  removeFavoriteFromAPI(favoriteId: number, token: string) {
    this.favoriteService.removeFavorite(favoriteId);
  }

  // Navega para a página inicial
  goToHome() {
    this.router.navigate(['/']);
  }

  // Função para rolar a página para o topo
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
