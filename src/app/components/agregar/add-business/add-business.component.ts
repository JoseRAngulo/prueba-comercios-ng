import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';
import { Business, BusinessSubType, BusinessType } from 'src/app/models/businesses';
import { concat, forkJoin, Observable } from 'rxjs';
import { last } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.css']
})
export class AddBusinessComponent implements OnInit {
  business: Business;
  subtypes: BusinessSubType[];
  types: BusinessType[];
  groupedSubtypes: BusinessSubType[][];
  businessForm: FormGroup;
  selectedOthers: number[] = [];
  newSubtypes = this.fb.group({});
  maxDate =  new Date(new Date().setDate(new Date().getDate() - 1));
  constructor(
    private businessService: BusinessService,
    private fb: FormBuilder,
    private businessDialog: MatDialog,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<AddBusinessComponent>
  ) { }

  ngOnInit() {
    this.getSubtypes();
    this.businessForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
        ]
      ],
      date: ['', Validators.required],
      ownerName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$')
        ]
      ],
      address: ['', Validators.required],
      types: ['', Validators.required]
    });
    this.newSubtypes.valueChanges.subscribe(e => console.log(e));
  }

  onSubmit(): void {
    this.business = {
      id: 0,
      name: this.businessForm.controls.name.value,
      date: this.businessForm.controls.date.value.toISOString().split('T')[0],
      owner_name: this.businessForm.controls.ownerName.value,
      address: this.businessForm.controls.address.value,
      types: this.businessForm.controls.types.value
    };
    this.addBusiness();
  }

  getSubtypes(): void {
    this.businessService.getSubtypes()
      .subscribe(subtypes => {
        this.subtypes = subtypes;
        this.getTypes();
        this.groupedSubtypes = this.groupByType(this.subtypes);
        console.log(this.groupedSubtypes);
      });
  }
  getTypes(): void {
    this.businessService.getBusinessTypes()
        .subscribe(types => {
          this.types = types;
        });
  }

  addBusiness(): void {
    const addSubtypes: Observable<BusinessSubType>[] = [];
    if (this.selectedOthers.length > 0) {
      Object.keys(this.newSubtypes.controls).forEach(key => {
        const subtype: BusinessSubType =  {
          id: 0,
          description: this.newSubtypes.controls[key].value,
          type: +key
        };
        addSubtypes.push(this.businessService.addSubtype(subtype));
        console.log(addSubtypes);
      });
      forkJoin(addSubtypes)
        .subscribe(subtypes => {
          console.log(this.business);
          console.log(subtypes.map(st => st.id));
          if (this.business.types.includes(undefined)) {
            this.business.types = subtypes.map(st => st.id);
          } else {
            this.business.types.concat(subtypes.map(st => st.id));
          }
          console.log(this.business);
          this.businessService.addBusiness(this.business)
            .subscribe(b => {
              this.business.id = b.id;
              this.alertService.success('Comercio guardado satisfactoriamente');
              this.dialogRef.close({ added: this.business });
            },
            (error) => {
              this.alertService.error('Error al guardar el comercio');
            });
        });
    } else {
      console.log(this.business);
      this.businessService.addBusiness(this.business)
        .subscribe(b => {
          this.business.id = b.id;
          this.dialogRef.close({ added: this.business });
        });
    }
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

  addOther(type: string, selected: boolean): void {
    if (selected) {
      this.selectedOthers.push(this.typeToId(type));
      const control = this.fb.control('', [Validators.required]);
      this.newSubtypes.addControl(`${this.typeToId(type)}`, control);
    } else {
      this.selectedOthers = this.selectedOthers.filter(v => v !== this.typeToId(type));
      this.newSubtypes.removeControl(`${this.typeToId(type)}`);
    }
    console.log(this.selectedOthers);
    console.log(this.newSubtypes);
  }

  typeToId(type: string): number {
    return this.types.find(t => t.name === type).id;
  }

  idToType(id: number): string {
    return this.types.find(t => t.id === id).name;
  }
}
