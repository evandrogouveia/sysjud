import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  cadastro(user: any): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/api/usuarios/criar`, user)
      .pipe(
        retry(1),
        map(res => {
          this.authService.setDataInLocalStorage('token', res.token);
          this.authService.logged.next(true);
          res.data.tipoUsuario === 'adm' ? this.router.navigate(['/private/admin']) : this.router.navigate(['/login']);
          this.toastr.success('Cadastro realizado!', '');
        }),
        catchError(this.handleError)
      );
  }

  login(user: any): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/api/usuarios/login`, user)
      .pipe(
        retry(1),
        map(res => {
          this.authService.setDataInLocalStorage('token', res.token);
          //this.authService.setDataInLocalStorage('user_permission', res.data.tipoUsuario);
          this.authService.logged.next(true);
          this.router.navigate(['/dashboard']);
          /*if (res.data.tipoUsuario === environment.USER_TYPE.ADM) {
            this.router.navigate(['/private/admin']);
          } else if (res.data.tipoUsuario === environment.USER_TYPE.CLIENTE) {
            this.router.navigate(['/minha-conta']);
          }*/
        }),
        catchError(this.handleError)
      );
  }

  logout(){}

  handleError(error: any): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = error.error;
    }
    return throwError(errorMessage);
  }
}
