import { Component, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { LoginService } from 'src/app/login/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  
  scrollPosition: any;
  hasLogged = false;
  isCollapsed = true;

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.renderer.listen(window, 'scroll', () => {
      this.scrollPosition = window.scrollY;
    });

    if(this.authService.getToken() !== null) {
      this.hasLogged = true;
    } else {
      this.hasLogged = false;
    }
  }

  logout() {
    this.loginService.logout();
  }

}
