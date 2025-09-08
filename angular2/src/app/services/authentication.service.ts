import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User} from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {
    private baseUrl = environment.apiUrl +'users';
    private authUrl = environment.authUrl;
    private readonly JWT_TOKEN = 'JWT_TOKEN'; //their name
    private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>; //save other information about user

    constructor(private http: HttpClient) {
       let defaultUser=new User();
       let savedUser=localStorage.getItem('currentUser')
       if( savedUser!== null){
            defaultUser = JSON.parse(savedUser);
       }else{
            defaultUser.id=1;
            defaultUser.level=false;
        }
        this.currentUserSubject = new BehaviorSubject<User | null>(defaultUser)
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(username : string, password : string) {
        return this.http.post<any>(`${this.authUrl}jwt/create/`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.storeJwtToken(user.access);
                this.storeRefreshToken(user.refresh);
                localStorage.setItem('currentUser', JSON.stringify(user, this.replacer)); 
                let savedUser =localStorage.getItem('currentUser')
                if (savedUser !== null){ //cannot be null actually, but for the compiler
                    this.currentUserSubject.next(JSON.parse(savedUser));//user
                }
            })); //error catch in error.interceptor
    }

    logout() {
        // remove user from local storage and set current user to null
        // logout is not in djoser path
        this.http.post(`${this.baseUrl}/logout/`, this.currentUser);
        localStorage.removeItem('currentUser');
        localStorage.removeItem(this.JWT_TOKEN);
        localStorage.removeItem(this.REFRESH_TOKEN);
        this.currentUserSubject.next(null);
        //monitoring
        localStorage.removeItem('NB_STARTED_ROUTINES');
        localStorage.removeItem('NB_COMPLETED_ROUTINES');
        localStorage.removeItem('STARTED_ROUTINES');
        localStorage.removeItem('STARTED_ROUTINES_ID');
        //localStorage.removeItem('CHECKING');
    }
    
     isLoggedIn() {
         return !!this.getJwtToken();
     }
     
     isAdmin(){
         let level=false;
     
         if(this.isLoggedIn()){
            this.currentUser.subscribe(
             user => {
               if (user !== null){
                  level=!!user.level;
               }
             })
         }
        
        return level;       
     }
   
    public getJwtToken() {
       return localStorage.getItem(this.JWT_TOKEN);
    }

    refreshToken() {
         return this.http.post<any>(`${this.authUrl}jwt/refresh/`,
         {'refresh': this.getRefreshToken() } 
         )
         .pipe(tap(ans => {
         console.log("token refreshed");
         this.storeJwtToken(ans.access);
    }));
    }
    
    private storeRefreshToken(refresh: string) {
        localStorage.setItem(this.REFRESH_TOKEN, refresh);
      }
   
    private storeJwtToken(jwt: string) {
        localStorage.setItem(this.JWT_TOKEN, jwt);
      }
    
    private getRefreshToken() {
       return localStorage.getItem(this.REFRESH_TOKEN);
    }
    
    private replacer(key : string, value : any) {
      if (key === 'access' || key === 'refresh') {
        return undefined;
      }
      return value;
    }
}

