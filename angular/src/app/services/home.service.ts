import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HomeInfo} from '@app/models/models';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class HomeService {
    private baseUrl = environment.apiUrl +'home';
    
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<HomeInfo[]>(`${this.baseUrl}`);
    }

}