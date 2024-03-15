import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'font-end-admin';
  isToggled = true;
  toggleSidebar() {
    this.isToggled = !this.isToggled;
  }
  constructor(private router: Router) {}
  isSalesPage(): boolean {
    if (this.router.url.includes('sales-counter') || this.router.url.includes('login')){
      return true;
    }
  }
}
