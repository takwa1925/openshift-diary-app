import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiaryCustomizationData } from '../shared/DiaryCustomizationData';
import { User } from './manage-admin/manage-admin.component';

@Injectable()
export class AdminService {

    constructor(private http: HttpClient) { }

    createAdmin(fullname: string, email: string, password: string, repeatPassword: string): Observable<any> {
        return this.http.post('/api/admin/create', {
            fullname,
            email,
            password,
            repeatPassword
        });
    }
    updateDiaryCustomization(diary: DiaryCustomizationData): Observable<any> {
      return this.http.post('api/diary/', diary);
    }

    getDiaryCustomization() {
        return this.http.get('/api/diary');
    }

    getUsers(): any {

        return this.http.get('api/admin/getUsers', {});
    }
    getReport(customization: {startDate: Date, period: string}): Observable<any> {
        return this.http.post('api/admin/report', customization);
    }

    updateUsers(user: User): Observable<any> {
        return this.http.put('api/admin/updateUsers', {
            users: [
                user
            ]
        });
    }

}
