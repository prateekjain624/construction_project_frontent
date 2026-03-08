import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Payment {
  _id?: string;
  projectId: string;
  clientName: string;
  amount: number;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  getPaymentsByProject(projectId: string) {
    return this.http.get<Payment[]>(`${this.apiUrl}/project/${projectId}`);
  }

  createPayment(payment: Payment) {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  updatePayment(id: string, payment: Payment) {
    return this.http.put<Payment>(`${this.apiUrl}/${id}`, payment);
  }

  deletePayment(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
