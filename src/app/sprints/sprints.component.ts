import { Component, OnInit } from '@angular/core';
import  {ApiService} from '../api.service';
import {ActivatedRoute,Router} from '@angular/router';
import {Iteration} from '../Iteration';
import { from } from 'rxjs';
import { forEach } from '@angular/router/src/utils/collection';
import { projection } from '@angular/core/src/render3';
import { MetricsService } from '../metrics.service';
import * as CanvasJS from '../../assets/Graph/CanvasJS.min';

@Component({
  selector: 'app-sprints',
  templateUrl: './sprints.component.html',
  styleUrls: ['./sprints.component.css']
})
export class SprintsComponent implements OnInit {
iterations:Iteration[];
ProjName:string;
rel:any;
keys:any;
TeamName:string;
projects:any;
 ET:any;
 AT:any;
 RT:any;
 avgEV:any;
 EV:any;
  constructor(public rest:ApiService,public rest2:MetricsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    
    this.TeamName=localStorage.getItem("CurrTeamName")
    if(!this.TeamName){
      this.TeamName="Select A Team"
    }
    this.ProjName=localStorage.getItem("CurrProName")
    this.getTeams();
    this.getOverview();
    this.getSprints();

  }
  drawChart(){
   console.log(this.EV);
    class datapoint{
      label:string;
      y:number;
  
    }
    class datapoint2{
      x:string;
      y:number;
  
    }
  
    var datapoints1=[];
    var datapoints2=[];
    var datapoints3=[];
    var datapoints4=[];
    var datapoints5=[];
    for(var i=0;i<this.ET.length;i++){

       
     
        var data=new datapoint;
        var data2=new datapoint;
        var data3=new datapoint;
        var data4=new datapoint2;
      data4.y=this.EV[i]*100;
      data.y=this.ET[i];
      data2.y=this.AT[i];
      data3.y=this.RT[i];
    
      
      datapoints1.push(data);
      datapoints2.push(data2);
      datapoints3.push(data3);
      datapoints4.push(data4);
   
  }
    for(var j=0;j<this.ET.length;j++){
     
      datapoints1[j].label=this.iterations[j].name;
      datapoints2[j].label=this.iterations[j].name;
      datapoints3[j].label=this.iterations[j].name;
      datapoints4[j].label=this.iterations[j].name;;
    
  }
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
    
      title:{
        text: name
        
      },	
      axisY: {
        title: "Hours",
        titleFontColor: "#4F81BC",
        lineColor: "#4F81BC",
        labelFontColor: "#4F81BC",
        tickColor: "#4F81BC"
      },
    
      toolTip: {
        shared: true
      },
      legend: {
        cursor:"pointer",
        itemclick: toggleDataSeries
      },
      data: [{
        type: "column",
        name: "Estimated Work",
        legendText: "Estimated Work",
        showInLegend: true, 
        dataPoints:datapoints1,
      },
    
      {
        type: "column",	
        name: "Work Done",
        legendText: "Work Done",
       
        showInLegend: true,
        dataPoints:datapoints2
      },
      {
        type: "column",	
        name: "Remaining Work",
        legendText: "Remaining Work",
        
        showInLegend: true,
        dataPoints:datapoints3
      },
      {
        type: "line",
        name: "Effort Variance",
        legendText: "Effort Variance",
        axisYType: "secondary",
        showInLegend: true, 
        dataPoints:datapoints4,
      },
    
    ]
    });
    console.log(datapoints4)
    chart.render();
    
    function toggleDataSeries(e) {
      if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      }
      else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }
    
  
  
  
   }
  getOverview(){
   
    this.rest.SprintOverviewData().subscribe((overviews: []) => {
    var data=[];
     for(var i=0;i<overviews.length;i++){
      data.push(JSON.parse(overviews[i]));
     }
 
     console.log(data);
     var ET=[];
     var AT=[];
     var RT=[];
     var EV=[];
     for(var i=0;i<data.length;i++){
      
      var et=0;
      var at=0;
      var rt=0;
      var ev=0;

      if(data[i].value){
      for(var j=0;j<data[i].value.length;j++){
        if(data[i].value[j].fields["Microsoft.VSTS.Scheduling.OriginalEstimate"] && data[i].value[j].fields["Microsoft.VSTS.Scheduling.CompletedWork"]){
        et=et+data[i].value[j].fields["Microsoft.VSTS.Scheduling.OriginalEstimate"];
        at=at+ data[i].value[j].fields["Microsoft.VSTS.Scheduling.CompletedWork"]; 
      if(data[i].value[j].fields["Microsoft.VSTS.Scheduling.RemainingWork"]){
        rt=rt+data[i].value[j].fields["Microsoft.VSTS.Scheduling.RemainingWork"];
      }
      else{
        rt=rt+0;
      }
      }
     
      
      }
    }
      ev=(at-et)/et;
      ET.push(et);
      AT.push(at);
      RT.push(rt);
      EV.push(ev);
     }
     this.ET=ET;
     this.RT=RT;
     this.AT=AT;
     this.EV=EV;
     this.drawChart();
    });
  }
  
getSprints(){
  this.rest.GetSprints().subscribe((iterations: {}) => {
    
    //@ts-ignore 
    this.iterations=iterations;
  });
}
getTeams(){
  this.rest.GetTeams().subscribe((projects: {}) => {
    
    //@ts-ignore; 
    this.projects=projects;
  });
}
onSaveId(id,name,d1,d2){
  localStorage.setItem("IterationId",id);
  localStorage.setItem("IterationName",name);
  var datestart=new Date(d2);
  var datefin=new Date(d1);
  
  
  //@ts-ignore 
  var moment = require('moment-business-days');
  var diff=moment(datefin).businessDiff(moment(datestart));
  
  localStorage.setItem("duration",JSON.stringify(diff));
  location.replace('/WorkItems');
}

setIter(id,name,d1,d2){
  console.log("asas");
  localStorage.setItem("IterationId",id);
  localStorage.setItem("IterationName",name);
  var datestart=new Date(d2);
  var datefin=new Date(d1);
  
  
  //@ts-ignore 
  var moment = require('moment-business-days');
  var diff=moment(datefin).businessDiff(moment(datestart));
  
  localStorage.setItem("duration",JSON.stringify(diff));
}

onDropId(id,id2){
 
    localStorage.setItem("CurrentTeam",id);
    localStorage.setItem("CurrTeamName",id2);
    
    location.reload();
  
 }



}
