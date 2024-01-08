import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MadreDeDiosComponent } from './components/madre-de-dios.component';

@Component({
  standalone: true,
  imports: [MadreDeDiosComponent, RouterModule],
  selector: 'carte-tresor-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'carte-tresor';
}
