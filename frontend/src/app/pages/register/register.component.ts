import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username              : string = '';
  password              : string = '';
  email                 : string = '';
  passwordConfirmation  : string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const registerData = {
      name                  : this.username,
      email                 : this.email,
      password              : this.password,
      passwordConfirmation  : this.passwordConfirmation
    };
    console.log('Datos de register:', registerData);

    this.http.post('http://localhost:3000/api/auth/register', registerData).subscribe({
      next: (res) => {
        console.log('Respuesta exitosa:', res);
      },
      error: (err) => {
        console.error('Error en la autenticación:', err);
      }
    });

  }
}
