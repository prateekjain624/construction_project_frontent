import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Investor {
  _id?: string;
  projectId: string;
  name: string;
  amount: number;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class InvestorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/investors`;

  getInvestorsByProject(projectId: string) {
    return this.http.get<Investor[]>(`${this.apiUrl}/project/${projectId}`);
  }

  createInvestor(investor: Investor) {
    return this.http.post<Investor>(this.apiUrl, investor);
  }

  updateInvestor(id: string, investor: Investor) {
    return this.http.put<Investor>(`${this.apiUrl}/${id}`, investor);
  }

  deleteInvestor(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
