import { Component, OnInit } from '@angular/core';
import  {ApiService} from '../api.service';
import {ActivatedRoute,Router} from '@angular/router';
import {Team} from '../Team';
import { from } from 'rxjs';
import { forEach } from '@angular/router/src/utils/collection';
import { projection } from '@angular/core/src/render3';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  teams:Team[];
  constructor(public rest:ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getTeams();
  }
getTeams(){
  this.rest.GetTeams().subscribe((teams: {}) => {
    console.log(teams);
    this.teams=teams;
  });
}
onSaveId(name1,name2){
  localStorage.setItem("CurrentTeam",name1);
  localStorage.setItem("CurrTeamName",name2);
  console.log(name1,"Saved");
  location.replace('/Sprints');
}
}
