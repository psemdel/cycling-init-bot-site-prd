import { Subscription } from 'rxjs/Subscription';

export class BotRequest {
    id: number;
    author: number;
    author_name: string;
    entry_time: Date;
    process_start_time: Date;
    process_end_time: Date;
    status: string;
    routine: string;
    item_id: string;
    request_text: string;
    log: string;
    //to be brought to CreateRiderRequest
    nationality: string; 
    name: string;
    gender: string;
    //classification import
    classification_type: number;
    //all champs
    year: number;
    //one champ
    year_begin: number;
    year_end: number;
    //start_list
    time_of_race: Date; 
    race_type: boolean;
    chrono: boolean;
    moment: boolean;
    force_nation_team: boolean;
    //race
    end_of_race: Date;  
    create_stages: boolean; 
    race_class: string;  
    prologue: boolean;
    last_stage: number;  
    edition_nr: number;
    //team
    UCIcode: string;
    result_id: string;
    //sort
    prop: number; //property may be protected word
    
}

export class FileUploadModel {
      author: number;
      data: File;
      state: string;
      inProgress: boolean;
      progress: number;
      canRetry: boolean;
      canCancel: boolean;
      sub?: Subscription;
}

//only to display info, token are separate
export class User {
    id: number;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    wiki_name: string;
    email: string;
    level: boolean;
}

export class SetPass {
  new_password: string;
  re_new_password: string;
  current_password: string;  
}
