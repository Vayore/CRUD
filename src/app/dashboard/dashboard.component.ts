import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../Server/api.service';
import { CarModel } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  formValue !: FormGroup;
  CarModelObj : CarModel = new CarModel();
  CarData !:any;
  showAdd!:boolean;
  showUpdate!:boolean;

  constructor(private formbuilder: FormBuilder, 
    private api : ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      Id : [''],
      Make : [''],
      Model : [''],
      Year : [''],
      Mileage : ['']
    })
    this.getAllCars();
  }
  clickAddCar(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }
  postCarSpecs(){
    this.CarModelObj.Make = this.formValue.value.Make;
    this.CarModelObj.Model = this.formValue.value.Model;
    this.CarModelObj.Year = this.formValue.value.Year;
    this.CarModelObj.Mileage = this.formValue.value.Mileage;

    this.api.postCar(this.CarModelObj)
    .subscribe(res=>{
      console.log(res);
      alert("New Car added")
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllCars();
    },
    err=>{
      alert("The new car details are not saved, something went wrong");
    })
  }
  getAllCars(){
    this.api.getCar()
    .subscribe(res=>{
      this.CarData = res;
    })
  }
  deleteCar(row : any){
    this.api.deleteCar(row.id)
    .subscribe(res=>{
      alert("Car removed")
      this.getAllCars();
    })
  }
  onEdit(row: any){
    this.showAdd = false;
    this.showUpdate = true;
    this.CarModelObj.id = row.id;
    this.formValue.controls['Make'].setValue(row.Make);
    this.formValue.controls['Model'].setValue(row.Model);
    this.formValue.controls['Year'].setValue(row.Year);
    this.formValue.controls['Mileage'].setValue(row.Mileage);
  }
  updateCarSpecs(){
    this.CarModelObj.Make = this.formValue.value.Make;
    this.CarModelObj.Model = this.formValue.value.Model;
    this.CarModelObj.Year = this.formValue.value.Year;
    this.CarModelObj.Mileage = this.formValue.value.Mileage;


    this.api.updateCar(this.CarModelObj,this.CarModelObj.id)
    .subscribe(res=>{
      alert("Car specs updated successfully");
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllCars();

    })
  }
}
