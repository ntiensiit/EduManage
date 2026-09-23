import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class DepartmentService {

    constructor(private http: HttpClient) { }

    getDepartmentAll(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api/department/getall`);
    }
    updateDepartment(model: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/department/updateDepartment`, model);
    }

    deleteDepartment(id: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/department/deleteDepartment?departmentId=${id}`, {});
    }

    insertDepartment(model: any):  Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/department/insertDepartment`, model)
    }

    getDepartment(id: number): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api/department/getbyId?departmentId=${id}`);
    }
}