import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first  } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { UserService} from '../services/user.service';

@Component({ templateUrl: 'register.component.html' ,
             styleUrls: ['./register.component.css']           
})

export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    success = false;
    useralready=false;
    backenderror=[];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            first_name: this.formBuilder.control('', [Validators.required]),
            last_name: this.formBuilder.control('', [Validators.required]),
        //    wiki_name: ['', Validators.required],
            email: this.formBuilder.control('', [Validators.required, Validators.email]),
            username: this.formBuilder.control('', [Validators.required]),
            password: this.formBuilder.control('', [Validators.required]),
            confirmPass: this.formBuilder.control('')}
           , { validator: this.checkPasswords 
           });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
           console.log("input invalid")
           return;
        }
        
        this.useralready=false;
        this.loading = true;
        this.backenderror=[];
        this.userService.register(this.registerForm.value)
            .pipe(
            first(),
            )
            .subscribe(
                (data : any) => {
                    this.success = true;
                },
                (error : any) => {
                    this.loading = false;
                    let keylist = Object.keys(error);
                    this.backenderror = error[keylist[0]]; 
                }
                );
    }

    
    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
      let pass = group.get('password').value;
      let confirmPass = group.get('confirmPass').value;
    
      if (pass === confirmPass){
          return null;
      }else{
          return { notSame: true };
      }
    }
}
