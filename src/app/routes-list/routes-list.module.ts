import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesListComponent } from './/routes-list/routes-list.component';
import { RoutesListRoutingModule } from './routes-list-routing.module';
import { ToastNotificationService } from '../shared/notification/notification.service';



@NgModule({
  declarations: [
    RoutesListComponent
  ],
  imports: [
    CommonModule,
    RoutesListRoutingModule,
  ],
  providers: [ToastNotificationService]
})
export class RoutesListModule { }
