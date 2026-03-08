import { Component, inject, signal } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectSelectorComponent } from '../../shared/components/project-selector.component';
import { ExpenseService, Expense } from '../../core/services/expense.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [DecimalPipe, DatePipe, FormsModule, ProjectSelectorComponent],
  templateUrl: './expenses.component.html'
})
export class ExpensesComponent {
  private expenseService = inject(ExpenseService);
  expenses = signal<Expense[]>([]);
  showForm = signal(false);
  editingExpense = signal<Expense | null>(null);
  selectedProjectId = '';
  filterCategory = '';
  
  formData: Expense = {
    projectId: '',
    name: '',
    amount: 0,
    date: '',
    category: 'material'
  };

  onProjectSelected(projectId: string) {
    this.selectedProjectId = projectId;
    this.loadExpenses();
  }

  loadExpenses() {
    const filters = this.filterCategory ? { category: this.filterCategory } : undefined;
    this.expenseService.getExpensesByProject(this.selectedProjectId, filters).subscribe(
      data => this.expenses.set(data)
    );
  }

  openForm(expense?: Expense) {
    if (expense) {
      this.editingExpense.set(expense);
      this.formData = { ...expense };
    } else {
      this.editingExpense.set(null);
      this.resetForm();
    }
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.resetForm();
  }

  resetForm() {
    this.formData = { projectId: this.selectedProjectId, name: '', amount: 0, date: '', category: 'material' };
  }

  submit() {
    this.formData.projectId = this.selectedProjectId;
    const action = this.editingExpense()
      ? this.expenseService.updateExpense(this.editingExpense()!._id!, this.formData)
      : this.expenseService.createExpense(this.formData);

    action.subscribe(() => {
      this.closeForm();
      this.loadExpenses();
    });
  }

  deleteExpense(id: string) {
    if (confirm('Delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe(() => this.loadExpenses());
    }
  }
}
