import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@ser/authentication.service';
import { UserService} from '@ser/user.service';
import {MonitoringService } from '@ser/monitoring.service';
import { SetPass} from '@app/models/models';
import { User} from '@app/models/models';

@Component({ templateUrl: 'user-settings.component.html' })

export class UserSettingsComponent implements OnInit {
    settingsForm: FormGroup;
    
    loading = false;
    submitted = false;
    success = false;
    useralready=false;
    unknownerror=false;
    setpass:SetPass;
    
    currentUser: User;
    
    deleteForm: FormGroup;
    delete_success= false;
    delete_submitted = false;
    delete_unknownerror=false;
 
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private monitoringService: MonitoringService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }
    
    ngOnInit() {
        this.setpass = new SetPass();
        this.settingsForm = this.formBuilder.group({
            old_password: ['', [Validators.required]],
            password: ['', [Validators.required]],
            confirmPass: ['']}
           , { validator: this.checkPasswords 
           });
        this.deleteForm= this.formBuilder.group({
            password: ['', [Validators.required]],
           //},
           // {validator: this.checkUsername.bind(this)    username: ['',  [Validators.required]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.settingsForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.settingsForm.invalid) {
            console.log("input not valid")
            error => {
                    console.log(error);
            }
           return;
        }
        
        this.useralready=false;
        this.loading = true;
        this.unknownerror=false;
        
        this.setpass.new_password=this.settingsForm.controls['password'].value;
        this.setpass.re_new_password=this.settingsForm.controls['confirmPass'].value;
        this.setpass.current_password=this.settingsForm.controls['old_password'].value;
        
        this.userService.changePass(this.setpass)
            .pipe(
            first(),
           // catchError(this.handleerror)              
            )
            .subscribe(
                data => {
                    this.monitoringService.reset(); //has to be here to avoid interdependency
                    this.authenticationService.logout();
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
    
    get fd() { return this.deleteForm.controls; }
    
    deleteAccount(){
        this.delete_submitted = true;
        this.delete_success= false;
        this.delete_unknownerror = false;
    
        this.userService.delete()
        .subscribe(
                data => {
                    this.delete_success= true;
                },
                error => {
                    console.log(error); 
                    this.delete_unknownerror = true;
                }
                );
    }
    
    //checkUsername(group: FormGroup) { // here we have the 'passwords' group
   //   let username = group.get('username').value;
    
   //   return username ===  this.currentUser.username ? null : { notSame: true }     
   // }
}
