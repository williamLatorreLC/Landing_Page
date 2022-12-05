import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { FactoryService } from 'src/app/services/factory/factory.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-registro-resolutor',
  templateUrl: './registro-resolutor.component.html',
  styleUrls: ['./registro-resolutor.component.css']
})
export class RegistroResolutorComponent implements OnInit {
  infoTicket = {
    requisitos: "", DOCUMENTOS: [] = []as any, USUARIOANALISTA: '', NOMBREANALISTA: "", SEDE: "",
    USUARIO: [] = [] as any, TELEFONO: "", NOMBRE: "", CORREO: "", TIPOOPERACION: "", LINEASERVICIO: "",
    TIPODEFALLA: "", SERVICIO: "", APLICACION: "", IMPACTODESC: "", FECHACREACION: "", TIPOCLIENTE: "", GRUPOASIGNADO: "",
    NOMBREUSUARIOASIGNADO: "", ESTADO: "", CODIGODECIERRE: "", NROMYIT: "", DESCRIPCIONDETALLADA: "", NOTA: "",
    RESOLUCION: "", NOMBREUSUARIO: ""
  };
  estados = [{ estado: "", id: "" }];
  codigos = [{ id: "", codigo: "" }];
  files = []
  checkResolutorFC = false;
  InfoAdicional = [1]
  infoUser = {
    Departament: "",
    First_Name: "",
    Internet_Email: "",
    Job_Title: "",
    Last_Name: "",
    Organization: "",
    ProfileId: "",
    Profile_Status: "",
    Site: "",
    Support_Staff: "",
    User: "",
    User_ID: "",
    esContingencia: false,
    esResolutor: false,
    grupos: [],
    loginSSO: false,
    req: "",
    token: "",
    tokenForm: "",
    version: "",
    surveys: {}
  };
  constructor(
    private sanitizer: DomSanitizer, private spinner: NgxSpinnerService, private factoryService: FactoryService, private router: Router,) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('X_MYIT_LAND') != null
      && sessionStorage.getItem('X_MYIT_LAND') != ""
      && sessionStorage.getItem('X_MYIT_LAND') != undefined) {
      if (this.infoUser == null || this.infoUser == undefined) {
        this.getInfo();
        console.log(this.infoUser);

      } else {
        console.log(this.infoUser);
        this.getInfo();
      }
    } else {
      this.router.navigateByUrl('/');
    }
  }

  modalValidateSubmitCase(type: any) {
    if (this.infoTicket.ESTADO == '3000' && (!this.infoTicket.CODIGODECIERRE)) {
      swal.fire({
        title: '',
        text: "Debes completar el campo código de cierre.",
        confirmButtonColor: "#dc3545",
        confirmButtonText: "aceptar"
      });
      return;
    } else if (this.infoTicket.ESTADO == '3000' && (!this.infoTicket.RESOLUCION)) {
      swal.fire({
        title: '',
        text: "Debes completar el campo resolución.",
        confirmButtonColor: "#dc3545",
        confirmButtonText: "aceptar"
      });
      return;
    } else {
      swal.fire({
        title: '',
        text: "¿Estás seguro de gestionar el caso?",
        confirmButtonColor: "#c62f3d",
        confirmButtonText: "Aceptar",
        showCancelButton: true,
        cancelButtonColor: "#d9d9d9",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        this.infoTicket.USUARIO = this.infoUser.User;
        this.infoTicket.NOMBREUSUARIO = this.infoUser.First_Name + " " + this.infoUser.Last_Name;
        console.log(this.infoTicket);
        this.spinner.show()
        this.factoryService.post("casos/gestionResolutor", this.infoTicket).then((res) => {
          this.spinner.hide()
          if (res.isError === false) {
            swal.fire({
              title: '',
              text: res.response,
              confirmButtonColor: "#dc3545",
              confirmButtonText: "aceptar"
            });
            this.router.navigateByUrl('/listaCasos');
          } else {
            console.log(res);
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
      })
    }
  }
  addInfoAdicional() {
    if (this.InfoAdicional.length < 12) {
      this.InfoAdicional.push(this.InfoAdicional.length + 1);
      window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
    }
  }
  deleteDocument(i: any) {
    this.infoTicket.DOCUMENTOS.splice(i, 1);
  }
  getInfo() {
    this.spinner.show('Cargando...');
    this.factoryService.post("utils/dec", {
      "token": sessionStorage.getItem('X_MYIT_LAND')
    }).then((res) => {
      this.spinner.hide();
      if (res.isError === false) {
        this.infoUser = res.response.map;
        this.infoTicket.NOMBREUSUARIO = this.infoUser.First_Name + this.infoUser.Last_Name
        this.infoTicket.USUARIO = this.infoUser.User
        this.infoTicket.CORREO = this.infoUser.Internet_Email
        this.getParametrizations();

      } else {
        this.router.navigateByUrl('/');

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
    });
  }
  getParametrizations() {
    this.getDataCasoSessionStorage();
    this.spinner.show('Cargando...');
    console.log(this.infoTicket);

    this.factoryService.post('obtenerListas/parametrizacion', {
      "lineaServicio": this.infoTicket.LINEASERVICIO,
      "tipoFalla": this.infoTicket.TIPODEFALLA,
      "servicio": this.infoTicket.SERVICIO,
      "aplicacion": this.infoTicket.APLICACION
    }).then((Data) => {
      console.log('-----------------------------------');

      this.spinner.hide()
      if (Data.isError === false) {
        this.estados = Data.response.estados;
        this.codigos = Data.response.codigoCierres;
        this.infoTicket.requisitos = Data.response.prerequisitos.prerequisitosAMX != null ? Data.response.prerequisitos.prerequisitosAMX : "";
        console.log(Data.response);

      } else {
        console.log(Data);
        swal.fire({
          title: 'Error',
          text: Data.response,
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
    });
  }
  getDataCasoSessionStorage() {
    this.spinner.hide()
    let dataCaso = sessionStorage.getItem('CASO')
    this.infoTicket = JSON.parse(sessionStorage.getItem('CASO')!)
    console.log(this.infoTicket)
    this.infoTicket.DOCUMENTOS = [];
  }
  async capturarFile(event: any) {
    if (event.target.files.length > 0) {
      if (this.infoTicket.DOCUMENTOS && this.infoTicket.DOCUMENTOS.length == 5) {
        swal.fire({
          title: "Solos puedes cargar 5 adjuntos",
          customClass: 'animated tada'
        });
      } else {
        const archivo = event.target.files[0]
        console.log(archivo);
        if (this.infoTicket.DOCUMENTOS) {
          await this.extraerBase64(archivo).then((imagen: any) => {
            console.log(imagen);

            this.infoTicket.DOCUMENTOS.push({ nombre: event.target.files[0].name, file: imagen.base })

            console.log(this.infoTicket.DOCUMENTOS);
            console.log(this.infoTicket.DOCUMENTOS.length);

          })
        }

        console.log(this.infoTicket.DOCUMENTOS.length >= 1);
      }
    }
  }
  extraerBase64 = async ($event: any) => new Promise(resolve => {
    try {
      const unsafeImg = window.URL.createObjectURL($event)
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg)
      const reader = new FileReader()
      reader.readAsDataURL($event)
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      }
      reader.onerror = error => {
        resolve({
          base: null
        });
      }
    } catch (e) {
      return null
    }
  })
}
