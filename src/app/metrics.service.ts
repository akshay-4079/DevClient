import { Injectable } from '@angular/core';
import  {ApiService} from './api.service';
import * as CanvasJS from './../assets/Graph/CanvasJS.min';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
inc:any
  dates:any;
avgEV:any;
data:any;
array:[];
data1=[];
EV=[];
ET=[];
AT=[];
RT=[];
ev=[];
et=[];
at=[];
rt=[];
  constructor(public rest:ApiService) { }

  ngOnInit() {
 
  }
 drawChart(){
  
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

public  getData(id1)
{

  this.rest.RetrieveDates().subscribe((dates: {}) => {
  
      this.dates= dates;
  });
    this.rest.RetrieveData().subscribe((data: {}) => {
  
 this.inc=data;
});
    var model=JSON.parse(localStorage.getItem("model"));

  

    var id=id1;
    this.data=model;
    var g=new Array;
    var d=[];
    
    for(var i=0;i<model.length;i++)
    {
      
      if(model[i][0].id==id1)
      {
      d=model[i][1];
      
    }
    else{
      continue;
    }
    }
    class filter{
    value=new Array;
    }
   var  ans=new Array
    for(var i=0;i<this.inc.length;i++)
    {
      var f1=new filter;
      for(var j=0;j<this.inc[i].value.length;j++){
        for(var k=0;k<d.length;k++){
        if(d[k].id==this.inc[i].value[j].id){
          f1.value.push(this.inc[i].value[j]);
        }
      }
    }
    ans.push(f1);
    }
 g=this.dates;
 
 
  var EffVar=0;
   var EV=[];
   var ET=[];
   var AT=[];
   var RT=[];
   var currentdate=1;
   var totaldays=JSON.parse(localStorage.getItem("duration"))+1;
   var totalEV=0;
   


   for(var i=0;i<ans.length;i++){
      if(i<=totaldays){
        var EstimatedTime=0;
        var ActualTime=0;
        var RemainingWork=0;
   for(var j=0;j<ans[i].value.length;j++){
    EstimatedTime =EstimatedTime+ ans[i].value[j].fields["Microsoft.VSTS.Scheduling.OriginalEstimate"];
   ActualTime=ActualTime +ans[i].value[j].fields["Microsoft.VSTS.Scheduling.CompletedWork"];
   RemainingWork=RemainingWork+ans[i].value[j].fields["Microsoft.VSTS.Scheduling.RemainingWork"]; 
   var mult=currentdate/totaldays;
    if(mult>1){
     mult=1;
   }
   }
    
    
     var mod=mult*EstimatedTime
     
     EffVar=(ActualTime-mod)/mod;
    
    if(EffVar&&EffVar!=Infinity){
    totalEV=totalEV+EffVar;
     }
    
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
       
    }
   this.avgEV=(totalEV/(totaldays));
  
  try{
 this.drawChart();
  }
  catch
  {

  }





  }
  getData2(id1){
    console.log(id1);
    this.getData(id1);
    var data=[];
    data.push(this.ET[this.ET.length-1])
    data.push(this.AT[this.AT.length-1])
    data.push(this.RT[this.RT.length-1])
    console.log(data);
    return data;
  }
}



