import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Business, BusinessSubType } from '../models/businesses';
@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private url = 'http://127.0.0.1:8000';
  constructor(
    private http: HttpClient,
  ) { }

  getBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.url}/businesses/`);
  }
  getBusiness(business: Business): Observable<Business> {
    return this.http.get<Business>(`${this.url}/businesses/${business.id}`, );
  }
  addBusiness(business: Business): Observable<Business> {
    return this.http.post<Business>(`${this.url}/businesses/`, business);
  }
  editBusiness(business: Business): Observable<Business> {
    return this.http.put<Business>(`${this.url}/businesses/${business.id}`, business);
  }
  deleteBusiness(business: Business): Observable<Business> {
    return this.http.delete<Business>(`${this.url}/businesses/${business.id}`);
  }
  getSubtypes(): Observable<BusinessSubType[]> {
    return this.http.get<BusinessSubType[]>(`${this.url}/business-subtypes/`);
  }
}
