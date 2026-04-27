// Component is required to create an Angular UI component.
import { Component } from '@angular/core';

// This component is a simple Single Directory Component (SDC).
// SDC means TS, HTML, and CSS stay together in one folder.
@Component({
  // Angular uses this tag name inside HTML: <app-profile-card>.
  selector: 'app-profile-card',
  // standalone: true means this component does not need a separate NgModule file.
  standalone: true,
  // Template file contains the UI structure.
  templateUrl: './profile-card.html',
  // Style file contains CSS only for this component.
  styleUrl: './profile-card.css'
})
export class ProfileCardComponent {
  // This object stores the text shown in the HTML file.
  // We keep sample UI data here because the intern is only building static UI for now.
  protected readonly intern = {
    name: 'UI Development Intern',
    role: 'Single Directory Component Practice',
    summary: 'This component keeps TypeScript, HTML, and CSS in one folder.',
    // Array data is useful for showing how Angular repeats UI with a loop.
    skills: ['HTML', 'CSS', 'Angular Template Basics']
  };
}
