import { Component, OnInit } from '@angular/core';
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

  businesses: Business[];
  dataSource: MatTableDataSource<Business>;
  displayedColumns: string[] = ['name', 'date', 'ownerName', 'address', 'types', 'actions'];

  constructor(
    private businessService: BusinessService,
    private businessDialog: MatDialog
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
}
