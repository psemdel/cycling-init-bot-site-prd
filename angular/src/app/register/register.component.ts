import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { throwError} from 'rxjs';
import { first, catchError  } from 'rxjs/operators';

import { AuthenticationService } from '@ser/authentication.service';
import { UserService} from '@ser/user.service';

@Component({ templateUrl: 'register.component.html' })

export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    success = false;
    useralready=false;
    unknownerror=false;

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
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
        //    wiki_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            username: ['', Validators.required],
            password: ['', [Validators.required]],
            confirmPass: ['']}
           , { validator: this.checkPasswords 
           });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            console.log("input not valid")
            error => {
                    console.log(error);
            }
           return;
        }
        
        this.useralready=false;
        this.loading = true;
        this.unknownerror=false;
        this.userService.register(this.registerForm.value)
            .pipe(
            first(),
           // catchError(this.handleerror)              
            )
            .subscribe(
                data => {
                    this.success = true;
                },
                error => {
                    console.log(error); 
                    this.loading = false;
                    this.unknownerror = true;
                }
                );
    }

    
    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
      let pass = group.get('password').value;
      let confirmPass = group.get('confirmPass').value;
    
      return pass === confirmPass ? null : { notSame: true }     
    }
}