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

  constructor(
    private businessService: BusinessService,
    private fb: FormBuilder,
    private municipioDialog: MatDialog,
    public dialogRef: MatDialogRef<AddBusinessComponent>
  ) { }

  ngOnInit() {
    this.getSubtypes();
  }

  getSubtypes(): void {
    this.businessService.getSubtypes()
      .subscribe(subtypes => {
        this.subtypes = subtypes;
      });
  }
}
