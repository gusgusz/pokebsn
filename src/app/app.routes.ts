import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { AuthGuard } from './guards/auth.guard';
import { FavoritesPage } from './favorites/favorites.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [AuthGuard],  
  },
  {
    path: 'pokemon/:name',
    loadComponent: () =>
      import('./pokemon-detail/pokemon-detail.page').then(
        (m) => m.PokemonDetailPage
      ),
    canActivate: [AuthGuard],  
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  { 
    path: 'favorites', 
    loadComponent: () => import('./favorites/favorites.page').then(m => m.FavoritesPage), 
    canActivate: [AuthGuard]
  },
];
