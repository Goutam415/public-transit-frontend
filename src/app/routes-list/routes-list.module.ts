import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesListComponent } from './/routes-list/routes-list.component';
import { RoutesListRoutingModule } from './routes-list-routing.module';
import { ToastNotificationService } from '../shared/notification/notification.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [RoutesListComponent],
  imports: [
    CommonModule,
    RoutesListRoutingModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
  ],
  providers: [ToastNotificationService],
})
export class RoutesListModule {}
