import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Business } from 'src/app/models/businesses';
import { BusinessService } from 'src/app/services/business.service';
import { AddBusinessComponent } from '../agregar/add-business/add-business.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  controls: FormArray;
  businesses: Business[];
  dataSource: MatTableDataSource<Business>;
  displayedColumns: string[] = ['name', 'date', 'ownerName', 'address', 'types', 'actions'];

  constructor(
    private businessService: BusinessService,
    private businessDialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
      this.getBusinesses();
  }

  getBusinesses(): void {
    this.businessService.getBusinesses()
      .subscribe(businesses => {
        this.businesses = businesses;
        console.log(this.businesses);
        this.dataSource = new MatTableDataSource(this.businesses);
        const formGroups = this.businesses.map(business => {
          return this.fb.group({
            name: [business.name, Validators.required],
            date: [business.date, Validators.required],
            ownerName: [business.owner_name, Validators.required],
            address: [business.address, Validators.required],
            types: [business.types, Validators.required]
          });
        });
        this.controls = this.fb.array(formGroups);
      });
  }

  openBusinessDialog(event: Event): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    const businessRef = this.businessDialog.open(AddBusinessComponent, dialogConfig);
    businessRef.afterClosed()
      .subscribe(response => {
        if (response && response.added) {
        }
      });
  }

  deleteBusiness(id: number): void {
    this.businessService.deleteBusiness(id).subscribe();
  }

  getControl(index: number, field: string): FormControl {
    return this.controls.at(index).get(field) as FormControl;
  }

  updateField(index: number, field: string ) {
    const control = this.getControl(index, field);
    if (control.valid) {
      this.businesses = this.businesses.map((e, i) => {
        if (index === i) {
          return {
            ...e,
            [field]: control.value
          };
        }
        return e;
      });
    }
  }
}
