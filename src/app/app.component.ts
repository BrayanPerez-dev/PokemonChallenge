import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SettingsComponent } from './pages/settings/settings.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent,SettingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PokemonChallenge';
}
