import { Component } from '@angular/core';
import { OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ElementRef, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ThemePalette} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];

}

interface Animal {
  name: string;
  sound: string;
}



/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit  {
  title = 'gform';


  afuConfig = {
    uploadAPI: {
      url:"https://example-file-upload-api"
    }
};


  handleWarningAlert() {

    Swal.fire({
      title: 'Are you sure?',
  text: "You won't be able to make changes,Once you are done!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes,Continue!'
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire(
      'Success!',
      'Your Response has been Recorded.',
      'success'
    )
  }
    })

  }

  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
   subtasks: [
     {name: 'Accounting', completed: false, color: 'primary'},
     {name: 'Business and Finance', completed: false, color: 'primary'},
     {name: 'Human Resource', completed: false, color: 'primary'},
     {name: 'Data Analyst', completed: false, color: 'primary'},
     {name: 'Sytem Engineer', completed: false, color: 'primary'},
     {name: 'Programming Analyst', completed: false, color: 'primary'},
     {name: 'Software Developer', completed: false, color: 'primary'},
    ]
  };

  allComplete: boolean = false;

 updateAllComplete() {
   this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
 }

 someComplete(): boolean {
   if (this.task.subtasks == null) {
     return false;
   }
   return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
 }

 setAll(completed: boolean) {
   this.allComplete = completed;
   if (this.task.subtasks == null) {
     return;
   }
   this.task.subtasks.forEach(t => t.completed = completed);
}

  visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl();
    filteredFruits: Observable<string[]>;
    fruits: string[] = ['Ex.C programming'];
    allFruits: string[] = ['C programming','Operating Systems', 'VLSI', 'Electronic Devices', 'Thermodynamics', 'Smart Cities','Elements of CAD','Analog Circuits','Fluid Mechanics','Planning and Arch'];

    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;



    add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        if(this.allFruits.indexOf(value) > -1){
         this.fruits.push(value.trim());
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
      this.autocomplete.closePanel();
    }

    remove(fruit: string): void {
      const index = this.fruits.indexOf(fruit);

      if (index >= 0) {
        this.fruits.splice(index, 1);
      }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
      this.fruits.push(event.option.viewValue);
      this.fruitInput.nativeElement.value = '';
      this.fruitCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();

      return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
    }

  animalControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  animals: Animal[] = [
    {name: 'CSE', sound: 'Hyderabad'},
    {name: 'IT', sound: 'Vizag'},
    {name: 'ECE', sound: 'Mumbai'},
    {name: 'EEE', sound: 'Bangalore'},
    {name: 'MECH', sound: 'Chennai'},
    {name: 'CIV', sound: 'Trivandrum'},
    {name: 'AME', sound: 'New Delhi'},
  ];
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

}
