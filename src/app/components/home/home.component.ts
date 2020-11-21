import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Business, BusinessSubType } from 'src/app/models/businesses';
import { BusinessService } from 'src/app/services/business.service';
import { AddBusinessComponent } from '../agregar/add-business/add-business.component';

@Component({
  selector: 'app-home',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('matTable', {static : false}) matTable: MatTable<any>;
  controls: FormArray;
  businesses: Business[];
  dataSource: MatTableDataSource<Business>;
  displayedColumns: string[] = ['name', 'date', 'owner_name', 'address', 'types', 'actions'];
  subtypes: BusinessSubType[];
  groupedSubtypes: BusinessSubType[][];
  subtypeStrings: { [id: number]: string; } = {};

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
            owner_name: [business.owner_name, Validators.required],
            address: [business.address, Validators.required],
            types: [business.types, Validators.required]
          });
        });
        this.controls = this.fb.array(formGroups);
        this.getSubtypes();
      });
  }

  getSubtypes(): void {
    this.businessService.getSubtypes()
      .subscribe(subtypes => {
        this.subtypes = subtypes;
        this.businesses.forEach(b => {
          this.subtypeStrings[b.id] = this.verboseSubtype(b, subtypes);
        });
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
          this.businesses.push(response.added);
          this.dataSource = new MatTableDataSource(this.businesses);
          this.getSubtypes();
          this.matTable.renderRows();
        }
      });
  }

  deleteBusiness(id: number): void {
    this.businesses = this.businesses.filter(b => b.id !== id);
    this.dataSource = new MatTableDataSource(this.businesses);
    this.matTable.renderRows();
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
          e[field] = control.value;
          if (field === 'date') {
            e[field] = control.value.toISOString().split('T')[0];
          }
          this.businessService.editBusiness(e).subscribe();
          return e;
        }
        return e;
      });
      this.getSubtypes();
      this.matTable.renderRows();
    }
  }
  subtypeIdToString(id: number, subtypes: BusinessSubType[]): string {
      return subtypes.find(e => e.id === id).description;
  }
  verboseSubtype(business: Business, subtypes: BusinessSubType[]): string {
      return business.types.map((v) => this.subtypeIdToString(v, subtypes)).join(', ');
  }
}
