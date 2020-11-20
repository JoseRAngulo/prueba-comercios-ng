import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Business, BusinessSubType } from 'src/app/models/businesses';
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
  subtypes: BusinessSubType[];
  groupedSubtypes: BusinessSubType[][];

  constructor(
    private businessService: BusinessService,
    private businessDialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
      this.getBusinesses();
      this.getSubtypes();
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

  getSubtypes(): void {
    this.businessService.getSubtypes()
      .subscribe(subtypes => {
        this.subtypes = subtypes;
        this.groupedSubtypes = this.groupByType(this.subtypes);
      });
  }
  groupByType(data: BusinessSubType[]): BusinessSubType[][] {
    const grouped = data.reduce((storage, item) => {
      const group = item.type;
      storage[group] = storage[group] || [];
      storage[group].push(item);
      return storage;
    }, {});
    const arrayed = [];
    Object.keys(grouped).forEach(key => {
      arrayed.push(grouped[key]);
    });
    return arrayed;
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
