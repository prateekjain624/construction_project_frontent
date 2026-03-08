import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project } from '../../core/services/project.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  projectService = inject(ProjectService);
  showForm = signal(false);
  editingProject = signal<Project | null>(null);
  
  formData: Project = {
    name: '',
    location: '',
    startDate: '',
    status: 'active'
  };

  ngOnInit() {
    this.projectService.loadProjects().subscribe();
  }

  openForm(project?: Project) {
    if (project) {
      this.editingProject.set(project);
      this.formData = { ...project };
    } else {
      this.editingProject.set(null);
      this.resetForm();
    }
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.resetForm();
  }

  resetForm() {
    this.formData = { name: '', location: '', startDate: '', status: 'active' };
  }

  submit() {
    const action = this.editingProject()
      ? this.projectService.updateProject(this.editingProject()!._id!, this.formData)
      : this.projectService.createProject(this.formData);

    action.subscribe(() => this.closeForm());
  }

  deleteProject(id: string) {
    if (confirm('Delete this project?')) {
      this.projectService.deleteProject(id).subscribe();
    }
  }
}
