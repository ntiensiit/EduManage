import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class StudentService {
    constructor(private http: HttpClient) { }
    getStudentAll(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api/student/getAll`);
    }
    updateStudent(model: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/student/updateStudent`, model);
    }

    deleteStudent(id: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/student/deleteStudent?studentId=${id}`, {});
    }

    insertStudent(model: any):  Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/student/insertStudent`, model)
    }

}