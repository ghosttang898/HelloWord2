import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // @Input() usersFromHomeComponent: any;
  @Output() canncelRegister = new EventEmitter();
  // mode: any = {};
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.intitializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  intitializeForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  // intitializeForm() {
  //   this.registerForm = new FormGroup({
  //     username: new FormControl('Hey', Validators.required),
  //     password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
  //     confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
  //   })
  //   this.registerForm.controls.password.valueChanges.subscribe(() => {
  //     this.registerForm.controls.confirmPassword.updateValueAndValidity();
  //   })
  // }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null : { isMatching: true }
    }
  }

  register() {
    // console.log(this.registerForm);
    this.accountService.register(this.registerForm.value).subscribe(response => {
      // console.log(response);
      // this.cancel();
      this.router.navigateByUrl('/members');
    }, error => {
      // console.log(error);
      // this.toastr.error(error.error);
      this.validationErrors = error;
    })
  }

  cancel() {
    // console.log('Canceled!!');
    this.canncelRegister.emit(false);
  }

}
