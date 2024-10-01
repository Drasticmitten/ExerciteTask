import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { UserInfo } from "../users/user.model";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) {
    }

    getUsers(): Observable<UserInfo[]> {
        return this.http.get<{ users: UserInfo[] }>('http://localhost:3000/api/users', {
            withCredentials: true,
        })
            .pipe(
                map(usersInfo => {
                    const { users } = usersInfo;
                    console.log('Users:', users);
                    return users;
                }),
                catchError(error => {
                    console.error('Error fetching users:', error);
                    return of([]);
                })


            );
    }

    getUserByName(name: string): Observable<UserInfo> {
        return this.http.get<UserInfo>(`http://localhost:3000/api/users/${name}`, {
            withCredentials: true,
        })
            .pipe(
                map((user) => {
                    console.log('User Selected:', user);
                    return user;
                }),
                catchError(error => {
                    console.error('Error fetching user:', error);
                    return of({ _id: '', name: '', email: '', tasksAsigned: [] });
                })
            );
    }
}