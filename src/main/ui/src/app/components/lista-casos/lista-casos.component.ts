import { Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FactoryService } from 'src/app/services/factory/factory.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-lista-casos',
  templateUrl: './lista-casos.component.html',
  styleUrls: ['./lista-casos.component.css']
})
export class ListaCasosComponent implements OnInit {
  @ViewChild("mymodalCom", { static: false }) mymodalCom: TemplateRef<any> | undefined;
  @ViewChild("mymodalDoc", { static: false }) mymodalDoc: TemplateRef<any> | undefined;
  @ViewChild("modalInfoCaso", { static: false }) modalInfoCaso: TemplateRef<any> | undefined;
  @ViewChild("modalEscalar", { static: false }) modalEscalar: TemplateRef<any> | undefined;
  @ViewChild("modalGestion", { static: false }) modalGestion: TemplateRef<any> | undefined;
 
  listaCasos: any[] = [{
    TIPODEFALLA: "",
    FECHAREGISTRO: "",
    PRIORIDADINCIDENTE: "",
    CONSECUTIVO: "",
    ESTADO: "",
    comentarios: ""
  }];
  comentarios = [{ nombre: "", nota: "" }];
  organizaciones = [{ organizacion: "" }];
  details = {
    DOCUMENTOS: {}, TIPODEFALLA: "", FECHAREGISTRO: "", PRIORIDADINCIDENTE: "", NROMYIT: "", ESTADO: "",
    NOMBRE: "", CORREO: "", DESCRIPCIONDETALLADA: "", FECHACREACION: "", ID: ""
  }
  grupos = [{ grupo: [], id: "" }];
  documentos = [{ nombre: "", file: [] }];
  dataGestion = { documentos: []= []as any, idCaso: "", usuario: "", nombreUsuario: "", nota: "" };
  search = { criterio: "" };
  modalOptions: NgbModalOptions
  files = {}
  activeRouteLC = false
  doc = [];
  miembros = [{ nombre: "" }]
  filterList = "";
  closeResult = "";
  escalarData = { nota: "", idCaso: "", grupo: "", usuario: "", usuarioAsignado: { usuario: "", nombre: "" }, nombreUsuarioAsignado: "", nombreUsuario: "", organizacion: "" }
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
    grupos: [] = [] as any,
    loginSSO: false,
    req: "",
    token: "",
    tokenForm: "",
    version: "",
    surveys: {}
  };
  constructor( private sanitizer: DomSanitizer,private modalService: NgbModal, private factoryService: FactoryService, private router: Router, private zone: NgZone, private spinner: NgxSpinnerService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    }
  }

  ngOnInit(): void {


    if (sessionStorage.getItem("X_MYIT_LAND") != null
      && sessionStorage.getItem("X_MYIT_LAND") != ""
      && sessionStorage.getItem("X_MYIT_LAND") != undefined) {
      if (this.infoUser == null || this.infoUser == undefined) {
        this.getCasesUser();
        this.getInfo();
      } else {
        console.log(this.infoUser);
        this.getInfo();
        this.getCasesUser();
      }
    } else {
      this.router.navigateByUrl('/');
    }
  }
  async capturarFile(event: any) {
    if (event.target.files.length > 0) {
      if (this.dataGestion.documentos && this.dataGestion.documentos.length == 5) {
        swal.fire({
          title: "Solos puedes cargar 5 adjuntos",
          customClass: 'animated tada'
        });
      } else {
        const archivo = event.target.files[0]
        console.log(archivo);
        if (this.dataGestion.documentos) {
          await this.extraerBase64(archivo).then((imagen: any) => {
            console.log(imagen);

            this.dataGestion.documentos.push({ nombre: event.target.files[0].name, file: imagen.base })

            console.log(this.dataGestion.documentos);
            console.log(this.dataGestion.documentos.length);

          })
        }

        console.log(this.dataGestion.documentos.length >= 1);
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
  openForm() {
    this.router.navigateByUrl('/registroFinal')
  }
  openAllDocuments() {
    this.open(this.mymodalDoc)

  }
  listAll() {
    if (this.search.criterio == "" || !this.search.criterio) {
      this.getCasesUser();
    }
  }
  resolverCaso(caso: any) {
    sessionStorage.setItem('CASO', JSON.stringify(caso))
    console.log(caso);
    this.modalService.dismissAll();
    this.router.navigateByUrl("/registroResolutor")
  }
  caseDetails(caso: any) {
    console.log(caso);
    this.details = caso
    this.spinner.show()
    this.factoryService.post("casos/documentos", { "idCaso": caso.ID }).then((res) => {
      this.spinner.hide();
      if (res.isError === false) {
        this.documentos = res.response
        this.details.DOCUMENTOS = this.documentos
        this.open(this.modalInfoCaso)
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
  searchCase() {
    if (this.search.criterio && this.search.criterio != "") {
      this.spinner.show()
      this.factoryService.post('listaCasos/buscar', { "criterio": this.search.criterio }).then((res) => {
        console.log(res);

        this.spinner.hide();
        if (res.isError === false) {
          console.log(res.response);

          let finalList: any[] = [];
          res.response.forEach((element: {
            NOTADETRABAJO: any; comentarios: any;
          }) => {
            element.comentarios = []
            if (element.NOTADETRABAJO) {
              var items = element.NOTADETRABAJO.split(";");
              for (var i in items) {
                var item = items[i].split(",");
                element.comentarios.push({ nota: item[0], usuario: item[1], nombre: item[2] });
              }
            }
            finalList.push(element);
            console.log(finalList);

          });
          this.listaCasos = finalList;
          console.log(this.listaCasos);


          console.log(res.response);
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
      });
    }
  }
  getCasesUser() {
    console.log(this.infoUser);
    this.spinner.show();
    var path = "listaCasos/usuario";
    var data = { "usuario": this.infoUser.User, grupos: [] };
    console.log(this.infoUser.esResolutor);
    if (this.infoUser.esResolutor) {
      path = "listaCasos/resolutor";
      data.grupos = [];
      if (this.infoUser.grupos.myArrayList && this.infoUser.grupos.myArrayList.length > 0) {
        data.grupos = this.infoUser.grupos.myArrayList;
      } else if (this.infoUser.grupos && this.infoUser.grupos.length > 0) {
        data.grupos = this.infoUser.grupos;
      }
    }
    this.factoryService.post(path, { "usuario": data.usuario, "grupos": data.grupos }).then((res) => {

      this.spinner.hide();
      if (res.isError === false) {
        console.log(res.response);
        var finalList: any[] = [];

        var full = false;
        if (data.grupos) {
          for (var i = 0; i < data.grupos.length; i++) {
            if (data.grupos[i] == "COL-IT-GMSC-CALIDAD" || data.grupos[i] == "COL-IT-GMSC-N1-MESA MOVIL NIVEL 1" || data.grupos[i] == "COL-IT-GMSC-SOPORTE-SITIO-MOVIL") {
              full = true;
              break;
            }
          }
        }
        res.response.forEach((value: { USUARIO: string; ESTADO: string; comentarios: { nota: any; usuario: any; nombre: any; }[]; NOTADETRABAJO: string; }) => {
          if (this.infoUser.User == value.USUARIO || value.ESTADO != "3000" || (this.infoUser.esResolutor && full)) {
            value.comentarios = [];
            if (value.NOTADETRABAJO) {
              var items = value.NOTADETRABAJO.split(";");
              for (var i in items) {
                var item = items[i].split(",");
                value.comentarios.push({ nota: item[0], usuario: item[1], nombre: item[2] });
              }
            }
            finalList.push(value);
          }
        });
        this.listaCasos = finalList;

      } else {
        console.log(res);
        this.spinner.hide();
        swal.fire({
          title: 'Error',
          text: res.response,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "aceptar"
        });

      }

    }).catch((err) => {
      swal.fire({
        title: 'Error',
        text: "Por el momento no está disponible esta información.",
        confirmButtonColor: "#dc3545",
        confirmButtonText: "aceptar"
      });
      console.log(err)
    })


  };
  open(content: any) {
    console.log(this.infoUser.esContingencia);
    this.infoUser.esContingencia = true
    if (content._declarationTContainer.localNames[0] == 'mymodal' && this.infoUser.esContingencia === true) {
      this.router.navigateByUrl('/listaCasos')

    } else {
      this.modalService.open(content, this.modalOptions).result.then((result) => {
        console.log(result);

        this.closeResult = `Closed with: ${result}`;


      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

      });
    }


  }
  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  escalar(detalleCaso: any,) {
    this.modalService.dismissAll();
    this.spinner.show()
    this.factoryService.get('obtenerListas/organizaciones').then((Data) => {
      this.spinner.hide()
      if (Data.isError === false) {
        this.organizaciones = Data.response;
        this.open(this.modalEscalar)
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

  };
  getInfo() {
    this.spinner.show('Cargando...');

    this.factoryService.post('utils/dec',
      { 'token': sessionStorage.getItem('X_MYIT_LAND') }).then((res) => {
        this.spinner.hide();
        console.log('------------------------', res);

        if (res.isError === false) {
          this.infoUser = res.response.map
          this.getCasesUser()
          console.log(this.infoUser);

        } else {
          //$state.go('login');

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
  openComentarios(comentarios: any) {
    this.comentarios = comentarios;
    this.open(this.mymodalCom)

  };
  downloadFile(filename: any, data: any) {
    if (!filename || !data) {
      return;
    }
    var arrayBufferHelper = this.arrayBufeerHelperBase();
    var arrayData = arrayBufferHelper.base64ToArrayBuffer(data);
    var objData = arrayData;
    var filename = filename;
    var contentType = "application/octet-stream";

    var dataTypeName = objData.constructor.name;
    switch (dataTypeName) {
        case 'Promise':
            objData.then(function (response:any) {
                //debugger;
                if (response.data) {
                    var data = response.data;
                } else
                {
                    var data = response;
                }
                switch (data.constructor.name) {
                    case 'Blob':
                    case 'ArrayBuffer':
                        console.log('Downloading...');
                        //this.createDownloadFile(data, filename, contentType);
                        break;
                }
            }, function () {
                console.log('Error when download the file, data get issues');
            });
            break;
        case 'ArrayBuffer':
            console.log('Downloading...');
            this.createDownloadFile(objData, filename, contentType);
            break;
        default:
            console.log('Data type ' + dataTypeName + ' of objData is unknown');
    }
  }

  gestionarCaso() {
    this.dataGestion.idCaso = this.details.ID;
    this.dataGestion.usuario = this.infoUser.User;
    this.dataGestion.nombreUsuario = this.infoUser.First_Name + " " + this.infoUser.Last_Name;
    this.dataGestion.documentos = []
    console.log();
    
    this.open(this.modalGestion)
    this.spinner.show()
    this.factoryService.post("casos/gestionar", this.dataGestion).then((Data) => {
      this.spinner.hide()
      if (Data.isError === false) {
        this.getCasesUser();
        this.dataGestion.documentos = [];
        swal.fire({
          title: '',
          text: Data.response,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "aceptar"
        });
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
  };
  getGroups(organizacion: string) {
    console.log(organizacion);
    
    this.spinner.show()
    this.factoryService.post("obtenerListas/grupos", {
      "organizacion": organizacion
    }).then((Data) => {
      this.spinner.hide()
      if (Data.isError === false) {
        this.grupos = Data.response;
        console.log('--------------------');
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
  escalarCaso(details: any) {
    this.open(this.modalEscalar)
    this.escalarData.idCaso = details.ID
    console.log('---------------------------');
    console.log(this.escalarData.grupo);
    
    var group = JSON.parse(this.escalarData.grupo)
    this.escalarData.grupo = group.grupo
    this.escalarData.usuario = this.infoUser.User
    if (this.escalarData.usuarioAsignado != null && this.escalarData.usuarioAsignado != undefined) {
      this.escalarData.usuarioAsignado = this.escalarData.usuarioAsignado;
      if (this.escalarData.usuarioAsignado.usuario != null && this.escalarData.usuarioAsignado.usuario != undefined) {
        this.escalarData.nombreUsuarioAsignado = this.escalarData.usuarioAsignado.nombre;
        this.escalarData.usuarioAsignado = JSON.parse(this.escalarData.usuarioAsignado.usuario);
      }
    }
    this.escalarData.nombreUsuario = this.infoUser.First_Name + " " + this.infoUser.Last_Name;
    this.spinner.show()
    this.factoryService.post("casos/escalar", this.escalarData).then((Data) => {
      this.spinner.hide()
      if (Data.isError === false) {
        this.getCasesUser();
        swal.fire({
          title: '',
          text: Data.response,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "aceptar"
        });
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
    })
  }
  getMembers(id: any) {
    
    console.log(id);
    
    this.spinner.show()
    this.factoryService.post("obtenerListas/miembros", {
      "idGrupo":id
    }).then((Data) => {
      this.spinner.hide()
      if (Data.isError === false) {
        this.miembros = Data.response;
        setTimeout(function () {
        }, 200);
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
  deleteDocument(i: number) {
    this.dataGestion.documentos.splice(i, 1);
  }
  
  arrayBufeerHelperBase() {
    var factory:any = {};
    factory.arrayBufferToBase64 = function (buffer:any) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[ i ]);
        }
        return window.btoa(binary);
    }

    factory.base64ToArrayBuffer = function (base64:any) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
    return factory;
  }

  createDownloadFile(fileData:any, filename:any, dataContentType:any) {

    var blob = new Blob([fileData], {'type': dataContentType});
    var _navigator:any = window.navigator;
    var _userAgent = _navigator.userAgent;
    console.log(_userAgent);
    //debugger;
    if (_navigator.msSaveOrOpenBlob) {
        //IE 11+
        _navigator.msSaveOrOpenBlob(blob, filename);
    } else if (_userAgent.match("CriOS")) {
        //Chrome iOS
        var reader:any = new FileReader();
        reader.onloadend = function () {
            window.open(reader.result);
        };
        reader.readAsDataURL(blob);
    } else {

        var address = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.download = filename;
        anchor.href = address;
        anchor.click();
    }
  }
}
