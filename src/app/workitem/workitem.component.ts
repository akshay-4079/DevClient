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
constructor(public rest:ApiService, private route: ActivatedRoute, private router: Router) { }
ngOnInit(){ 
  this.getWorkItems();   
  }
getWorkItems(){
  this.rest.GetRelation().subscribe((obj:string)=>{
  console.log(obj);
  var fin=JSON.parse(obj);
  console.log(fin);
  this.rel=fin;
  var keys=new Array;
  
  for(var key in fin){
    keys.push([key,fin[key]]);
    console.log(keys);
  }
    this.keys=keys;

});
  
  this.rest.GetWorkItems().subscribe((obj:string) => {
    console.log(obj);
    var obj1=JSON.parse(obj);
    console.log(obj1.value);
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
                console.log(this.keys[i][1][k]);
              
                var temp=new Temp(obj1.value[l].id,obj1.value[l].rev,obj1.value[l].fields)
                 items.push(temp);
              }
            }
          }
           model.push([story,items]);
        }
      }

        
    }
    this.outputs=model;
    console.log(model);
  });
  
}
onSaveId(id){
  var n = id.toString();
  localStorage.setItem("currentTask",n)
  location.replace('/Metrics')
}
}
