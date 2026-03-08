import { Component, OnInit, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-project-selector',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mb-6">
      <label class="block text-gray-700 mb-2 font-semibold text-sm md:text-base">Select Project</label>
      <select [(ngModel)]="selectedId" (ngModelChange)="onProjectChange()"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base">
        <option value="">-- Select a Project --</option>
        @for (project of projectService.projects(); track project._id) {
          <option [value]="project._id">
            {{ project.name }} - {{ project.location }}
          </option>
        }
      </select>
    </div>
  `
})
export class ProjectSelectorComponent implements OnInit {
  projectService = inject(ProjectService);
  projectSelected = output<string>();
  selectedId = '';

  ngOnInit() {
    this.projectService.loadProjects().subscribe();
  }

  onProjectChange() {
    if (this.selectedId) {
      this.projectSelected.emit(this.selectedId);
    }
  }
}
