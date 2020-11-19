import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Business } from 'src/app/models/businesses';
import { BusinessService } from 'src/app/services/business.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  businesses: Business[];
  dataSource: MatTableDataSource<Business>;
  displayedColumns: string[] = ['name', 'date', 'ownerName', 'address', 'types'];

  constructor(
    private businessService: BusinessService
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
}
