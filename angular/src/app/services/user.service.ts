import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, SetPass} from '@app/models/models';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    private baseUrl = environment.apiUrl +'users';
    private authUrl = environment.authUrl;
    
    constructor(private http: HttpClient) { }

    //used?
    getAll() {
        return this.http.get<User[]>(`${this.baseUrl}`);
    }

    register(user: User) {
        return this.http.post(`${this.authUrl}users/`, user );
    }
    
    //used?, pass required?
    delete() {
        return this.http.delete(`${this.authUrl}users/me/`);
    }
    
    //will trigger email send
    forgotten(email: string){
        return this.http.post(`${this.authUrl}users/reset_password/`, email );
    }
    
    //will trigger email send
    resendEmail(email: string){
        return this.http.post(`${this.authUrl}users/resend_activation/`, email );
    }
    
    changePass(setpass: SetPass){
        return this.http.post(`${this.authUrl}users/set_password/`, setpass );
    }
}