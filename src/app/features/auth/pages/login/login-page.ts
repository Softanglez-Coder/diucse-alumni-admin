import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputText } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

@Component({
    selector: 'login-page',
    templateUrl: './login-page.html',
    styleUrl: './login-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
      ReactiveFormsModule,
      InputText,
      MessageModule,
      ButtonModule,
      PasswordModule
    ]
})
export class LoginPage {
    protected exampleForm = new FormGroup({
        username: new FormControl('', {
            validators: [
                Validators.required
            ]
        }),
        password: new FormControl('', {
            validators: [
                Validators.required,
                Validators.minLength(6)
            ]
        }),
    });

    isInvalid(property: string) {
        const control = this.exampleForm.get(property);
        return control?.invalid && (control.dirty || control.touched);
    }

    onSubmit() {
        if (this.exampleForm.valid) {
            console.log('Form Submitted!', this.exampleForm.value);
        } else {
            console.log('Form is invalid');
        }
    }
}
