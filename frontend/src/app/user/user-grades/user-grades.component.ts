import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../course/exam/exam.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-grades',
  templateUrl: './user-grades.component.html',
  styleUrls: ['./user-grades.component.scss'],
  providers: [MessageService]
})
export class UserGradesComponent implements OnInit {
  courses: any[] = [];
  selectedCourse: any = null;
  exams: any[] = [];
  examResults: any[] = [];
  courseAverage: number = 0;
  loading: boolean = false;

  constructor(
    private examService: ExamService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCourses();
    
    // Auto-select if courseId comes from query params
    this.route.queryParams.subscribe(params => {
      if (params['courseId']) {
        // Set selected course after courses are loaded
        setTimeout(() => {
          this.selectedCourse = this.courses.find(c => c.id == params['courseId']);
          if (this.selectedCourse) {
            this.loadExamResults();
          }
        }, 1000);
      }
    });
  }

  loadCourses() {
    this.loading = true;
    // This method will be implemented in the backend
    this.examService.getUserCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'An error occurred while loading courses.',
          life: 3000
        });
        this.loading = false;
      }
    });
  }

  onCourseSelect() {
    if (this.selectedCourse) {
      this.loadExamResults();
    }
  }

  loadExamResults() {
    this.loading = true;
    this.examService.getUserExamResults(this.selectedCourse.id).subscribe({
      next: (results) => {
        this.examResults = results;
        this.calculateAverage();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading exam results:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'An error occurred while loading exam results.',
          life: 3000
        });
        this.loading = false;
      }
    });
  }

  calculateAverage() {
    if (this.examResults.length > 0) {
      const totalScore = this.examResults.reduce((sum, result) => sum + result.score, 0);
      this.courseAverage = totalScore / this.examResults.length;
    } else {
      this.courseAverage = 0;
    }
  }

  getGradeColor(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  }


  showExamDetails(result: any) {
    // Show exam details (modal or new page)
    console.log('Exam details:', result);
    // This part can be implemented later
  }

  goToExams() {
    // Redirect to home page
    window.location.href = '/user/index';
  }
}
