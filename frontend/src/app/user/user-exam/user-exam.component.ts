import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../course/exam/exam.service';
import { SignalRService } from 'src/signalR.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-exam',
  templateUrl: './user-exam.component.html',
  styleUrls: ['./user-exam.component.scss'],
  providers: [MessageService]
})
export class UserExamComponent implements OnInit, OnDestroy {
  examId: number = 0;
  exam: any = {};
  questions: any[] = [];
  answers: { [questionId: number]: number } = {};
  remainingSeconds: number = 0;
  private timerSub?: Subscription;
  examActive = true; // <-- ADDED
  examResult: any = null; // For exam result
  showUnansweredDialog = false; // Unanswered questions dialog
  unansweredQuestions: any[] = []; // Unanswered questions list

  constructor(
    private route: ActivatedRoute, 
    private examService: ExamService, 
    private signalRService: SignalRService, 
    private router: Router,
    private messageService: MessageService
  ) {
    const paramExamId = this.route.snapshot.paramMap.get('id');
    if (paramExamId) {
      this.examId = Number(paramExamId);
    }
  }

  ngOnInit() {
    this.examService.getExamById(this.examId).subscribe(exam => {
      this.exam = exam;
    });
    this.examService.getQuestionsByExamId(this.examId).subscribe(questions => {
      this.questions = questions;
    });

    // Start the exam
    this.examService.startExam(this.examId).subscribe(success => {
      if (success) {
        this.examActive = true; // <-- Active when exam starts
        this.signalRService.startConnection().subscribe(() => {
          this.timerSub = this.signalRService.remainingSeconds$.subscribe(seconds => {
            this.remainingSeconds = seconds;
            
            // Last 30 seconds warning
            if (seconds === 30 && this.examActive) {
              this.messageService.add({ 
                severity: 'warn', 
                summary: '⏰ Last 30 Seconds!', 
                detail: 'Your exam enters its last 30 seconds. Check your answers!', 
                life: 5000 
              });
            }
            
            // Last 10 seconds warning
            if (seconds === 10 && this.examActive) {
              this.messageService.add({ 
                severity: 'error', 
                summary: '🚨 Last 10 Seconds!', 
                detail: 'Your exam enters its last 10 seconds! Submit now!', 
                life: 3000 
              });
            }
            
// Time expired
            if (seconds === 0 && this.examActive) {
              this.examActive = false;
              
              // Auto-submit attempt
              this.autoSubmitExam();
            }
          });
        });
      } else {
        alert('Could not start exam.');
      }
    });
  }

  ngOnDestroy() {
    this.examActive = false; // <-- Exam is no longer active when component closes
    this.timerSub?.unsubscribe();
    this.signalRService.stopConnection();
  }
  
  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  selectAnswer(questionId: number, choice: number) {
    this.answers[questionId] = choice;
  }

  submitAnswers() {
    if (!this.examActive) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Warning', 
        detail: 'Exam time expired, answers cannot be submitted.', 
        life: 3000 
      });
      return;
    }

    if (this.examResult) {
      this.messageService.add({ 
        severity: 'info', 
        summary: 'Bilgi', 
        detail: 'This exam was already submitted.', 
        life: 3000 
      });
      return;
    }

    // Check whether all questions are answered
    this.unansweredQuestions = this.questions.filter(q => !this.answers[q.id]);
    if (this.unansweredQuestions.length > 0) {
      this.showUnansweredDialog = true;
      return;
    }

    // Submit directly if all questions are answered
    this.performSubmit();
  }

  getGradeColor(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  }

  goToGrades() {
    this.router.navigate(['/user/grades']);
  }

  performSubmit() {
    // Send answers to backend
    this.examService.submitAnswers(this.examId, this.answers).subscribe({
      next: (result) => {
        this.examActive = false;
        this.examResult = result; // Store the result
        
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: `Answers submitted successfully! Your score: ${result.score || 0}`, 
          life: 5000 
        });
        
        // Redirect to results page or return to home page
        setTimeout(() => {
          this.router.navigate(['/user/grades']);
        }, 3000);
      },
      error: (error) => {
        console.error('Error submitting answers:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hata', 
          detail: 'An error occurred while submitting. Please try again.', 
          life: 5000 
        });
      }
    });
  }

  confirmSubmitWithUnanswered() {
    this.showUnansweredDialog = false;
    this.performSubmit();
  }

  cancelSubmitWithUnanswered() {
    this.showUnansweredDialog = false;
  }

  goToUnansweredQuestion(questionId: number) {
    this.showUnansweredDialog = false;
    // Scroll to question
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Slight highlight effect
      element.classList.add('highlight-question');
      setTimeout(() => {
        element.classList.remove('highlight-question');
      }, 2000);
    }
  }

  getQuestionNumber(questionId: number): number {
    return this.questions.findIndex(q => q.id === questionId) + 1;
  }

  getQuestionPreview(question: string): string {
    return question.length > 80 ? question.slice(0, 80) + '...' : question;
  }

  getQuestionId(questionId: number): string {
    return `question-${questionId}`;
  }

  private autoSubmitExam() {
    // Auto-submit when time expires
    this.messageService.add({ 
      severity: 'error', 
      summary: '⏰ Time Up!', 
      detail: 'Your exam time is up. Submitting automatically...', 
      life: 5000 
    });

    // Send current answers
    this.examService.submitAnswers(this.examId, this.answers).subscribe({
      next: (result) => {
        this.examResult = result;
        
        this.messageService.add({ 
          severity: 'info', 
          summary: '✅ Auto-Submit', 
          detail: `Answers auto-submitted! Your score: ${result.score || 0}`, 
          life: 5000 
        });
        
        // Redirect to results page
        setTimeout(() => {
          this.router.navigate(['/user/grades']);
        }, 3000);
      },
      error: (error) => {
        console.error('Auto-submit error:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: '❌ Submission Error', 
          detail: 'Could not submit answers. Please try again.', 
          life: 5000 
        });
        
        // Redirect to home page on error
        setTimeout(() => {
          this.router.navigate(['/user']);
        }, 3000);
      }
    });
  }
}
