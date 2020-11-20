import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';
import { Business, BusinessSubType } from 'src/app/models/businesses';
@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.css']
})
export class AddBusinessComponent implements OnInit {
  business: Business;
  subtypes: BusinessSubType[];
  groupedSubtypes: BusinessSubType[][];
  businessForm: FormGroup;
  constructor(
    private businessService: BusinessService,
    private fb: FormBuilder,
    private businessDialog: MatDialog,
    public dialogRef: MatDialogRef<AddBusinessComponent>
  ) { }

  ngOnInit() {
    this.getSubtypes();
    this.businessForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      ownerName: ['', Validators.required],
      address: ['', Validators.required],
      types: ['', Validators.required]
    });
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
        this.groupedSubtypes = this.groupByType(this.subtypes);
      });
  }

  addBusiness(): void {
    console.log(this.business);
    this.businessService.addBusiness(this.business)
      .subscribe(b => {
        console.log(b);
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
}
