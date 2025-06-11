import { Component, Input } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-profile-setup-header',
  imports: [MatIconModule],
  templateUrl: './profile-setup-header.component.html',
  styleUrl: './profile-setup-header.component.scss'
})
export class ProfileSetupHeaderComponent {
  @Input() title: string = '¡Hola! Configuremos tu perfil';
  @Input() subtitle: string = 'Queremos conocerte mejor.';
}
