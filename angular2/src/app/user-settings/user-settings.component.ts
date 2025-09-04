import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { UserService} from '../services/user.service';
import {MonitoringService } from '../services/monitoring.service';
import { SetPass} from '../models/models';
import { User} from '../models/models';

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
        this.authenticationService.currentUser.subscribe((x :any) => this.currentUser = x);
    }
    
    ngOnInit() {
        this.setpass = new SetPass();
        this.settingsForm = this.formBuilder.group({
            old_password: this.formBuilder.control('', [Validators.required]),
            password: this.formBuilder.control('', [Validators.required]),
            confirmPass: this.formBuilder.control('')}
           , { validator: this.checkPasswords 
           });
        this.deleteForm= this.formBuilder.group({
            password: this.formBuilder.control('', [Validators.required]),
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
                (data : any) => {
                    this.monitoringService.reset(); //has to be here to avoid interdependency
                    this.authenticationService.logout();
                    this.success = true;
                },
                (error : any) => {
                    console.log(error); 
                    this.loading = false;
                    this.unknownerror = true;
                }
                );
    }
    
    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = undefined
     if (group.get('password') != null) {
        pass = group.get('password').value;
     }
     let confirmPass = undefined
     if (group.get('confirmPass') != null) {
        group.get('confirmPass').value
     }
    return pass === confirmPass ? null : { notSame: true }     
    }
    
    get fd() { return this.deleteForm.controls; }
    
    deleteAccount(){
        this.delete_submitted = true;
        this.delete_success= false;
        this.delete_unknownerror = false;
    
        this.userService.delete()
        .subscribe(
                (data : any) => {
                    this.delete_success= true;
                },
                (error : any) => {
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
