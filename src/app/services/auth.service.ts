import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://pokedexapi-2ssf.onrender.com/api/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async login(email: string, password: string) {
    const loading = await this.loadingCtrl.create({ message: 'Entrando...' });
    await loading.present();

    try {
      const res = await this.http.post<any>(`${this.apiUrl}auth/login`, {
        email, password
      }).toPromise();
      console.log(res, 'login console');
      localStorage.setItem('token', res.token);
      await loading.dismiss();
      await this.showToast('Login realizado com sucesso!', 'success');
      this.router.navigateByUrl('/');
      return true;
    } catch (error) {
      await loading.dismiss();
      await this.showToast('Credenciais inválidas. Tente novamente.', 'danger');
      return false;
    }
  }

  async register(username: string, email: string, password: string, password_confirmation: string) {
    const loading = await this.loadingCtrl.create({ message: 'Registrando...' });
    await loading.present();

    try {
      await this.http.post<any>(`${this.apiUrl}auth/register`, {
        username, email, password, password_confirmation
      }).toPromise();

      await loading.dismiss();
      await this.showToast('Registro realizado com sucesso!', 'success');
      this.router.navigateByUrl('/login');
      return true;
    } catch (error) {
      await loading.dismiss();
      await this.showToast('Erro no registro. Verifique seus dados.', 'danger');
      return false;
    }
  }

isLoggedIn(): boolean {
  const token = localStorage.getItem('token');
  console.log(token)
  
  // Adicionando uma verificação simples para garantir que o token não esteja vazio ou nulo
  if (token && token !== 'null' && token !== 'undefined') {
    return true;
  }
  
  return false;
}


  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
