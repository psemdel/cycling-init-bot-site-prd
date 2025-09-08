import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first  } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { UserService} from '../services/user.service';

import {MatFormFieldModule} from '@angular/material/form-field';

@Component({ 
    templateUrl: 'forgotten-pass.component.html',
    imports : [MatFormFieldModule]
 })

export class ForgottenPassComponent implements OnInit {
    forgottenForm: FormGroup;
    loading = false;
    submitted = false;
    success = false;

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
        this.forgottenForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            }
           );
    }

    // convenience getter for easy access to form fields
    get f() { return this.forgottenForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.forgottenForm.invalid) {
           console.log("input not valid")
           return;
        }
        
        this.loading = true;
        this.userService.forgotten(this.forgottenForm.value)
            .pipe(
            first(),
           // catchError(this.handleerror)              
            )
            .subscribe({
                next: (data : any) => {
                    this.success = true;
                },
                error: (error : any) => {
                    console.log(error); 
                    this.loading = false;
                }
            });
    }

}