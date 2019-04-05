import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { from } from 'rxjs';
import { ProjectsComponent } from './projects/projects.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { TeamsComponent } from './teams/teams.component';
import { SprintsComponent } from './sprints/sprints.component';
import { WorkitemComponent } from './workitem/workitem.component';
import { MetricsComponent } from './metrics/metrics.component';


const Approutes: Routes = [
  {path:'Projects',
  component:ProjectsComponent,
  data:{title: 'Projects List'}
  },
  {path:'Teams',
  component:TeamsComponent,
  data:{title: 'Teams List'}
  },
  {path:'Sprints',
  component:SprintsComponent,
  data:{title: 'Sprints List'}
  },
  {
    path:'WorkItems',
    component:WorkitemComponent,
    data:{title: 'Workitem List'}
  },
  {
    path:'Metrics',
    component:MetricsComponent,
    data:{title:"Metrics"}
  }
  
  
  ];
@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    NavbarComponent,
    TeamsComponent,
    SprintsComponent,
    WorkitemComponent,
    MetricsComponent,
    
  ],
  imports: [
    RouterModule.forRoot(Approutes),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
