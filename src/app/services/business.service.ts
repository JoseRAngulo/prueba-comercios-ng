import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Business, BusinessSubType, BusinessType } from '../models/businesses';
@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private url = 'http://127.0.0.1:81';
  constructor(
    private http: HttpClient,
  ) { }

  getBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.url}/businesses/`);
  }
  getBusinessTypes(): Observable<BusinessType[]> {
    return this.http.get<BusinessType[]>(`${this.url}/business-types/`);
  }
  getBusiness(business: Business): Observable<Business> {
    return this.http.get<Business>(`${this.url}/businesses/${business.id}`, );
  }
  addBusiness(business: Business): Observable<Business> {
    return this.http.post<Business>(`${this.url}/businesses/`, business);
  }
  editBusiness(business: Business): Observable<Business> {
    return this.http.put<Business>(`${this.url}/businesses/${business.id}/`, business);
  }
  deleteBusiness(id: number): Observable<Business> {
    return this.http.delete<Business>(`${this.url}/businesses/${id}`);
  }
  getSubtypes(): Observable<BusinessSubType[]> {
    return this.http.get<BusinessSubType[]>(`${this.url}/business-subtypes/`);
  }
  addSubtype(subtype: BusinessSubType): Observable<BusinessSubType> {
    return this.http.post<BusinessSubType>(`${this.url}/business-subtypes/`, subtype);
  }
}
