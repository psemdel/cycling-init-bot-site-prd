import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { throwError} from 'rxjs';
import { first, catchError  } from 'rxjs/operators';

import { UserService} from '@ser/user.service';

@Component({ templateUrl: 'resend-activation-email.component.html' })

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
            error => {
                    console.log(error);
            }
           return;
        }
        
        this.loading = true;
        this.userService.resendEmail(this.forgottenForm.value)
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
                }
                );
    }

}