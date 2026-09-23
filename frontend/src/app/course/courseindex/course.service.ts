import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class CourseService {
    constructor(private http: HttpClient) { }
    getCourseAll(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api/course/getAll`);
    }
    GetAllForStudent(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api/course/GetAllForStudent`);
    }
    updateCourse(model: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/course/updateCourse`, model);
    }

    deleteCourse(id: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/course/deleteCourse?courseId=${id}`, {});
    }

    insertCourse(model: any):  Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/course/insertCourse`, model)
    }

    takeCourse(model: any):  Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/course/takeCourse`, model)
    }
    getStudentCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/course/GetStudentCourses`);
}

}