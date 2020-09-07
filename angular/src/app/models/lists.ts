interface Nationality {
  value: string;
  viewValue: string;
}

export const nationalities: Nationality[] = [
    {value: 'BEL', viewValue: 'Belgium'},
    {value: 'ITA', viewValue: 'Italy'},
    {value: 'FRA', viewValue: 'France'},
    {value: 'COL', viewValue: 'Colombia'},
    {value: 'NED', viewValue: 'Netherlands'},
    {value: 'GER', viewValue: 'Germany'},
    {value: 'SLO', viewValue: 'Slovenia'},
    {value: 'AUS', viewValue: 'Australia'},
    {value: 'ESP', viewValue: 'Spain'},
    {value: 'DEN', viewValue: 'Danemark'},
    {value: 'GBR', viewValue: 'Great-Britain'},
    {value: 'NOR', viewValue: 'Norway'},
    {value: 'SUI', viewValue: 'Switzerland'},
    {value: 'RUS', viewValue: 'Russia'},
    {value: 'AUT', viewValue: 'Austria'},
    {value: 'IRL', viewValue: 'Ireland'},
    {value: 'KAZ', viewValue: 'Kazakhstan'},
    {value: 'POL', viewValue: 'Poland'},
    {value: 'ECU', viewValue: 'Ecuador'},
    {value: 'SVK', viewValue: 'Slovakia'}, //top 20
    {value: 'ALG', viewValue: 'Algeria'},
    {value: 'ARG', viewValue: 'Argentina'},
    {value: 'BLR', viewValue: 'Belarus'},
    {value: 'BRA', viewValue: 'Brasil'},
    {value: 'CAN', viewValue: 'Canada'},
    {value: 'CRC', viewValue: 'Costa Rica'},
    {value: 'CRO', viewValue: 'Croatia'},
    {value: 'CUB', viewValue: 'Cuba'},
    {value: 'CZE', viewValue: 'Czech Republic'},
    {value: 'ERI', viewValue: 'Eritrea'},
    {value: 'EST', viewValue: 'Estonia'},
    {value: 'FIN', viewValue: 'Finland'},
    {value: 'GRE', viewValue: 'Greece'},
    {value: 'HUN', viewValue: 'Hungary'},
    {value: 'JAP', viewValue: 'Japan'},
    {value: 'LAT', viewValue: 'Latvia'},
    {value: "LTU", viewValue: 'Lithuania'},
    {value: 'LUX', viewValue: 'Luxembourg'},
    {value: 'MOC', viewValue: 'Morocco'}, //to check
    {value: 'NZL', viewValue: 'New-Zealand'},
    {value: 'POR', viewValue: 'Portugal'},
    {value: 'ROM', viewValue: 'Romania'},
    {value: 'RSA', viewValue: 'South-Africa'},
    {value: "SWE", viewValue: 'Sweden'},
    {value: 'TUR', viewValue: 'Turkey'},
    {value: 'UKR', viewValue: 'Ukraine'},
    {value: 'USA', viewValue: 'USA'},
    {value: 'VEN', viewValue: 'Venezuela'},
  ];

interface Gender {
  value: string;
  viewValue: string;
}

export const genders: Gender[] = [
    {value: 'man', viewValue: 'Man'},
    {value: 'woman', viewValue: 'Woman'},
  ];
  
interface Category {
  value: string;
  viewValue: string;
}

export const categories: Category[] = [
    {value: 'man', viewValue: 'Man Elite'},
    {value: 'woman', viewValue: 'Woman Elite'},
    {value: 'manU', viewValue: 'Man U23 (not implemented yet)'},
    {value: 'womanU', viewValue: 'Woman U23 (not implemented yet)'},   
    {value: 'manJ', viewValue: 'Man juniors (not implemented yet)'},
    {value: 'womanJ', viewValue: 'Woman juniors (not implemented yet)'},  
    {value: 'all', viewValue: 'All (not implemented yet)'},   
    {value: 'both', viewValue: 'Man and Woman Elite'},     
  ];  
  

interface RaceType {
  value: boolean;
  viewValue: string;
}
  
export const race_types: RaceType[] = [
    {value: false, viewValue: 'Single day race'},
    {value: true, viewValue: 'Stage race'},
];

interface Yesno {
  value: boolean;
  viewValue: string;
}

export const yesnos: Yesno[] = [
{value: true, viewValue: 'yes'},
{value: false, viewValue: 'no'},
];
  
interface RaceClass {
  value: string;
  viewValue: string;
}
  
export const race_1x_classes: RaceClass[] = [
    {value: "1.HC", viewValue: 'UCI 1.HC'},
    {value: "1.1", viewValue: 'UCI 1.1'},
    {value: "1.2", viewValue: 'UCI 1.2'},
    {value: "UWT.1", viewValue: 'UWT 1'},
    {value: "WWT.1", viewValue: 'WWT 1'},
  ];
  
export const race_2x_classes: RaceClass[] = [
    {value: "2.HC", viewValue: 'UCI 2.HC'},
    {value: "2.1", viewValue: 'UCI 2.1'},
    {value: "2.2", viewValue: 'UCI 2.2'},
    {value: "UWT.2", viewValue: 'UWT 2'},
    {value: "WWT.2", viewValue: 'WWT 2'},
  ];
  
export var dic_of_routines: {[id :string] :string;} = {};
dic_of_routines['create_rider']="rider creation";
dic_of_routines['import_classification']="import of a classification";
dic_of_routines['national_all_champs']="creation of championships";
dic_of_routines['national_one_champ']="creation of championships";
dic_of_routines['start_list']="importation of start list";
dic_of_routines['race']="race creation";
dic_of_routines['stages']="stages creation";
dic_of_routines['team']="team season creation";
dic_of_routines['UCIranking']="importation of UCI ranking";
dic_of_routines['sort_date']="sorting";
dic_of_routines['sort_name']="sorting";

export interface Message {
  type: string;
  text: string;
}