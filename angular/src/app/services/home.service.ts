import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HomeInfo} from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HomeService {
    private baseUrl = environment.apiUrl +'home';
    
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<HomeInfo[]>(`${this.baseUrl}`);
    }

}