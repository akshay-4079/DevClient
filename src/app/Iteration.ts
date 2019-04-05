export class Iteration {
    constructor(
        public id:string,
        public name:string,
       public attributes:{
            finishDate:string,
            startDate:string
       }
    ){}
}