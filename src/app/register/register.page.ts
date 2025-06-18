import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Importando FormsModule para usar ngModel
import { IonicModule } from '@ionic/angular';  // Importando IonicModule
import { RouterModule } from '@angular/router';  // Importando RouterModule para navegação
import { AuthService } from '../services/auth.service';  // Serviço de autenticação
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule], // Assegurando que esses módulos estão aqui
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  password_confirmation: string = '';

  constructor(
    private authService: AuthService,  // Serviço de autenticação
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    // Você pode inicializar algo aqui, se necessário
  }

  async register() {
    if (!this.username || !this.email || !this.password || !this.password_confirmation) {
      this.showToast('Preencha todos os campos.', 'danger');
      return;
    }

    if (this.password !== this.password_confirmation) {
      this.showToast('As senhas não coincidem.', 'danger');
      return;
    }

    const isRegistered = await this.authService.register(
      this.username,
      this.email,
      this.password,
      this.password_confirmation
    );
    if (isRegistered) {
      this.router.navigateByUrl('/login');
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }
}
