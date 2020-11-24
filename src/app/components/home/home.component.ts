import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Business, BusinessSubType } from 'src/app/models/businesses';
import { AlertService } from 'src/app/services/alert.service';
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
  maxDate =  new Date(new Date().setDate(new Date().getDate() - 1));

  constructor(
    private businessService: BusinessService,
    private businessDialog: MatDialog,
    private fb: FormBuilder,
    private alertService: AlertService
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
        this.initControls();
        this.getSubtypes();
      });
  }

  private initControls() {
    const formGroups = this.businesses.map(business => {
      return this.fb.group({
        name: [business.name, [
          Validators.required,
          Validators.maxLength(50),
        ]],
        date: [business.date, Validators.required],
        owner_name: [business.owner_name, [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$')
        ]],
        address: [business.address, Validators.required],
        types: [business.types, Validators.required]
      });
    });
    this.controls = this.fb.array(formGroups);
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
          this.alertService.success('Comercio agregado satisfactoriamente');
          this.businesses.push(response.added);
          this.dataSource = new MatTableDataSource(this.businesses);
          this.getSubtypes();
          this.initControls();
          this.matTable.renderRows();
        }
      });
  }

  deleteBusiness(id: number): void {
    this.businesses = this.businesses.filter(b => b.id !== id);
    this.dataSource = new MatTableDataSource(this.businesses);
    this.matTable.renderRows();
    this.businessService.deleteBusiness(id).subscribe(() => {
      this.alertService.success('Comercio borrado satisfactoriamente');
    }, (error) => {
      this.alertService.error('Error a borrar comercio');
    });
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
          if (field === 'date' && typeof control.value !== 'string') {
            console.log(typeof control.value);
            e[field] = control.value.toISOString().split('T')[0];
          }
          this.businessService.editBusiness(e).subscribe(() => {
            this.alertService.success(`Campo editado existosamente`);
          }, (error) => {
            this.alertService.error(`Error al editar campo: ${field}`);
          });
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
