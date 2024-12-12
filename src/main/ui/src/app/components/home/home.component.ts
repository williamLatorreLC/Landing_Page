import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FactoryService } from 'src/app/services/factory/factory.service';
import swal from 'sweetalert2';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { GtagService } from '../../services/gtmServices/gtag.service';
import { SessionServiceService } from '../../services/sessionService/session-service.service';
import { HttpClient } from '@angular/common/http';
import { CasosService } from 'src/app/services/casosServices/casos.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { interval, take } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('mymodalEnc', { static: false }) mymodalEnc:
    | TemplateRef<any>
    | undefined;

  @ViewChild('chat', { static: false }) content!: ElementRef;

  mostrarChat: boolean = false;
  menu = true;
  banner = true;
  botones = true;
  cerrar = true;
  banners = [{ ruta: null }];
  avatars = [{ imagen: '', id: null }];
  encuestas = [
    {
      Hover2: false,
      Hover4: false,
      Hover6: false,
      Hover8: false,
      Hover10: false,
      Comentario: '',
      SelectedValue: 0,
      SurveyFor: '',
      Originating_Request_ID: '',
      Last_Surveyed_Date: '',
      Fecha: '',
      Hora: '',
      showDetails: '',
      Case_Description: '',
    },
  ];
  //PRUEBAS
  closeResult = '';
  modalOptions: NgbModalOptions;
  myIntervar = 5000;

  noWrapSlides = false;
  chatOpen = false;
  active = 0;
  infoUser = {
    Departament: '',
    First_Name: '',
    Internet_Email: '',
    Job_Title: '',
    Last_Name: '',
    Organization: '',
    ProfileId: '',
    Profile_Status: '',
    Site: '',
    Support_Staff: '',
    User: '',
    User_ID: '',
    esContingencia: false,
    esResolutor: false,
    grupos: [],
    loginSSO: false,
    req: '',
    token: '',
    tokenForm: '',
    version: '',
    surveys: {},
    AvatarTime: 0,
    BannerTime: 0,
    MyItStore: '',
    MyItUser: '',
    MyItResolutor: '',
  };

  modalInstance = null;
  verify = null;

  numeroRequerimiento: string = '';
  numeroW: string = '';
  numeroI: string = '';
  selectReq: boolean = false;
  numberRequerimiento: FormGroup;
  numberWO: FormGroup;
  numberINC: FormGroup;
  Request_Number: any;
  AppRequestID: string;
  Status: string;
  Summary: string;
  Submit_Date: string;
  Closed_Date: string;
  consultarOcrearCaso: boolean = false;
  consultaCaso: boolean = false;
  numeroRequerimientoIngresado: any;
  descripcionIncidente: any;
  statusIncidente: any;
  descripcionIncidenteDetallada: any;
  fechaCreacionIncidente: any;
  fechaNotaInc1 = null;
  fechaNotaInc2 = null;
  fechaNotaInc3 = null;
  fechaNotaWo1 = null;
  fechaNotaWo2 = null;
  fechaNotaWo3 = null;
  descriptionInc1 = null;
  descriptionInc2 = null;
  descriptionInc3 = null;
  resolution = null;
  fechaResolution = null;
  loadingMessage: string = 'Cargando notas';
  dots: string = '';
  detailedDescriptionCrearNotas: string = '';
  CrearNotas: FormGroup;
  workLogType: FormGroup;
  crearNota: boolean = false;
  creadoExitoso: any;
  peticionEnCurso: any;
  doc = [];
  documentos = [{ nombre: "", file: [] }];
  nombreArchivo: string;
  base64ContentString: string;
  esContingenciaChatbot!: any;
  selectInc: boolean;
  selectWo: boolean;
  numeroIncIngresado: any;
  numeroWoIngresado: any;
  Incident_Number: any;
  WO_Number: any;
  selectHc: boolean = false;
  qualification: any;
  noReq1: any;
  noReq2: any;
  noReq3: any;
  noInc1: any;
  noInc2: any;
  noInc3: any;
  statusInc1: any;
  statusInc2: any;
  statusInc3: any;
  sumarryInc1: any;
  sumarryInc2: any;
  sumarryInc3: any;
  fechaInc1: any;
  fechaInc2: any;
  fechaInc3: any;
  messageError: any;
  messageErrorWO: any;
  datosCargados: boolean;
  numeroNotas: any;

  constructor(
    private _config: NgbCarouselConfig,
    private factoryService: FactoryService,
    private router: Router,
    private modalService: NgbModal,
    private GtmServicesService: GtagService,
    private SessionService: SessionServiceService,
    private http: HttpClient,
    private casosService: CasosService,
    private fb: FormBuilder,
  ) {
    _config.interval = 30000;
    _config.pauseOnHover = true;
    _config.showNavigationArrows = false;
    _config.showNavigationIndicators = true;

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };

    this.numberRequerimiento = this.fb.group({
      reqNumber: ['']
    })

    this.CrearNotas = this.fb.group({
      reqNumber: ['']
    })

    this.numberINC = this.fb.group({
      incNumber: ['']
    })

    this.numberWO = this.fb.group({
      woNumber: ['']
    })

    this.qualification = this.fb.group({
      Qualification: ['']
    })
  }

  ngOnInit(): void {
    this.GtmServicesService.Tagging('Home', 'pt_home');
    //console.log(this.infoUser.esContingencia);

    this.banners.length = 0;
    this.avatars.length = 0;
    if (
      sessionStorage.getItem('X_MYIT_LAND') != null &&
      sessionStorage.getItem('X_MYIT_LAND') != undefined &&
      sessionStorage.getItem('X_MYIT_LAND') != ''
    ) {
      this.getInfo();
      this.getBanners();
      this.getAvatars();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  async getBanners() {
    this.factoryService
      .get('banners/1')
      .then((res) => {
        if (res.isError === false && res.response.length > 0) {
          this.banners = res.response;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getAvatars() {
    this.factoryService
      .get('avatars/1')
      .then((res) => {
        if (res.isError === false && res.response.length > 0) {
          this.avatars = res.response;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getInfo() {
    this.factoryService
      .post('utils/dec', { token: sessionStorage.getItem('X_MYIT_LAND') })
      .then((res) => {
        if (res.isError === false) {

          this.infoUser = res.response.map;
          this.esContingenciaChatbot = res.response.map.esContingenciaChatBot;
          setTimeout(function () {
            //$scope.$apply(); TO DO => No se coomo funciona esto.
          }, 200);
        }
      });
  }
  open(content: any) {
    if (content._declarationTContainer.localNames[0] == 'mymodal') {
      this.GtmServicesService.Tagging('Home', 'bt_home_it');
    } else {
      this.GtmServicesService.Tagging('Home', 'bt_home_store');
    }

    console.log(this.infoUser.esContingencia);
    if (
      content._declarationTContainer.localNames[0] == 'mymodal' &&
      this.infoUser.esContingencia === true
    ) {
      this.router.navigateByUrl('/listaCasos');
    } else {
      this.modalService.open(content, this.modalOptions).result.then(
        (result) => {
          console.log(result);

          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }
  }
  goToContinue(modal: any) {
    window.open(
      this.infoUser.MyItStore
    );
    this.modalService.dismissAll();
  }

  openMenu() {
    if (this.menu == true) {
      this.menu = false;
    } else {
      this.menu = true;
    }
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  goToUsuRes() {
    window.open(
      this.infoUser.MyItResolutor
    );
    this.modalService.dismissAll();
  }
  goToUsuMyIt() {
    window.open(this.infoUser.MyItUser);
    this.modalService.dismissAll();
  }
  getSurveys() {
    this.GtmServicesService.Tagging('Home', 'bt_home_encuestas');
    $('#siteloader').html('');
    this.chatOpen = false;
    this.factoryService
      .post('surveys/GetList', { token: sessionStorage.getItem('X_MYIT_REQ') })
      .then((res) => {
        this.encuestas = res.response;

        if (res.isError === false && res.response.length > 0) {
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          for (let i = 0; i < res.response.length; i++) {
            const d = new Date(res.response[i].Create_date);
            res.response[i].Hora = d.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
            res.response[i].Fecha = d.toLocaleString('es-US');
            res.response[i].Active = false;
            res.response[i].Hover2 = false;
            res.response[i].Hover4 = false;
            res.response[i].Hover6 = false;
            res.response[i].Hover8 = false;
            res.response[i].Hover10 = false;
            res.response[i].SelectedValue = null;
            res.response[i].Comentario = '';
          }
          this.GtmServicesService.Tagging('Home', 'pt_encuestas');
          this.open(this.mymodalEnc);
        } else if (res.isError === false && res.response.length == 0) {
          swal.fire({
            title: '',
            text: 'No tienes encuestas pendientes por responder.',
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'aceptar',
          });
        } else {
          swal.fire({
            title: '',
            text: res.response,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'aceptar',
          });
        }
      });
  }
  cerrarsesion() {
    this.GtmServicesService.Tagging('Home', 'bt_home_cerrarsesion');
    this.factoryService
      .post('logout', { token: sessionStorage.getItem('X_MYIT_LAND') })
      .then((res) => {
        if (res.isError === false) {
          this.SessionService.setUserLoggedIn(false);
          sessionStorage.clear();
          this.router.navigateByUrl('/');
        } else {
          swal.fire({
            title: 'Error',
            text: res.response,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'aceptar',
          });
        }
      });
  }
  abrirChat() {
    this.GtmServicesService.Tagging('Home', 'bt_home_chatbot');
    const chatURL = encodeURI('./chatbot');
    $('#siteloader').html(
      '<object class="chatObj" data="' +
      chatURL +
      '"  style="z-index:999 !important"/>'
    );
    this.chatOpen = true;
    this.modalInstance = null;
    let obj: any,
      verify: any,
      launcher: any = null;
    verify = setInterval(() => {
      obj = document.getElementById('siteloader');
      if (
        obj.lastChild != null &&
        obj.lastChild != undefined &&
        obj.lastChild.contentDocument != null &&
        obj.lastChild.contentDocument != undefined &&
        obj.lastChild.contentDocument.body != null &&
        obj.lastChild.contentDocument.body != undefined
      ) {
        clearInterval(verify);
        obj.lastChild.contentDocument.body.addEventListener(
          'mouseup',
          this.verifyChat
        );
      }
    }, 100);
    launcher = setInterval(() => {
      obj = document.getElementById('siteloader');
      if (!this.chatOpen) {
        clearInterval(launcher);
      }
      if (
        obj.lastChild != null &&
        obj.lastChild != undefined &&
        obj.lastChild.contentDocument != null &&
        obj.lastChild.contentDocument != undefined &&
        obj.lastChild.contentDocument.body != null &&
        obj.lastChild.contentDocument.body != undefined
      ) {
        if (
          obj.lastChild.contentDocument.querySelector(
            '.inbenta .inbenta-bot__launcher__image'
          )
        ) {
          clearInterval(launcher);
          this.chatOpen = false;
          $('#siteloader').html('');
        }
      }
    }, 100);
  }
  verifyChat(event: any) {
    if (
      event != null &&
      event != undefined &&
      event.path != null &&
      event.path != undefined
    ) {
      if (event.path[0].className == 'header__actions__icon inbenta-bot-icon') {
        this.chatOpen = false;
        event.preventDefault();
      }
    }
  }
  surveyDetails(item: any) {
    this.factoryService
      .post('surveys/GetDetails', { reqNumber: item.Originating_Request_ID })
      .then((res) => {
        if (!res.isError) {
          swal.fire({
            title: 'Detalle',
            html: res.response.replace(/\n/g, '<br/>'),
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'aceptar',
          });
        }
      });
  }
  enviar(item: any) {
    this.factoryService
      .post('surveys/Set', {
        id: item.Survey_ID,
        comentario: item.Comentario,
        calificacion: item.SelectedValue.toString(),
        fecha: item.Last_Surveyed_Date,
        token: sessionStorage.getItem('X_MYIT_REQ'),
      })
      .then((res) => {
        if (!res.isError) {
          this.factoryService
            .post('surveys/GetList', {
              token: sessionStorage.getItem('X_MYIT_REQ'),
            })
            .then((resp) => {
              if (resp.isError === false && resp.response.length > 0) {
                const options = {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                };
                for (var i = 0; i < resp.response.length; i++) {
                  var d = new Date(resp.response[i].Create_date);
                  resp.response[i].Hora = d.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  });
                  resp.response[i].Fecha = d.toLocaleString('es-US');
                  resp.response[i].Active = false;
                  resp.response[i].Hover2 = false;
                  resp.response[i].Hover4 = false;
                  resp.response[i].Hover6 = false;
                  resp.response[i].Hover8 = false;
                  resp.response[i].Hover10 = false;
                  resp.response[i].SelectedValue = null;
                  resp.response[i].Comentario = '';
                }
                this.encuestas = resp.response;
              } else if (resp.isError === false && resp.response.length == 0) {
                swal.fire({
                  title: '',
                  text: 'No tienes encuestas pendientes por responder.',
                  confirmButtonColor: '#dc3545',
                  confirmButtonText: 'aceptar',
                });
                this.modalService.dismissAll('cancel');
              } else {
                swal.fire({
                  title: '',
                  text: resp.response,
                  confirmButtonColor: '#dc3545',
                  confirmButtonText: 'aceptar',
                });
                this.modalService.dismissAll('cancel');
              }
            });
        } else {
          swal.fire({
            title: '',
            text: res.response,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'aceptar',
          });
        }
      });
  }

  abrirChatInHouse() {
    this.mostrarChat = true;
  }

  cerrarChatInHouse() {
    this.mostrarChat = false;
  }

  consultarCaso() {
    this.consultarOcrearCaso = !this.consultarOcrearCaso;
    setTimeout(() => {
      this.consultaCaso = !this.consultaCaso;
    }, 400);
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  SearchReq() {
    setTimeout(() => {
      this.selectReq = !this.selectReq;
      this.selectInc = false;
      this.selectWo = false;
      this.selectHc = false;
    }, 400);
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  SearchInc() {
    setTimeout(() => {
      this.selectInc = !this.selectInc;
      this.selectReq = false;
      this.selectWo = false;
      this.selectHc = false;
    }, 400);
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  SearchWo() {
    setTimeout(() => {
      this.selectWo = !this.selectWo;
      this.selectInc = false;
      this.selectReq = false;
      this.selectHc = false;
    }, 400);
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  SearchHC() {
    setTimeout(() => {
      this.selectHc = !this.selectHc;
      this.selectWo = false;
      this.selectInc = false;
      this.selectReq = false;
    }, 500);
    this.consultarHistoricoCasos();
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  async consultarHistoricoCasos() {
    setTimeout(async () => {
      const resHc = await this.casosService.post('consultarHistoricoRequerimiento', {
       Qualification: this.infoUser.User,
       //  Qualification: "45111133",
      });

      if (resHc?.response?.lastThreeListValues) {
        const sortedValues = resHc.response.lastThreeListValues.sort((a: any, b: any) => {
          return new Date(b.Submit_Date).getTime() - new Date(a.Submit_Date).getTime();
        });

        this.noReq1 = sortedValues[0]?.Request_Number || null;
        this.noReq2 = sortedValues[1]?.Request_Number || null;
        this.noReq3 = sortedValues[2]?.Request_Number || null;

        this.noInc1 = sortedValues[0]?.AppRequestID || null;
        this.noInc2 = sortedValues[1]?.AppRequestID || null;
        this.noInc3 = sortedValues[2]?.AppRequestID || null;

        this.statusInc1 = sortedValues[0]?.Status || null;
        this.statusInc2 = sortedValues[1]?.Status || null;
        this.statusInc3 = sortedValues[2]?.Status || null;

        this.sumarryInc1 = sortedValues[0]?.Summary || null;
        this.sumarryInc2 = sortedValues[1]?.Summary || null;
        this.sumarryInc3 = sortedValues[2]?.Summary || null;

        this.fechaInc1 = sortedValues[0]?.Submit_Date || null;
        this.fechaInc2 = sortedValues[1]?.Submit_Date || null;
        this.fechaInc3 = sortedValues[2]?.Submit_Date || null;

        setTimeout(() => {
          this.scrollToBottom();
        }, 1500);
      } else {
        console.error("No se encontraron datos en lastThreeListValues.");
      }
    }, 1000);
  }


  resetChat() {
    this.consultarOcrearCaso = false;
    this.selectReq = false;
    this.consultaCaso = false;
    this.selectInc = false;
    this.selectHc = false;
    this.selectWo = false;
    this.selectHc = false;
    this.crearNota = false;

    //Variables para el boton de volver
    this.messageError = null;
    this.messageErrorWO = null;
    this.Request_Number = null;
    this.Incident_Number = null;
    this.WO_Number = null;
    this.noReq1 = null;
    this.creadoExitoso = null;
  }

  resetInfo() {
    this.numeroRequerimientoIngresado = null;
    this.Request_Number = null;
    this.fechaNotaInc1 = null;
    this.fechaNotaInc2 = null;
    this.fechaNotaInc3 = null;
    this.descriptionInc1 = null;
    this.descriptionInc2 = null;
    this.descriptionInc3 = null;
    this.creadoExitoso = '';
    this.nombreArchivo = '';
    this.detailedDescriptionCrearNotas = '';
    this.numeroIncIngresado = null;
    this.numeroWoIngresado = null;
    this.WO_Number = null;
    this.Incident_Number = null;
    this.noReq1 = null;
    this.messageError = null;
    this.messageErrorWO = null;
    this.numeroRequerimiento = '';
    this.numeroW = '';
    this.numeroI = '';
    this.descripcionIncidente = null;
    this.statusIncidente = null;
    this.descripcionIncidenteDetallada = null;
    this.fechaCreacionIncidente = null;
    this.resolution = null;
    this.fechaResolution = null;
    this.fechaNotaWo1 = null;
    this.fechaNotaWo2 = null;
    this.fechaNotaWo3 = null;
    this.base64ContentString = '';
    this.qualification = null;
    this.noReq2 = null;
    this.noReq3 = null;
    this.noInc1 = null;
    this.noInc2 = null;
    this.noInc3 = null;
    this.statusInc1 = null;
    this.statusInc2 = null;
    this.statusInc3 = null;
    this.sumarryInc1 = null;
    this.sumarryInc2 = null;
    this.sumarryInc3 = null;
    this.fechaInc1 = null;
    this.fechaInc2 = null;
    this.fechaInc3 = null;
    this.numeroNotas = null;
  }

  async consultarReq() {
    try {
      const isValid = await this.validacionSeguridad();

      if (!isValid) {
        this.numeroRequerimiento = "";
        this.scrollToBottom();
        return;
      }

      const res = await this.casosService.post('ConsultarReq', this.numberRequerimiento.value);
      this.Request_Number = res.response.Request_Number;
      this.AppRequestID = res.response.AppRequestID;
      this.Status = res.response.Status;
      this.Summary = res.response.Summary;
      this.Submit_Date = res.response.Submit_Date;
      this.Closed_Date = res.response.Closed_Date;
      this.numeroRequerimientoIngresado = res.response.Request_Number;
      this.numberRequerimiento.controls['reqNumber'].setValue('');

      setTimeout(() => {
        this.scrollToBottom();
      }, 1000);

      this.resolution = null
      if (this.AppRequestID.startsWith("INC")) {
        this.resolution
        try {
          const resINC = await this.casosService.post('ConsultarINC', {
            incNumber: this.AppRequestID,
          });

          if (resINC.response.Status) {
            this.descripcionIncidenteDetallada = resINC.response.Detailed_Decription;
            this.statusIncidente = resINC.response.Status;
            this.descripcionIncidente = resINC.response.Description;
            this.fechaCreacionIncidente = resINC.response.Submit_Date;
            this.scrollToBottom();

            const consultarNotaInc = await this.casosService.post('ConsultarNotasINC', {
              incNumber: this.AppRequestID,
            })

            this.datosCargados = false;
            this.numeroNotas = consultarNotaInc.response.lastThreeListValues.length

            if (consultarNotaInc.response.lastThreeListValues && consultarNotaInc.response.lastThreeListValues.length > 0) {
              this.fechaNotaInc1 = consultarNotaInc.response.lastThreeListValues[0]?.Submit_Date?.trim() || null;
              this.descriptionInc1 = consultarNotaInc.response.lastThreeListValues[0]?.Detailed_Description?.trim() || null;
            } else {
              this.fechaNotaInc1 = null;
              this.descriptionInc1 = null;
            }

            if (consultarNotaInc.response.lastThreeListValues && consultarNotaInc.response.lastThreeListValues.length > 1) {
              this.fechaNotaInc2 = consultarNotaInc.response.lastThreeListValues[1]?.Submit_Date?.trim() || null;
              this.descriptionInc2 = consultarNotaInc.response.lastThreeListValues[1]?.Detailed_Description?.trim() || null;
            } else {
              this.fechaNotaInc2 = null;
              this.descriptionInc2 = null;
            }

            if (consultarNotaInc.response.lastThreeListValues && consultarNotaInc.response.lastThreeListValues.length > 2) {
              this.fechaNotaInc3 = consultarNotaInc.response.lastThreeListValues[2]?.Submit_Date?.trim() || null;
              this.descriptionInc3 = consultarNotaInc.response.lastThreeListValues[2]?.Detailed_Description?.trim() || null;
            } else {
              this.fechaNotaInc3 = null;
              this.descriptionInc3 = null;
            }

            this.datosCargados = true;
            this.resolution = resINC.response.Resolution;
            this.fechaResolution = resINC.response.Real_Solution_Date;
            this.scrollToBottom();


          } else {
            this.Incident_Number = null
            this.fechaNotaInc1 = null

          }

        } catch (err) {
          console.error(err);
          this.Incident_Number = null
          this.fechaNotaInc1 = null
        }


      } else if (this.AppRequestID.startsWith("WO")) {
        try {
          const resWO = await this.casosService.post('ConsultarWO', {
            woNumber: this.AppRequestID,
          });

          if (resWO.response.Status) {
            this.descripcionIncidenteDetallada = resWO.response.Detailed_Description;
            this.statusIncidente = resWO.response.Status;
            this.descripcionIncidente = resWO.response.Summary;
            this.fechaCreacionIncidente = resWO.response.Submit_Date;
            this.scrollToBottom();

            const consultarNotaWO = await this.casosService.post('ConsultarNotasWO', {
              woNumber: this.AppRequestID,
            })

            this.datosCargados = false;

            this.numeroNotas = consultarNotaWO.response.lastThreeListValues.length

            if (consultarNotaWO.response.lastThreeListValues && consultarNotaWO.response.lastThreeListValues.length > 0) {
              this.fechaNotaInc1 = consultarNotaWO.response.lastThreeListValues[0]?.Work_Log_Submit_Date?.trim() || null;
              this.descriptionInc1 = consultarNotaWO.response.lastThreeListValues[0]?.Detailed_Description?.trim() || null;
            } else {
              this.fechaNotaInc1 = null;
              this.descriptionInc1 = null;
            }

            if (consultarNotaWO.response.lastThreeListValues && consultarNotaWO.response.lastThreeListValues.length > 1) {
              this.fechaNotaInc2 = consultarNotaWO.response.lastThreeListValues[1]?.Work_Log_Submit_Date?.trim() || null;
              this.descriptionInc2 = consultarNotaWO.response.lastThreeListValues[1]?.Detailed_Description?.trim() || null;
            } else {
              this.fechaNotaInc2 = null;
              this.descriptionInc2 = null;
            }

            if (consultarNotaWO.response.lastThreeListValues && consultarNotaWO.response.lastThreeListValues.length > 2) {
              this.fechaNotaInc3 = consultarNotaWO.response.lastThreeListValues[2]?.Work_Log_Submit_Date?.trim() || null;
              this.descriptionInc3 = consultarNotaWO.response.lastThreeListValues[2]?.Detailed_Description?.trim() || null;
            } else {
              this.fechaNotaInc3 = null;
              this.descriptionInc3 = null;
            }

            this.datosCargados = true;
            this.scrollToBottom();


          } else {
            this.WO_Number = null
            this.fechaNotaInc1 = null
          }

          setTimeout(() => {
            this.scrollToBottom();
          }, 1000);


        }
        catch (err) {
          console.error(err);
          this.WO_Number = null
          this.fechaNotaInc1 = null
        }

      }
    } catch (err) {
      console.error(err);
      this.WO_Number = null
      this.fechaNotaInc1 = null
    }
  }


  async validacionSeguridad(): Promise<boolean> {
    try {
      const res = await this.casosService.post('ConsultarReq', this.numberRequerimiento.value);
      this.AppRequestID = res.response.AppRequestID;

      if (res.response.message) {
        this.messageError = "¡Ups! Parece que este caso no existe. Te sugiero revisar esta información.";
        setTimeout(() => {
          this.scrollToBottom();
        }, 500);
        return false;
      } else {

        if (this.AppRequestID.startsWith("INC")) {
          const resINC = await this.casosService.post('ConsultarINC', { incNumber: this.AppRequestID });
          if (resINC.response?.message) {
            this.messageError = resINC.response.message;
            return false;
          }
        }

        if (this.AppRequestID.startsWith("WO")) {
          const resWO = await this.casosService.post('ConsultarWO', { woNumber: this.AppRequestID });
          if (resWO.response?.message) {
            this.messageError = resWO.response.message;
            return false;
          }
        }
      }
      return true;
    } catch (err) {
      console.error('Error en validacionSeguridad: ', err);
      return false;
    }
  }


  async consultarInc() {
    this.resolution = null;

    const resINC = await this.casosService.post('ConsultarINC', this.numberINC.value);

    if (resINC.response.message) {
      this.messageError = resINC.response.message;
      this.numeroI = "";
      setTimeout(() => {
        this.scrollToBottom();
      }, 1000);
    } else {

      this.Incident_Number = resINC.response.Incident_Number;
      this.descripcionIncidenteDetallada = resINC.response.Detailed_Decription;
      this.statusIncidente = resINC.response.Status;
      this.descripcionIncidente = resINC.response.Description;
      this.fechaCreacionIncidente = resINC.response.Submit_Date;
      this.numeroIncIngresado = resINC.response.Incident_Number;
      this.scrollToBottom();
      this.numeroI = "";

      const consultarNotaInc = await this.casosService.post('ConsultarNotasINC', this.numberINC.value);

      this.datosCargados = false;
      this.numeroNotas = consultarNotaInc.response.lastThreeListValues.length

      if (consultarNotaInc.response.lastThreeListValues && consultarNotaInc.response.lastThreeListValues.length > 0) {
        this.fechaNotaInc1 = consultarNotaInc.response.lastThreeListValues[0]?.Submit_Date?.trim() || null;
        this.descriptionInc1 = consultarNotaInc.response.lastThreeListValues[0]?.Detailed_Description?.trim() || null;
      } else {
        this.fechaNotaInc1 = null;
        this.descriptionInc1 = null;
      }

      if (consultarNotaInc.response.lastThreeListValues && consultarNotaInc.response.lastThreeListValues.length > 1) {
        this.fechaNotaInc2 = consultarNotaInc.response.lastThreeListValues[1]?.Submit_Date?.trim() || null;
        this.descriptionInc2 = consultarNotaInc.response.lastThreeListValues[1]?.Detailed_Description?.trim() || null;
      } else {
        this.fechaNotaInc2 = null;
        this.descriptionInc2 = null;
      }

      if (consultarNotaInc.response.lastThreeListValues && consultarNotaInc.response.lastThreeListValues.length > 2) {
        this.fechaNotaInc3 = consultarNotaInc.response.lastThreeListValues[2]?.Submit_Date?.trim() || null;
        this.descriptionInc3 = consultarNotaInc.response.lastThreeListValues[2]?.Detailed_Description?.trim() || null;
      } else {
        this.fechaNotaInc3 = null;
        this.descriptionInc3 = null;
      }

      this.datosCargados = true;
      // Datos adicionales
      this.resolution = resINC.response.Resolution;
      this.fechaResolution = resINC.response.Real_Solution_Date;
      this.scrollToBottom();

    }

  }


  async consultarWo() {
    try {
      const resWO = await this.casosService.post('ConsultarWO', this.numberWO.value);

      if (resWO.response?.message) {
        this.messageError = resWO.response.message;
        this.numeroW = "";
        setTimeout(() => {
          this.scrollToBottom();
        }, 1000);
        return;
      }

      this.WO_Number = resWO.response?.Work_Order_ID || null;
      this.descripcionIncidenteDetallada = resWO.response?.Detailed_Description || '';
      this.statusIncidente = resWO.response?.Status || '';
      this.descripcionIncidente = resWO.response?.Summary || '';
      this.fechaCreacionIncidente = resWO.response?.Submit_Date || '';
      this.numeroWoIngresado = resWO.response?.Work_Order_ID || '';
      this.scrollToBottom();

      const consultarNotaWO = await this.casosService.post('ConsultarNotasWO', this.numberWO.value);

      this.datosCargados = false;

      this.numeroNotas = consultarNotaWO.response.lastThreeListValues.length

      if (consultarNotaWO.response.lastThreeListValues && consultarNotaWO.response.lastThreeListValues.length > 0) {
        this.fechaNotaInc1 = consultarNotaWO.response.lastThreeListValues[0]?.Work_Log_Submit_Date?.trim() || null;
        this.descriptionInc1 = consultarNotaWO.response.lastThreeListValues[0]?.Detailed_Description?.trim() || null;
      } else {
        this.fechaNotaInc1 = null;
        this.descriptionInc1 = null;
      }

      if (consultarNotaWO.response.lastThreeListValues && consultarNotaWO.response.lastThreeListValues.length > 1) {
        this.fechaNotaInc2 = consultarNotaWO.response.lastThreeListValues[1]?.Work_Log_Submit_Date?.trim() || null;
        this.descriptionInc2 = consultarNotaWO.response.lastThreeListValues[1]?.Detailed_Description?.trim() || null;
      } else {
        this.fechaNotaInc2 = null;
        this.descriptionInc2 = null;
      }

      if (consultarNotaWO.response.lastThreeListValues && consultarNotaWO.response.lastThreeListValues.length > 2) {
        this.fechaNotaInc3 = consultarNotaWO.response.lastThreeListValues[2]?.Work_Log_Submit_Date?.trim() || null;
        this.descriptionInc3 = consultarNotaWO.response.lastThreeListValues[2]?.Detailed_Description?.trim() || null;
      } else {
        this.fechaNotaInc3 = null;
        this.descriptionInc3 = null;
      }

      this.datosCargados = true;
      this.numeroW = "";
      this.scrollToBottom();

    } catch (error) {
      this.resetInfo()
    }

  }

  async agregarNota(AppRequestID?: string) {
    try {
      if (this.peticionEnCurso) {
        console.log('La petición ya está en curso. Espere a que termine.');
        return;
      }

      this.peticionEnCurso = true;

      if (AppRequestID !== undefined) {
        if (AppRequestID.startsWith("INC")) {
          const resCrearNotasInc = await this.casosService.post('CrearNotasInc', {
            Incident_Number: AppRequestID,
            Work_Log_Submitter: this.infoUser.User,
            Detailed_Description: this.detailedDescriptionCrearNotas,
            Work_Log_Type: this.workLogType,
            WorkInfoAttachment1Name: this.nombreArchivo,
            WorkInfoAttachment1Data: this.base64ContentString,
          });
          this.creadoExitoso = "Nota creada con éxito";
          this.detailedDescriptionCrearNotas = "";
        } else if (AppRequestID.startsWith("WO")) {
          const resCrearNotasWo = await this.casosService.post('CrearNotasWo', {
            Work_Order_ID: AppRequestID,
            Work_Log_Submitter: this.infoUser.User,
            Detailed_Description: this.detailedDescriptionCrearNotas,
            Work_Log_Type: this.workLogType,
            WorkInfoAttachment1Name: this.nombreArchivo,
            WorkInfoAttachment1Data: this.base64ContentString,
          });
          this.creadoExitoso = "Nota creada con éxito";
          this.detailedDescriptionCrearNotas = "";
        }
      } else {
        console.log('AppRequestID no proporcionado. No se puede agregar nota.');
        this.detailedDescriptionCrearNotas = "";
      }
      setTimeout(() => {
        this.scrollToBottom();
      }, 1500);
    } catch (error) {
      console.error('Error al agregar nota:', error);
      this.creadoExitoso = "No es posible crear la nota";
    } finally {
      this.peticionEnCurso = false;
    }
  }

  dialogoCrearNota() {
    this.crearNota = true;
    this.scrollToBottom();

  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      this.readFileAsBase64(selectedFile)
        .then(base64Content => {
          this.nombreArchivo = `${selectedFile.name}`
          this.base64ContentString = (base64Content)
        })
        .catch(error => {
          console.error('Error al leer archivo como Base64:', error);
        });
    }
    this.scrollToBottom();

  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Content = reader.result as string;
        resolve(base64Content.split(',')[1]); // Extraer solo el contenido Base64, excluyendo el encabezado
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
    this.scrollToBottom();

  }

  scrollToBottom() {
    const element = this.content.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

  redirectToUrl(): void {
    window.location.href = 'https://miasistencia360-portal-prd.claro.com.co/admin/#/landing';
  }

}
