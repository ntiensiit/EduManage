import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class TeacherService {

    constructor(private http: HttpClient) { }

    getTeacherAll(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api/teacher/getall`);
    }
    updateTeacher(model: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/teacher/updateTeacher`, model);
    }

    deleteTeacher(id: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/teacher/deleteTeacher?teacherId=${id}`, {});
    }

    insertTeacher(model: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/teacher/insertTeacher`, model, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getTeacher(id: number): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api/teacher/getbyId?teacherId=${id}`);
    }
}