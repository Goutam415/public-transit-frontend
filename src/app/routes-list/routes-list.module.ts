import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesListComponent } from './/routes-list/routes-list.component';
import { RoutesListRoutingModule } from './routes-list-routing.module';



@NgModule({
  declarations: [
    RoutesListComponent
  ],
  imports: [
    CommonModule,
    RoutesListRoutingModule
  ]
})
export class RoutesListModule { }
