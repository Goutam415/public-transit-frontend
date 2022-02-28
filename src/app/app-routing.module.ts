import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesListComponent } from './routes-list/routes-list.component';

const routes: Routes = [
  { 
    path: '',
    redirectTo: '/routes-list',
    pathMatch: 'full'
  },
  { path: 'routes',
    loadChildren: () => import('./routes/routes.module').then(m => m.RoutesModule) 
  },
  { path: 'routes/:id',
    loadChildren: () => import('./routes/routes.module').then(m => m.RoutesModule) 
  },
  { path: 'routes-list',
    loadChildren: () => import('./routes-list/routes-list.module').then(m => m.RoutesListModule) 
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
