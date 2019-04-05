import { Component, OnInit } from '@angular/core';
import  {ApiService} from '../api.service';
import {ActivatedRoute,Router} from '@angular/router';
import {Projects} from '../Projects';
import { from } from 'rxjs';
import { forEach } from '@angular/router/src/utils/collection';
import { projection } from '@angular/core/src/render3';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects:Projects[];
  constructor(public rest:ApiService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.getProjects();
  }
getProjects(){
  this.rest.GetProjects().subscribe((projects: {}) => {
    console.log(projects);
    this.projects=projects;
  });
}
onSaveId(id,id2){
 localStorage.setItem("CurrentId",id);
 localStorage.setItem("CurrProName",id2);
 console.log(id,"Saved");
 location.replace('/Teams');
}
}
