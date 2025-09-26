import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first  } from 'rxjs/operators';

import { UserService} from '../services/user.service';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({ 
    templateUrl: 'resend-activation-email.component.html',
    imports : [
        MatFormFieldModule, 
        MatSelectModule, 
        ReactiveFormsModule, 
        RouterLink,
        MatButtonModule
    ]
 })

export class ResendActivationEmailComponent implements OnInit {
    forgottenForm: FormGroup;
    loading = false;
    submitted = false;
    success = false;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.forgottenForm = this.formBuilder.group({
            email: this.formBuilder.control('', [Validators.required, Validators.email]),
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
        this.userService.resendEmail(this.forgottenForm.value)
            .pipe(
            first(),
           // catchError(this.handleerror)              
            )
            .subscribe(
                (data : any) => {
                    this.success = true;
                },
                (error : any) => {
                    console.log(error); 
                    this.loading = false;
                }
                );
    }

}