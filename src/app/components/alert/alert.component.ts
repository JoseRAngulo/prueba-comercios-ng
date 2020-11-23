
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlertService } from 'src/app/services/alert.service';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(
    private alertService: AlertService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    console.log(this.alertService.getAlert());
    this.subscription = this.alertService.getAlert()
      .subscribe(message => {
        switch (message && message.type) {
          case 'success':
            this.openSnackBar(message.text, 'snack-success');
            break;
          case 'error':
            this.openSnackBar(message.text, 'snack-warn');
            break;
        }

        this.message = message;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openSnackBar(message: string, className: string) {
    this.snackBar.open(message, 'X', {
      duration: 2000,
      panelClass: [className]
    });
  }
}
