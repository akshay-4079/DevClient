import { Component, OnInit } from '@angular/core';
import  {ApiService} from '../api.service';
import {ActivatedRoute,Router} from '@angular/router';
import { currentId } from 'async_hooks';
import * as CanvasJS from '../../assets/Graph/CanvasJS.min';

import { stringify } from 'querystring';
@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {
dates:any;
avgEV:any;
data:any;
array:[];
data1=[];
EV=[];
ET=[];
AT=[];
RT=[];
  constructor(public rest:ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getDates();
    this.getData();
    
  }
 drawChart(){
  var name=this.data1[0].fields["System.Title"];
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
  
    var data4=new datapoint2;
    data4.y=this.EV[i];
    var data5=new datapoint2;
    data5.y=100*this.avgEV;
    datapoints4.push(data4);
    console.log(this.avgEV);
    datapoints5.push(data5);
  
   
      var data=new datapoint;
      var data2=new datapoint;
      var data3=new datapoint;
      
    data.y=this.ET[i];
    data2.y=this.AT[i];
    data3.y=this.RT[i];
  
    
    datapoints1.push(data);
    datapoints2.push(data2);
    datapoints3.push(data3)
    
 
}
  for(var j=0;j<this.ET.length;j++){
    datapoints5[j].label=this.dates[j];
    datapoints4[j].label=this.dates[j];
    datapoints1[j].label=this.dates[j];
    datapoints2[j].label=this.dates[j];
    datapoints3[j].label=this.dates[j];
  
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
      type: "area",
      name: "Effort Variance",
      legendText: "Effort Variance",
      axisYType: "secondary",
      showInLegend: true, 
      dataPoints:datapoints4,
    },
    {
      type: "line",
      name: " Average Effort Variance",
      legendText: "Average Effort Variance",
      axisYType: "secondary",
      showInLegend: true, 
      dataPoints:datapoints5,
    },
  ]
  });
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
getDates(){
  this.rest.RetrieveDates().subscribe((dates: {}) => {

    this.dates=dates;
});
}
getData(){
  this.rest.RetrieveData().subscribe((data: {}) => {

    var task=localStorage.getItem("currentTask");
    var id=parseInt(task);
    this.data=data;
    var g=new Array;
    var d=[];
    for(var i=0;i<this.data.length;i++)
    {
      for(var j=0;j<this.data[i].value.length;j++){
        if(this.data[i].value[j].id==id){
          g.push(this.data[i].value[j]);

        }
      }
    }
    this.data1=g;
    
   var EffVar=0;
   var EV=[];
   var ET=[];
   var AT=[];
   var RT=[];
   var currentdate=1;
   var totaldays=JSON.parse(localStorage.getItem("duration"))+1;
   var totalEV=0;
   console.log(totaldays);
   console.log(g.length);
   for(var i=0;i<g.length;i++){
    if(i<=totaldays){
    var EstimatedTime=  g[i].fields["Microsoft.VSTS.Scheduling.OriginalEstimate"];
    var ActualTime= g[i].fields["Microsoft.VSTS.Scheduling.CompletedWork"];
    var RemainingWork=g[i].fields["Microsoft.VSTS.Scheduling.RemainingWork"]; 
    var mult=currentdate/totaldays;
    if(mult>1){
      mult=1;
    }
    console.log(EstimatedTime,"Et");
    console.log(mult,"mult")
    var mod=mult*EstimatedTime
    console.log(mod,"mod");
    EffVar=(ActualTime-mod)/mod;
    console.log(EffVar);
    if(EffVar&&EffVar!=Infinity){
    totalEV=totalEV+EffVar;
    }
    console.log(totalEV);
    ET.push(EstimatedTime*mult);
    AT.push(ActualTime);
    RT.push(RemainingWork);
    EV.push(EffVar*100);
    currentdate++;
    
   }
  }
    this.EV=EV;
    this.ET=ET;
    this.AT=AT;
    this.RT=RT;
    if(g.length<=totaldays){
      this.avgEV=totalEV/(g.length-1);
      console.log('yes');
    }
    this.avgEV=(totalEV/(totaldays));
    console.log(ET);
    console.log(this.avgEV);
    this.drawChart();
});
}
}
