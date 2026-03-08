import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Project {
  _id?: string;
  name: string;
  location: string;
  startDate: string;
  status: 'active' | 'completed';
}

export interface ProjectStats {
  totalInvestment: number;
  totalExpenses: number;
  totalReceived: number;
  balance: number;
  investors: any[];
  expenses: any[];
  payments: any[];
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;
  
  // Using signals for reactive state management
  projects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);

  loadProjects() {
    return this.http.get<Project[]>(this.apiUrl)
      .pipe(tap(projects => this.projects.set(projects)));
  }

  getProject(id: string) {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  getProjectStats(id: string) {
    return this.http.get<ProjectStats>(`${this.apiUrl}/${id}/stats`);
  }

  createProject(project: Project) {
    return this.http.post<Project>(this.apiUrl, project)
      .pipe(tap(() => this.loadProjects().subscribe()));
  }

  updateProject(id: string, project: Project) {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project)
      .pipe(tap(() => this.loadProjects().subscribe()));
  }

  deleteProject(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.loadProjects().subscribe()));
  }
}
