// Angular's Component decorator lets us define a UI component in TypeScript.
import { Component } from '@angular/core';
// This imports the UI feature component that we want to show on the screen.
import { ProfileCardComponent } from './components/profile-card/profile-card';

// The root component is the first Angular component loaded by the application.
@Component({
  // Angular looks for this tag in the main app bootstrap process.
  selector: 'app-root',
  // We import the child component here so this root component can use <app-profile-card>.
  imports: [ProfileCardComponent],
  // Keep HTML in a separate file so beginners can edit structure easily.
  templateUrl: './app.html',
  // Keep CSS in a separate file so beginners can style the page without touching TypeScript.
  styleUrl: './app.css'
})
// This class is empty because all current work is handled by the child UI component.
export class App {}
