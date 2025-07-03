import { AbstractControl, ValidationErrors } from "@angular/forms"

export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {

    // console.log(control);

    let value: string = control.value || '';

    if (!value) {
        return null
    }

    let upperCaseCharacters = /[A-Z]+/g
    if (upperCaseCharacters.test(value) === false) {
        // return { passwordStrength: `text has to contine Upper case characters,current value ${value}` };
        return { passwordStrength: `The password must contain at least: 1 uppercase letter` };
    }

    let lowerCaseCharacters = /[a-z]+/g
    if (lowerCaseCharacters.test(value) === false) {
        // return { passwordStrength: `text has to contine lower case characters,current value ${value}` };
        return { passwordStrength: `The password must contain at least: 1 lowercase letter` };

    }


    let numberCharacters = /[0-9]+/g
    if (numberCharacters.test(value) === false) {
        // return { passwordStrength: `text has to contine number characters,current value ${value}` };
        return { passwordStrength: `The password must contain at least: 1 number` };
    }

    if(value.length<8){
        return { passwordStrength: `The password must contain at least: 8 characters` };
    }

    // let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
    // if (specialCharacters.test(value) === false) {
    //     return { passwordStrength: `text has to contine special character,current value ${value}` };
    // }
    return null;
}