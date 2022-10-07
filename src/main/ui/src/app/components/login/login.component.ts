import { Component, OnInit } from '@angular/core';
import { FactoryService } from 'src/app/services/factory/factory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { GtagService } from "../../services/gtmServices/gtag.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  users: FormGroup;
 

  userData = {}
  constructor(private factoryService: FactoryService,
    private fb: FormBuilder, private router: Router,
    private spinner: NgxSpinnerService,
    private GtmServicesService : GtagService
  ) {

    this.users = this.fb.group({
      user: ['', Validators.required],
      pass: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.GtmServicesService.Tagging("Login","pt_login");
    this.spinner.hide()
  }
  login() {
    this.GtmServicesService.Tagging("Login","bt_login_iniciarsesion");
    if (!this.users.invalid) {
      this.spinner.show()
      this.factoryService.post('loginMyIT', this.users.value).then((res) => {
        this.spinner.hide()
        if (res.isError === false) {
          this.userData = res.response;
          this.router.navigateByUrl('/home')

          sessionStorage.setItem('X_MYIT_LAND', res.response.tokenForm)
          sessionStorage.setItem('X_MYIT_INFO', res.response.token)
          sessionStorage.setItem('X_MYIT_REQ', res.response.req)
        } else {
          swal.fire({
            title: 'Error',
            text: res.response,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "aceptar"
          });
          

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
