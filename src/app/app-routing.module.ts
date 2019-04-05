import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';

import { FormsModule } from '@angular/forms';
const routes: Routes = [];

@NgModule({
  imports: [
  RouterModule.forRoot(routes),
  FormsModule,
  
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
