import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  show = false;
  type = 'password';

  showLoginForm = true;
  loading = false;
  msgErro = '';
  recuperarSenhaClick = false;

  loginForm: UntypedFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  cadastroForm: UntypedFormGroup = this.fb.group({
    id: [''],
    nome: [''],
    email: ['', [Validators.required, Validators.email]],
    telefone: [''],
    qtd_processos: [''],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });


  constructor(
    private fb: UntypedFormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit(): void {
   
  }

  showHidPassword(): void {
    this.show = !this.show;
    if (this.show) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  submitLogin(): void {
    this.loading = true;
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe(() => {
        this.loading = false;
      },
        (err: any) => {
          this.loading = false;
          this.loginRegisterError(err.message);
        });
    } else {
      this.loading = false;
      //this.msgErro = validatorFields(this.loginForm);
    }
  }

  submitNewUser(): void {
    this.loading = true;
    this.cadastroForm.get('nome')?.patchValue('Admin');
    this.cadastroForm.get('email')?.patchValue('admin@sysjud.com.br');
    this.cadastroForm.get('telefone')?.patchValue('123456789');
    this.cadastroForm.get('qtd_processos')?.patchValue('30');
    this.cadastroForm.get('senha')?.patchValue('123456');

    if (this.cadastroForm.valid) {
      this.msgErro = '';
      this.loginService.cadastro(this.cadastroForm.value).subscribe((res) => {
        if (res) { this.loading = false; }
       },
       (err: any) => {
         this.loading = false;
         this.loginRegisterError(err.message);
       });
    } else {
      this.loading = false;
    }
  }

  recuperarSenha(){
    this.recuperarSenhaClick = true;
  }

  private loginRegisterError(err: any): void {
    this.msgErro = err;
  }
}
