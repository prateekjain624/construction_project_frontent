import { Component, inject, signal } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ProjectSelectorComponent } from '../../shared/components/project-selector.component';
import { ProjectService, ProjectStats } from '../../core/services/project.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, DatePipe, ProjectSelectorComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private projectService = inject(ProjectService);
  stats = signal<ProjectStats | null>(null);
  loading = signal(false);

  onProjectSelected(projectId: string) {
    this.loading.set(true);
    this.projectService.getProjectStats(projectId).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
