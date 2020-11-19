import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';
import { BusinessSubType } from 'src/app/models/businesses';
@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.css']
})
export class AddBusinessComponent implements OnInit {

  subtypes: BusinessSubType[];
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
      address: ['', Validators.required]
    });
  }

  getSubtypes(): void {
    this.businessService.getSubtypes()
      .subscribe(subtypes => {
        this.subtypes = subtypes;
      });
  }
}
