import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingController, ToastController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';
  password_confirmation: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async register() {
    if (!this.username || !this.email || !this.password || !this.password_confirmation) {
      this.showToast('Preencha todos os campos.', 'danger');
      return;
    }

    if (this.password !== this.password_confirmation) {
      this.showToast('As senhas não coincidem.', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Criando conta...' });
    await loading.present();

    this.http.post<any>('https://pokedexapi-2ssf.onrender.com/api/auth/register', {
      name: this.username,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation
    }).subscribe({
      next: async () => {
        await loading.dismiss();
        this.showToast('Cadastro realizado! Faça o login.', 'success');
        this.router.navigateByUrl('/login');
      },
      error: async (err) => {
        await loading.dismiss();
        const msg = err.error?.message || 'Erro ao cadastrar.';
        this.showToast(msg, 'danger');
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}
