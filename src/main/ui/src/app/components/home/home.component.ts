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
  validarConsultaDeCaso: boolean;
  messageErrorHc: any;
  noReq4: any;
  noReq5: any;
  noInc4: any;
  noInc5: any;
  statusInc4: any;
  statusInc5: any;
  sumarryInc4: any;
  sumarryInc5: any;
  fechaInc4: any;
  fechaInc5: any;
  ocultarInputReq: any;
  ocultarInputInc: any;
  ocultarInputWo: any;
  ocultarInputNotas: any;
  calificacion: any;
  likeDisable: any;
  cargandoNotas: boolean;
  notas: any;

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
    this.validarConsultaDeCaso = false;
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
    this.GtmServicesService.Tagging('Home', 'bt_mesa_agil');
    this.mostrarChat = true;
    this.validarConsultaDeCaso = false;
    this.scrollToBottom(); 
  }

  like(){
    this.GtmServicesService.Tagging('Home', 'bt_like_mesa_agil');
    this.calificacion = "Gracias por tu opinión";
    this.likeDisable = true;
    this.scrollToBottom();
    
  }

  noLike(){
    this.GtmServicesService.Tagging('Home', 'bt_NO_like_mesa_agil');
    this.calificacion = "Gracias por tu opinión";
    this.likeDisable  = true;
    this.scrollToBottom();
  }

  cerrarChatInHouse() {
    this.mostrarChat = false;
    this.resetChat();
    this.resetInfo();
  }

  consultarCaso() {
    this.GtmServicesService.Tagging('Home', 'bt_mesa_agil_consulta_caso');
    this.consultarOcrearCaso = !this.consultarOcrearCaso;
    setTimeout(() => {
      this.consultaCaso = !this.consultaCaso;
    }, 400);
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  SearchReq() {
    this.GtmServicesService.Tagging('Home', 'bt_mesa_agil_consulta_caso_req');
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
    this.GtmServicesService.Tagging('Home', 'bt_mesa_agil_consulta_caso_inc');
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
    this.GtmServicesService.Tagging('Home', 'bt_mesa_agil_consulta_caso_wo');
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
    this.GtmServicesService.Tagging('Home', 'bt_mesa_agil_consulta_caso_historico');
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
        //Qualification: "45111133",
      });

      if (resHc?.response?.message) {
        this.messageError = resHc.response.message;
        console.log('Mensaje de error:', this.messageError);
        setTimeout(() => {
          this.scrollToBottom();
        }, 500);
        return false;
      }

      if (resHc?.response?.lastFiveListValues) {
        const sortedValues = resHc.response.lastFiveListValues.sort((a: any, b: any) => {
          return new Date(b.Submit_Date).getTime() - new Date(a.Submit_Date).getTime();
        });


        this.noReq1 = sortedValues[0]?.Request_Number || null;
        this.noReq2 = sortedValues[1]?.Request_Number || null;
        this.noReq3 = sortedValues[2]?.Request_Number || null;
        this.noReq4 = sortedValues[3]?.Request_Number || null;
        this.noReq5 = sortedValues[4]?.Request_Number || null;

        this.noInc1 = sortedValues[0]?.AppRequestID || null;
        this.noInc2 = sortedValues[1]?.AppRequestID || null;
        this.noInc3 = sortedValues[2]?.AppRequestID || null;
        this.noInc4 = sortedValues[3]?.AppRequestID || null;
        this.noInc5 = sortedValues[4]?.AppRequestID || null;

        this.statusInc1 = sortedValues[0]?.Status || null;
        this.statusInc2 = sortedValues[1]?.Status || null;
        this.statusInc3 = sortedValues[2]?.Status || null;
        this.statusInc4 = sortedValues[3]?.Status || null;
        this.statusInc5 = sortedValues[4]?.Status || null;

        this.sumarryInc1 = sortedValues[0]?.Summary || null;
        this.sumarryInc2 = sortedValues[1]?.Summary || null;
        this.sumarryInc3 = sortedValues[2]?.Summary || null;
        this.sumarryInc4 = sortedValues[3]?.Summary || null;
        this.sumarryInc5 = sortedValues[4]?.Summary || null;

        this.fechaInc1 = sortedValues[0]?.Submit_Date || null;
        this.fechaInc2 = sortedValues[1]?.Submit_Date || null;
        this.fechaInc3 = sortedValues[2]?.Submit_Date || null;
        this.fechaInc4 = sortedValues[3]?.Submit_Date || null;
        this.fechaInc5 = sortedValues[4]?.Submit_Date || null;

        setTimeout(() => {
          this.scrollToBottom();
        }, 1500);
      } else {
        console.error("No se encontraron datos en lastFiveListValues.");
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
    this.ocultarInputReq = false;
    this.ocultarInputInc = false;
    this.ocultarInputWo = false;
    this.ocultarInputNotas = false;
    this.calificacion = null;
    this.likeDisable = false;

    //Variables para el boton de volver
    this.messageErrorHc = null;
    this.messageError = null;
    this.messageErrorWO = null;
    this.Request_Number = null;
    this.Incident_Number = null;
    this.WO_Number = null;
    this.noReq1 = null;
    this.creadoExitoso = null;
    this.notas = null;

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
    this.messageErrorHc = null;
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
    this.noReq4 = null;
    this.noReq5 = null;
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
    this.noInc4 = null;
    this.noInc5 = null;
    this.statusInc4 = null;
    this.statusInc5 = null;
    this.sumarryInc4 = null;
    this.sumarryInc5 = null;
    this.fechaInc4 = null;
    this.fechaInc5 = null;
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

  async consultarReq() {
    try {
      // Validación de seguridad previa
      const isValid = await this.validacionSeguridad();
      if (!isValid) {
        this.numeroRequerimientoIngresado = this.numeroRequerimiento;
        this.ocultarInputReq = true;
        this.numeroRequerimiento = "";
        this.scrollToBottom();
        return;
      }
  
      // Consultar requerimiento
      const res = await this.casosService.post('ConsultarReq', this.numberRequerimiento.value);
      this.ocultarInputReq = true;
      this.Request_Number = res.response.Request_Number;
      this.AppRequestID = res.response.AppRequestID;
      this.Status = res.response.Status;
      this.Summary = res.response.Summary;
      this.Submit_Date = res.response.Submit_Date;
      this.Closed_Date = res.response.Closed_Date;
      this.numeroRequerimientoIngresado = res.response.Request_Number;
      this.numberRequerimiento.controls['reqNumber'].setValue('');
      this.GtmServicesService.Tagging('Home', 'bt_mesa_agil_consulta_caso_req_success');
  
      setTimeout(() => {
        this.scrollToBottom();
      }, 1000);
  
      // Resetear resolución y notas
      this.resolution = null;
      this.fechaResolution = null;
      this.notas = []; // Array dinámico para las notas
      this.cargandoNotas = false;
  
      // Si es un INC
      if (this.AppRequestID.startsWith("INC")) {
        try {
          // Consultamos incidente
          const resINC = await this.casosService.post('ConsultarINC', { incNumber: this.AppRequestID });
          if (resINC.response.Status) {
            this.descripcionIncidenteDetallada = resINC.response.Detailed_Decription;
            this.statusIncidente = resINC.response.Status;
            this.descripcionIncidente = resINC.response.Description;
            this.fechaCreacionIncidente = resINC.response.Submit_Date;
  
            this.scrollToBottom();
  
            // Consultamos las notas
            this.cargandoNotas = true;
            const consultarNotaInc = await this.casosService.post('ConsultarNotasINC', { incNumber: this.AppRequestID });
            this.notas = consultarNotaInc.response.lastThreeListValues.map((nota: { Submit_Date: string; Detailed_Description: string; }) => ({
              Submit_Date: nota.Submit_Date?.trim() || null,
              Detailed_Description: nota.Detailed_Description?.trim() || null
            }));
  
            if (this.notas.length === 0) {
              this.messageError = "Este caso aún no tiene notas disponibles.";
            }
  
            // Solución
            this.resolution = resINC.response.Resolution;
            this.fechaResolution = resINC.response.Real_Solution_Date;
  
            this.cargandoNotas = false;
            this.scrollToBottom();
          } else {
            // No se encontró el INC
            this.Incident_Number = null;
          }
        } catch (err) {
          console.error(err);
          this.Incident_Number = null;
          this.cargandoNotas = false;
        }
  
      // Si es un WO
      } else if (this.AppRequestID.startsWith("WO")) {
        try {
          // Consultamos la Work Order
          const resWO = await this.casosService.post('ConsultarWO', { woNumber: this.AppRequestID });
          if (resWO.response.Status) {
            this.descripcionIncidenteDetallada = resWO.response.Detailed_Description;
            this.statusIncidente = resWO.response.Status;
            this.descripcionIncidente = resWO.response.Summary;
            this.fechaCreacionIncidente = resWO.response.Submit_Date;
  
            this.scrollToBottom();
  
            // Consultamos las notas
            this.cargandoNotas = true;
            const consultarNotaWO = await this.casosService.post('ConsultarNotasWO', { woNumber: this.AppRequestID });
            this.notas = consultarNotaWO.response.lastThreeListValues.map((nota: { Work_Log_Submit_Date: string; Detailed_Description: string; }) => ({
              Submit_Date: nota.Work_Log_Submit_Date?.trim() || null,
              Detailed_Description: nota.Detailed_Description?.trim() || null
            }));
  
            if (this.notas.length === 0) {
              this.messageError = "Este caso aún no tiene notas disponibles.";
            }
  
            this.cargandoNotas = false;
            this.scrollToBottom();
          } else {
            // No se encontró la WO
            this.WO_Number = null;
            this.cargandoNotas = false;
          }
  
          setTimeout(() => {
            this.scrollToBottom();
          }, 1000);
        } catch (err) {
          console.error(err);
          this.WO_Number = null;
          this.cargandoNotas = false;
        }
      }
    } catch (err) {
      console.error(err);
      this.WO_Number = null;
      this.cargandoNotas = false;
    }
  }
  

  async consultarInc() {
    try {
      // Reiniciar estados
      this.resolution = null;
      this.fechaResolution = null;
      this.cargandoNotas = false;
      this.notas = []; // Array para las notas
  
      // Consultar Incidente
      const resINC = await this.casosService.post('ConsultarINC', this.numberINC.value);
  
      if (resINC.response.message) {
        // Error al consultar
        this.numeroIncIngresado = this.numeroI;
        this.messageError = resINC.response.message;
        this.numeroI = "";
        this.ocultarInputInc = true;
        setTimeout(() => {
          this.scrollToBottom();
        }, 1000);
        return;
      } else {
        // Datos del incidente
        this.Incident_Number = resINC.response.Incident_Number;
        this.descripcionIncidenteDetallada = resINC.response.Detailed_Decription;
        this.statusIncidente = resINC.response.Status;
        this.descripcionIncidente = resINC.response.Description;
        this.fechaCreacionIncidente = resINC.response.Submit_Date;
        this.numeroIncIngresado = resINC.response.Incident_Number;
        this.ocultarInputInc = true;
        this.scrollToBottom();
        this.GtmServicesService.Tagging('Home', 'bt_mesa_agil_consulta_caso_inc_success');
        this.numeroI = "";
  
        // Consultar notas
        this.cargandoNotas = true;
        const consultarNotaInc = await this.casosService.post('ConsultarNotasINC', this.numberINC.value);
        this.notas = consultarNotaInc.response.lastThreeListValues.map((nota: { Submit_Date: string; Detailed_Description: string; }) => ({
          Submit_Date: nota.Submit_Date?.trim() || null,
          Detailed_Description: nota.Detailed_Description?.trim() || null
        }));
  
        if (this.notas.length === 0) {
          this.messageError = "Este caso aún no tiene notas disponibles.";
        }
  
        // Datos adicionales
        this.resolution = resINC.response.Resolution;
        this.fechaResolution = resINC.response.Real_Solution_Date;
  
        this.cargandoNotas = false;
        this.scrollToBottom();
      }
    } catch (error) {
      console.error(error);
      this.cargandoNotas = false;
    }
  }
  

  async consultarWo() {
    try {
      // Reiniciar estados
      this.cargandoNotas = false;
      this.notas = []; // Array para las notas
  
      // Consultar Work Order
      const resWO = await this.casosService.post('ConsultarWO', this.numberWO.value);
      if (resWO.response?.message) {
        this.numeroWoIngresado = this.numeroW;
        this.messageError = resWO.response.message;
        this.numeroW = "";
        this.ocultarInputWo = true;
        setTimeout(() => {
          this.scrollToBottom();
        }, 1000);
        return;
      }
  
      // Datos de la WO
      this.WO_Number = resWO.response?.Work_Order_ID || null;
      this.descripcionIncidenteDetallada = resWO.response?.Detailed_Description || '';
      this.statusIncidente = resWO.response?.Status || '';
      this.descripcionIncidente = resWO.response?.Summary || '';
      this.fechaCreacionIncidente = resWO.response?.Submit_Date || '';
      this.numeroWoIngresado = resWO.response?.Work_Order_ID || '';
      this.ocultarInputWo = true;
      this.GtmServicesService.Tagging('Home', 'bt_mesa_agil_consulta_caso_wo_success');
      this.scrollToBottom();
  
      // Consultar notas
      this.cargandoNotas = true;
      const consultarNotaWO = await this.casosService.post('ConsultarNotasWO', this.numberWO.value);
      this.notas = consultarNotaWO.response.lastThreeListValues.map((nota: { Work_Log_Submit_Date: string; Detailed_Description: string; }) => ({
        Submit_Date: nota.Work_Log_Submit_Date?.trim() || null,
        Detailed_Description: nota.Detailed_Description?.trim() || null
      }));
  
      if (this.notas.length === 0) {
        this.messageError = "Este caso aún no tiene notas disponibles.";
      }
  
      this.cargandoNotas = false;
      this.numeroW = "";
      this.scrollToBottom();
    } catch (error) {
      console.error(error);
      this.resetInfo();
      this.cargandoNotas = false;
    }
  }
  

  async agregarNota(AppRequestID?: string, ) {
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
          this.ocultarInputNotas = true;
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
          this.ocultarInputNotas = true;
          this.creadoExitoso = "Nota creada con éxito";
          this.detailedDescriptionCrearNotas = "";
        }
      } else {
        this.ocultarInputNotas = true;
        console.log('AppRequestID no proporcionado. No se puede agregar nota.');
        this.detailedDescriptionCrearNotas = "";
      }
      setTimeout(() => {
        this.scrollToBottom();
      }, 1500);
    } catch (error) {
      this.ocultarInputNotas = true;
      console.error('Error al agregar nota:', error);
      this.creadoExitoso = "No es posible crear la nota";
    } finally {
      this.peticionEnCurso = false;
    }
  }

  dialogoCrearNota(statusIncidente: string) {
    if(statusIncidente === 'Cancelled'){
      console.log(statusIncidente)
      this.crearNota = false;
      this.messageError = 'El caso ha sido cancelado y actualmente no permite agregar notas adicionales.'
      this.scrollToBottom();
    } else {
      this.crearNota = true;
      this.scrollToBottom();
    }
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files.length > 0 ? event.target.files[0] : null;
  
    if (selectedFile) {
      this.readFileAsBase64(selectedFile)
        .then(base64Content => {
          this.nombreArchivo = selectedFile.name; // Asigna el nombre del archivo seleccionado
          this.base64ContentString = base64Content;
        })
        .catch(error => {
          console.error('Error al leer archivo como Base64:', error);
        });
    } else {
      this.nombreArchivo = 'Ningún archivo seleccionado'; // Si no se selecciona archivo, muestra un mensaje predeterminado
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
    window.open('https://miasistencia360-portal-prd.claro.com.co/admin/#/landing', '_blank');
  }

  validarConsulta() {
    this.GtmServicesService.Tagging('Home', 'bt_anita');
    this.validarConsultaDeCaso = true;
  }

  toggleMinimizar() {
    this.mostrarChat = false; 
  }

}
