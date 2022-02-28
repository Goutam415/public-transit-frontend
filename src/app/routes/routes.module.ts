import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RoutesComponent } from './routes-details/routes.component';
import { RoutesRoutingModule } from './routes-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ToastNotificationService } from '../shared/notification/notification.service';



@NgModule({
  declarations: [
    RoutesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RoutesRoutingModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  providers: [ToastNotificationService]
})
export class RoutesModule { }
