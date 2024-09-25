import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const loginData = {
      name      : this.username,
      password  : this.password
    };
    console.log('Datos de login:', loginData);

    this.http.post('http://localhost:3000/api/auth/login', loginData).subscribe({
      next: (res) => {
        console.log('Respuesta exitosa:', res);
      },
      error: (err) => {
        console.error('Error en la autenticación:', err);
      }
    });

  }
}
