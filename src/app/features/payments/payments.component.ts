import { Component, inject, signal } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectSelectorComponent } from '../../shared/components/project-selector.component';
import { PaymentService, Payment } from '../../core/services/payment.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [DecimalPipe, DatePipe, FormsModule, ProjectSelectorComponent],
  templateUrl: './payments.component.html'
})
export class PaymentsComponent {
  private paymentService = inject(PaymentService);
  payments = signal<Payment[]>([]);
  showForm = signal(false);
  editingPayment = signal<Payment | null>(null);
  selectedProjectId = '';
  
  formData: Payment = {
    projectId: '',
    clientName: '',
    amount: 0,
    date: ''
  };

  onProjectSelected(projectId: string) {
    this.selectedProjectId = projectId;
    this.loadPayments();
  }

  loadPayments() {
    this.paymentService.getPaymentsByProject(this.selectedProjectId).subscribe(
      data => this.payments.set(data)
    );
  }

  openForm(payment?: Payment) {
    if (payment) {
      this.editingPayment.set(payment);
      this.formData = { ...payment };
    } else {
      this.editingPayment.set(null);
      this.resetForm();
    }
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.resetForm();
  }

  resetForm() {
    this.formData = { projectId: this.selectedProjectId, clientName: '', amount: 0, date: '' };
  }

  submit() {
    this.formData.projectId = this.selectedProjectId;
    const action = this.editingPayment()
      ? this.paymentService.updatePayment(this.editingPayment()!._id!, this.formData)
      : this.paymentService.createPayment(this.formData);

    action.subscribe(() => {
      this.closeForm();
      this.loadPayments();
    });
  }

  deletePayment(id: string) {
    if (confirm('Delete this payment?')) {
      this.paymentService.deletePayment(id).subscribe(() => this.loadPayments());
    }
  }
}
