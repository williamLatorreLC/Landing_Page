import { Component, OnInit } from '@angular/core';
import { FactoryService } from 'src/app/services/factory/factory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { GtagService } from "../../services/gtmServices/gtag.service";
import { SessionServiceService } from "../../services/sessionService/session-service.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  users: FormGroup;
  isCloseSession:boolean = false;
  encryptionKey = 'LandingMyITPageK';

  userData = {}
  constructor(private factoryService: FactoryService,
    private fb: FormBuilder, private router: Router,
    private spinner: NgxSpinnerService,
    private GtmServicesService : GtagService,
    private SessionService : SessionServiceService
  ) {

    this.users = this.fb.group({
      user: ['', Validators.required],
      pass: ['', Validators.required],
      closeSessions: [this.isCloseSession]
    })
  }

  ngOnInit(): void {
    this.GtmServicesService.Tagging("Login","pt_login");
    this.spinner.hide()
    

  }
  login() {
    this.GtmServicesService.Tagging("Login","bt_login_iniciarsesion");
    if (!this.users.invalid) {
      this.spinner.show();
      if (this.isCloseSession) {
        this.users.value.closeSessions = true;
      }
      const encryptedUser = btoa(this.users.value.user);
      const encryptedPassword = btoa(this.users.value.pass);
      this.factoryService.post('loginMyIT', {
        user: encryptedUser,
        pass: encryptedPassword,
        closeSessions: this.users.value.closeSessions
      }).then((res) => {
        this.spinner.hide()
        if (res.isError === false) {
          sessionStorage.setItem('X_MYIT_LAND', res.response.tokenForm)
          sessionStorage.setItem('X_MYIT_INFO', res.response.token)
          sessionStorage.setItem('X_MYIT_REQ', res.response.req)
        
          this.SessionService.setUserLoggedIn(true);
          this.isCloseSession = false;
          this.userData = res.response;
          this.router.navigateByUrl('/home');   
        } else {
          let dataAuth = res.data ? res.data : ""; 
          if(dataAuth == "true"){         
            swal.fire({
              text: res.response,
              confirmButtonColor: "#dc3545",
              confirmButtonText: "Aceptar",
              showCancelButton: true,
              cancelButtonColor: "#d9d9d9",
              cancelButtonText: "Cancelar",
            }).then((result) => {
              if (result.isConfirmed) {
                this.isCloseSession = true;
                this.login();
              }
            })
          }else{
            swal.fire({
              title: 'Error',
              text: res.response,
              confirmButtonColor: "#dc3545",
              confirmButtonText: "aceptar"
            });
          }
        }

      }).catch((err) => {
        this.spinner.hide();
        swal.fire({
          title: 'Error',
          text: "Por el momento no está disponible esta información.",
          confirmButtonColor: "#dc3545",
          confirmButtonText: "aceptar"
        });
        console.log(err)
      })
    } else {
      swal.fire({
        title: "",
        text: "Ingresa usuario y contraseña",
        confirmButtonColor: "#dc3545",
        confirmButtonText: "aceptar"
      });
    }
  }
}
