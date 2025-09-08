import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first  } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { UserService} from '../services/user.service';
import {FuncsService} from '../models/functions';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

@Component({ templateUrl: 'register.component.html' ,
             styleUrls: ['./register.component.css'],
            imports : [MatFormFieldModule, MatSelectModule]         
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
        private funcs: FuncsService
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
           , { validator: this.funcs.checkPasswords 
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
            .subscribe({
                next: (data : any) => {
                    this.success = true;
                },
                error: (error : any) => {
                    this.loading = false;
                    let keylist = Object.keys(error);
                    this.backenderror = error[keylist[0]]; 
                }
            })};
    }
