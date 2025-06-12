import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { firstValueFrom, map, Observable, startWith } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { IUserForm } from '../../interfaces/IUser';
import { UserInfoService } from '../../services/UserInfo/user-info.service';
import { duiValidator } from '../../validators/duiValidator/duiValidator';
import { LoadingService } from '../../services/Loading/loading.service';
@Component({
  selector: 'app-user-profile-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatInputModule,
    MatNativeDateModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './user-profile-form.component.html',
  styleUrl: './user-profile-form.component.scss',
})
export class UserProfileFormComponent implements OnInit {
  dui: string = '';
  allHobbies: string[] = [
    'Jugar Futbol',
    'Jugar Basketball',
    'Jugar Tenis',
    'Jugar Volleyball',
    'Jugar Ping Pong',
    'Jugar Videojuegos',
  ];
  hobbies: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  isAdult: boolean = false;
  maxDate: Date;

  userForm!: FormGroup<IUserForm>;
  hobbieCtrl = new FormControl('');
  errorMessage = '';

  fb = inject(FormBuilder);
  announcer = inject(LiveAnnouncer);
  private userService = inject(UserInfoService);
  private loadingService = inject(LoadingService);

  filteredHobbies!: Observable<string[]>;

  @ViewChild('hobbieInput') hobbieInput!: ElementRef<HTMLInputElement>;

  constructor(){
    const today = new Date();
    const yearsAgo = 2;
    this.maxDate = new Date(today.getFullYear() - yearsAgo, today.getMonth(), today.getDate());

  }
  ngOnInit() {
    this.userForm = this.fb.nonNullable.group({
      name: this.fb.nonNullable.control('', [
        Validators.required,
      ]),
      birthday: this.fb.nonNullable.control('', [Validators.required]),
      dui: this.fb.nonNullable.control('', [duiValidator]),
      minority_card: this.fb.nonNullable.control('')
    });
    this.userForm.get('birthday')?.valueChanges.subscribe(value => {
      this.isAdult = this.translateDateToYears(value as string).isAdult
      const duiControl = this.userForm.get('dui');
      const carnetControl = this.userForm.get('minority_card');

      if (this.isAdult) {
        duiControl?.setValidators([Validators.required, duiValidator]);
        carnetControl?.clearValidators();
        carnetControl?.reset();
      } else {
        duiControl?.clearValidators();
        duiControl?.reset();
      }

      duiControl?.updateValueAndValidity();
      carnetControl?.updateValueAndValidity();
    })

    this.filteredHobbies = this.hobbieCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allHobbies.slice()
      )
    );
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our hobbie
    if (value) {
      this.hobbies.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.hobbieCtrl.setValue(null);
  }

  remove(hobbie: string): void {
    const index = this.hobbies.indexOf(hobbie);
    if (index >= 0) {
      this.hobbies.splice(index, 1);
    }
  }

  selected(hobbie: string): void {
    if (this.hobbies.length === 0) {
      this.hobbies.push(hobbie);
      this.hobbieInput.nativeElement.value = '';
      this.hobbieCtrl.setValue(null);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allHobbies.filter((hobbie) =>
      hobbie.toLowerCase().includes(filterValue)
    );
  }

  onDuiInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    // Eliminate everything that is not a number
    const numbersOnly = input.replace(/\D/g, '');

    // Limit to 9 digits maximum
    const trimmed = numbersOnly.slice(0, 9);

    // Insert hyphen after the eighth digit

    if (trimmed.length <= 8) {
      this.dui = trimmed;
    } else {
      this.dui = trimmed.slice(0, 8) + '-' + trimmed.slice(8);
    }
    // Update the form control value without emitting an event
    this.userForm.get('dui')?.setValue(this.dui, { emitEvent: false });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form sent:', {
        ...this.userForm.value,
        hobbies: this.hobbies,
      });
      const { name, birthday, dui, minority_card } = this.userForm.value;
      let photo: string | null = this.userService.getUserPhoto()


      if (!photo) {
        this.errorMessage = 'Por favor selecciona una de foto.';
        return;
      }
      this.errorMessage = '';
      this.loadingService.show();


      this.userService
        .setUser({
          name: name as string,
          birthday: this.translateDateToYears(birthday as string).label,
          dui: dui as string,
          hobbies: this.hobbies,
          photo: photo,
          minority_card: minority_card
        })
        .subscribe({
          next: (res) => {
            console.log('User information saved:', res);
            this.announcer.announce(
              'Perfil actualizado correctamente',
              'assertive'
            );
            this.userForm.reset();
            this.hobbies = [];
          },
          error: (err) => {
            console.error('error:', err);
          },
          complete: () => {
            this.loadingService.hide();
          }
        });
    } else {
      // Mark all fields as touched to show errors
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  translateDateToYears(dateISO: string): Age {
    const dateBirth = new Date(dateISO);
    const date = new Date();

    let age = date.getFullYear() - dateBirth.getFullYear();

    const currentMonth = date.getMonth();
    const birthMonth = dateBirth.getMonth();

    const currentDay = date.getDate();
    const birthday = dateBirth.getDate();

    // If the birthday month/day has not yet arrived this year, subtract 1
    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && currentDay < birthday)
    ) {
      age--;
    }

    return {
      label: `${age} años`,
      isAdult: age >= 18
    };
  }
}

interface Age {
  label: string;
  isAdult: boolean
}
