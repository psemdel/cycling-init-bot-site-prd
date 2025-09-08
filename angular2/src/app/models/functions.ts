import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BotRequest, User} from '../models/models';

@Injectable({
  providedIn: 'root'
})

export class FuncsService {
  constructor() { }
  
  copy_from_to_bot_request(rf : FormGroup, botrequest: BotRequest, currentUser: User | null){

      Object.keys(rf.controls).forEach((key : string) => {
        if (key in BotRequest){       
          (botrequest as any)[key]=rf.controls[key].value;
        }
        else{
          throw Error('invalid key by botrequest'); 
        }
      });

    if (currentUser !== null){
      botrequest.author=currentUser.id;
    }
    else {
      botrequest.author=0
    }

     return botrequest
    }

  checkYear(group: FormGroup) { 
      if (group !== null){
        let year_begin=null
        let year_begin_raw=group.get('year_begin')

        if ( year_begin_raw!== null){
           year_begin= year_begin_raw.value;
        }

        let year_end=null
        let year_end_raw=group.get('year_end')

        if (year_end_raw !== null){
          year_end = year_end_raw.value;
        }
 
        return year_begin <= year_end ? null : { notOk: false }   
      }
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = undefined
    let pass_raw=group.get('password')
     if ( pass_raw!== null) {
        pass = pass_raw.value;
     }
     let confirmPass = undefined
     let confirmPass_raw=group.get('confirmPass')
     if ( confirmPass_raw!== null) {
        confirmPass=confirmPass_raw.value
     }
    return pass === confirmPass ? null : { notSame: true }     
    }

}