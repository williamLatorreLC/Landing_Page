import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { FactoryService } from 'src/app/services/factory/factory.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-registro-final',
  templateUrl: './registro-final.component.html',
  styleUrls: ['./registro-final.component.css']
})
export class RegistroFinalComponent implements OnInit {
  infoTicket = {
    requisitos: "", documentos: [] = [] as any, telefono: "", date: new Date, fecha: "", hora: "",
    servicio: "", sede: [], nombre: "", usuario: "", correo: "", lineaServicio: "",
    aplicacion: "", tipoOperacion: [], tipoFalla: "", tipoCliente: "", impacto: "", urgencia: "", descripcion: ""
  };
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
  checkFinalFC = false
  InfoAdicional = [1]
  files = []
  urgencias = [{ detalle: "", id: "" }];
  sedes = [{ sede: "" }]
  lineasServicios = [{ lineaServicio: "" }]
  aplicaciones = [{ aplicacion: "" }];
  servicios = [{ servicio: "" }];
  tipos = { fallas: [{ tipoFalla: "" }], operaciones: [{ tipo: [] }], usuarios: [{ tipo: "" }], impactos: [{ detalle: "", id: "" }], };
  previsualizacion = ""
  constructor(private factoryService: FactoryService,
    private fb: FormBuilder, private router: Router,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer) {

  }

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
        this.getLists();
      }
    } else {
      this.router.navigateByUrl('/');
    }

  }
  async capturarFile(event: any) {
    if (event.target.files.length > 0) {
      if (this.infoTicket.documentos && this.infoTicket.documentos.length == 5) {
        swal.fire({
          title: "Solos puedes cargar 5 adjuntos",
          customClass: 'animated tada'
        });
      } else {
        const archivo = event.target.files[0]
        console.log(archivo);
        if (this.infoTicket.documentos) {
          await this.extraerBase64(archivo).then((imagen: any) => {
            console.log(imagen);

            this.infoTicket.documentos.push({ nombre: event.target.files[0].name, file: imagen.base })

            console.log(this.infoTicket.documentos);
            console.log(this.infoTicket.documentos.length);

          })
        }

        console.log(this.infoTicket.documentos.length >= 1);
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
  modalValidateSubmitCase(type: number) {
    swal.fire({
      title: '',
      text: "¿Estás seguro de generar el caso?",
      confirmButtonColor: "#c62f3d",
      confirmButtonText: "Aceptar",
      showCancelButton: true,
      cancelButtonColor: "#d9d9d9",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        console.log("infoTicket", this.infoTicket);
        if (!this.infoTicket.documentos) {
          this.infoTicket.documentos = [];
        }
        if (this.infoTicket.telefono) {
          this.infoTicket.telefono = this.infoTicket.telefono.toString();
        }

        if (this.infoTicket.date) {
          this.infoTicket.fecha = this.infoTicket.date.toString().split("T")[0]
          this.infoTicket.hora = this.infoTicket.date.toString().split("T")[1]
        } else {
          if (this.infoTicket.servicio == 'Soporte') {
            swal.fire({
              title: '',
              text: 'Por favor asignar fecha y hora de la falla.',
              confirmButtonColor: "#dc3545",
              confirmButtonText: "aceptar"
            });
            return;
          } else {
            this.infoTicket.fecha = "";
            this.infoTicket.hora = "";
          }
        }
        this.spinner.show()
        this.factoryService.post("casos/crear", this.infoTicket).then((res) => {
          this.spinner.hide()
          if (res.isError === false) {
            swal.fire({
              title: '',
              text: res.response,
              confirmButtonColor: "#dc3545",
              confirmButtonText: "aceptar"
            })
            this.router.navigateByUrl('/listaCasos')
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
      }
    })
  }
  changeServicio(selectedServicio: any, lineaServicio: any) {
    if (lineaServicio) {
      this.spinner.show()
      let dataService = {
        "servicio": selectedServicio,
        "lineaServicio": lineaServicio
      }
      console.log(dataService);
      this.factoryService.post('obtenerListas/aplicaciones', dataService).then((res) => {
        console.log(res);

        this.spinner.hide()
        if (res.isError === false) {
          this.aplicaciones = res.response
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
    }
  }
  changeServiceLine(selectedServiceLine: any) {
    if (selectedServiceLine) {
      this.spinner.show('Cargando...');
      let dataService = {
        "lineaServicio": selectedServiceLine
      }
      this.factoryService.post('obtenerListas/servicios', dataService).then((res) => {
        this.spinner.hide();
        if (res.isError === false) {
          this.servicios = res.response

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
    }
  }
  getLists() {
    this.preloadData();
    this.spinner.show('Cargando...');
    this.factoryService.get('obtenerListas').then((res) => {
      console.log(res);

      this.spinner.hide()
      if (res.isError === false) {
        this.lineasServicios = res.response.lineasServicios;
        this.sedes = res.response.sedes;
        //$scope.selectedServicio = $scope.servicios[0].servicio;
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
  }
  preloadData() {
    this.infoTicket.usuario = this.infoUser.User,
      this.infoTicket.nombre = this.infoUser.First_Name,
      this.infoTicket.correo = this.infoUser.Internet_Email
  }
  getInfo() {
    this.factoryService.post('utils/dec',
      { 'token': sessionStorage.getItem('X_MYIT_LAND') }).then((res) => {
        if (res.isError === false) {
          this.infoUser = res.response.map
          this.infoTicket.nombre = this.infoUser.First_Name + ' ' + this.infoUser.Last_Name
          this.infoTicket.usuario = this.infoUser.User
          this.infoTicket.correo = this.infoUser.Internet_Email
          console.log(this.infoUser);
        } else {
          this.router.navigateByUrl('/')
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
  }
  setRequisites(aplicacion: any, servicio: any, lineaServicio: any) {
    if (aplicacion && servicio && lineaServicio) {
      this.infoTicket.requisitos = "";

      this.spinner.show('Cargando...');
      let dataService = {
        "aplicacion": aplicacion,
        "servicio": servicio,
        "lineaServicio": lineaServicio
      }
      this.factoryService.post('obtenerListas/tipos', dataService).then((res) => {
        this.spinner.hide('Cargando...');

        if (res.isError === false) {
          this.tipos = res.response
          console.log(this.tipos);
        } else {
          console.log(res);
          swal.fire({
            title: 'Error',
            text: res.response,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "aceptar"
          })
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
    }
  }

  getUrgencias(tipos: any) {
    this.spinner.show()
    console.log('entra');
    console.log(tipos);

    console.log(tipos.usuario, tipos.aplicacion, tipos.lineaServicio, tipos.sevicio, tipos.tipoFalla);

    if (tipos.usuario && tipos.aplicacion && tipos.lineaServicio && tipos.servicio && tipos.tipoFalla) {
      console.log('----------------------------');
      let data = { usuario: tipos.usuario, aplicacion: tipos.aplicacion, lineaServicio: tipos.lineaServicio, servicio: tipos.servicio, tipoFalla: tipos.tipoFalla }
      console.log(tipos);

      this.factoryService.post('obtenerListas/tipoUrgencias', data).then((res) => {
        console.log(res);
        this.spinner.hide()
        if (res.isError === false) {
          this.urgencias = res.response
          this.infoTicket.requisitos = ""
          if (res.prerequisitos && res.prerequisitos != "" && res.prerequisitos.prerequisitos) {
            this.infoTicket.requisitos = res.prerequisitos.prerequisitos;
          }
          console.log(this.urgencias);
        } else {
          console.log(res);
          this.spinner.hide()

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
    }
  }
  deleteDocument(index: number) {
    this.infoTicket.documentos.splice(index, 1);
  }
  addInfoAdicional() {
    if (this.InfoAdicional.length < 12) {
      this.InfoAdicional.push(this.InfoAdicional.length + 1);
      window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
    }
  }
}