import { Component, OnInit } from '@angular/core';
import  {ApiService} from '../api.service';
import {ActivatedRoute,Router} from '@angular/router';
import {WorkItem} from '../WorkItem';
import { from } from 'rxjs';
import { forEach } from '@angular/router/src/utils/collection';
import { projection, template } from '@angular/core/src/render3';
import { isObject } from 'util';
import { toArray } from 'rxjs/operators';
import { ArrayType } from '@angular/compiler';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { MetricsService } from '../metrics.service';


@Component({
  selector: 'app-workitem',
  templateUrl: './workitem.component.html',
  styleUrls: ['./workitem.component.css']
})
export class WorkitemComponent implements OnInit {
rel:{};
outputs:[];
keys:any;
finalkeys:any;
values:any;
sprints:any;
currIter:string;
currTeam:string;
currProject:string;
model:any
constructor(public rest:ApiService,public rest2:MetricsService, private route: ActivatedRoute, private router: Router) { }
ngOnInit(){ 
  this.currIter=localStorage.getItem("IterationName");
  this.currProject=localStorage.getItem("CurrProName");
  this.currTeam=localStorage.getItem("CurrTeamName");
  this.getSprints();
  this.getWorkItems();   
  this.drawChart();
  }
getSprints(){
  this.rest.GetSprints().subscribe((obj:string)=>{
  
  this.sprints=obj; 
   

  });
  


}
getWorkItems(){
  this.rest.GetRelation().subscribe((obj:string)=>{
  
  var fin=JSON.parse(obj);
  
  this.rel=fin;
  var keys=new Array;
  
  for(var key in fin){
    keys.push([key,fin[key]]);
    
  }
    this.keys=keys;

});
  
  this.rest.GetWorkItems().subscribe((obj:string) => {
    
    var obj1=JSON.parse(obj);
    
    function Temp(first,second,third){
      this.id=first;
      this.rev=second;
      this.fields=third;
    }
    var model=new Array;
   
    var items=new Array;
    for(var i=0;i<this.keys.length;i++)
    {
      for(var j=0;j<obj1.value.length;j++){
        
        if(this.keys[i][0]==obj1.value[j].id){
          var story=new Temp(obj1.value[j].id,obj1.value[j].rev,obj1.value[j].fields)
          
      
          var items=new Array;
          for(var k=0;k<this.keys[i][1].length;k++){
            for(var l=0;l<obj1.value.length;l++){
              if(this.keys[i][1][k]==obj1.value[l].id){
                
              
                var temp=new Temp(obj1.value[l].id,obj1.value[l].rev,obj1.value[l].fields)
                 items.push(temp);
              }
            }
          }
           model.push([story,items]);
          
        }
      }

        
    }
    //@ts-ignore 
    this.outputs=model;
    
    localStorage.setItem("model",JSON.stringify(model));
  });
  
}
onDrop(id,name,d1,d2){
  localStorage.setItem("IterationId",id);
  localStorage.setItem("IterationName",name);
  var datestart=new Date(d2);
  var datefin=new Date(d1);
  
  
  //@ts-ignore 
  var moment = require('moment-business-days');
  var diff=moment(datefin).businessDiff(moment(datestart));
  
  localStorage.setItem("duration",JSON.stringify(diff));
  location.reload();
}
onSaveId(id){
  
  var n = id.toString();
  localStorage.setItem("currentTask",n)
  location.replace('/Metrics')
}
onSaveId1(id1){

this.model=this.rest2.getData(id1);

}
drawChart(){

}
}
