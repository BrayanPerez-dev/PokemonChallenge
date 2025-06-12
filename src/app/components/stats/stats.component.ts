import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-stats',
  imports: [MatProgressBarModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  @Input() stats: any[] = [];
  readonly maxStats: { [key: string]: number } = {
    hp: 255,
    attack: 190,
    defense: 230,
    'special-attack': 194,
    'special-defense': 230,
    speed: 180,
  };

  readonly statLabels: { [key: string]: string } = {
    hp: 'Salud',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque especial',
    'special-defense': 'Defensa especial',
    speed: 'Velocidad',
  };

  getPercentage(stat: any): number {
    const max = this.maxStats[stat.stat.name] || 100;
    return (stat.base_stat / max) * 100;
  }
}
