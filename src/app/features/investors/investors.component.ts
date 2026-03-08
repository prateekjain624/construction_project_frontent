import { Component, inject, signal } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectSelectorComponent } from '../../shared/components/project-selector.component';
import { InvestorService, Investor } from '../../core/services/investor.service';

@Component({
  selector: 'app-investors',
  standalone: true,
  imports: [DecimalPipe, DatePipe, FormsModule, ProjectSelectorComponent],
  templateUrl: './investors.component.html'
})
export class InvestorsComponent {
  private investorService = inject(InvestorService);
  investors = signal<Investor[]>([]);
  showForm = signal(false);
  editingInvestor = signal<Investor | null>(null);
  selectedProjectId = '';
  
  formData: Investor = {
    projectId: '',
    name: '',
    amount: 0,
    date: ''
  };

  onProjectSelected(projectId: string) {
    this.selectedProjectId = projectId;
    this.loadInvestors();
  }

  loadInvestors() {
    this.investorService.getInvestorsByProject(this.selectedProjectId).subscribe(
      data => this.investors.set(data)
    );
  }

  openForm(investor?: Investor) {
    if (investor) {
      this.editingInvestor.set(investor);
      this.formData = { ...investor };
    } else {
      this.editingInvestor.set(null);
      this.resetForm();
    }
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.resetForm();
  }

  resetForm() {
    this.formData = { projectId: this.selectedProjectId, name: '', amount: 0, date: '' };
  }

  submit() {
    this.formData.projectId = this.selectedProjectId;
    const action = this.editingInvestor()
      ? this.investorService.updateInvestor(this.editingInvestor()!._id!, this.formData)
      : this.investorService.createInvestor(this.formData);

    action.subscribe(() => {
      this.closeForm();
      this.loadInvestors();
    });
  }

  deleteInvestor(id: string) {
    if (confirm('Delete this investor?')) {
      this.investorService.deleteInvestor(id).subscribe(() => this.loadInvestors());
    }
  }
}
