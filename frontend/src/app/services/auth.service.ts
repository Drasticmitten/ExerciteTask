import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { UserInfo } from '../users/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
    userInfo$ = this.userInfoSubject.asObservable();

    constructor(private http: HttpClient) {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            this.userInfoSubject.next(JSON.parse(storedUserInfo));
        }
    }

    login(loginData: { name: string; password: string }) {
        return this.http.post<UserInfo>('http://localhost:3000/api/auth/login', loginData, {
            withCredentials: true,
        });
    }

    register(registerData: { name: string; email: string; password: string; passwordConfirmation: string }) {
        return this.http.post<UserInfo>('http://localhost:3000/api/auth/register', registerData, {
            withCredentials: true,
        });
    }

    logout() {
        return this.http.post('http://localhost:3000/api/auth/logout', {   });
    }

    setUserInfo(userInfo: UserInfo) {
        this.userInfoSubject.next(userInfo);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }

    async isLoggedIn(): Promise<boolean> {

        if (!localStorage.getItem('userInfo')) return false;
        try {
            const response = await firstValueFrom(
                this.http.get('http://localhost:3000/api/auth/validate-token', {
                    withCredentials: true
                })
            );
            console.log('response', response);
            return true;
        } catch (error) {
            return false; // Si hay un error o el token no es válido, retorna false.
        }
    }

    clearUserInfo() {
        this.userInfoSubject.next(null);
        localStorage.removeItem('userInfo');
        this.logout();
    }
}
