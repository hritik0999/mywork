import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorToastComponent } from './shared/components/error-toast/error-toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
