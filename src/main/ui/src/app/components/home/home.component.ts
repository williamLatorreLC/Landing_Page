import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('mymodalEnc', { static: false }) mymodalEnc:
    | TemplateRef<any>
    | undefined;

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
    MyItResolutor: ''
  };
  modalInstance = null;
  verify = null;

  numeroRequerimiento: string = '';
  consultaCaso: boolean = false;
  selectReq: boolean = false;

  constructor(
    private _config: NgbCarouselConfig,
    private factoryService: FactoryService,
    private router: Router,
    private modalService: NgbModal,
    private GtmServicesService: GtagService,
    private SessionService: SessionServiceService,
    private http: HttpClient
  ) {
    _config.interval = 30000;
    _config.pauseOnHover = true;
    _config.showNavigationArrows = false;
    _config.showNavigationIndicators = true;

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
  }

  ngOnInit(): void {
    this.GtmServicesService.Tagging('Home', 'pt_home');
    console.log(this.infoUser.esContingencia);

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
          console.log(this.infoUser);
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
    this.consultaCaso = !this.consultaCaso;
  }

  SearchReq() {
    this.selectReq = !this.selectReq;
  }

  consultarRequerimiento() {
    if (this.numeroRequerimiento.trim() !== '') {
      const soapRequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:SRM_Request">
          <soapenv:Header>
            <urn:AuthenticationInfo>
              <urn:userName>matilda.claro</urn:userName>
              <urn:password>Claro2018*</urn:password>
            </urn:AuthenticationInfo>
          </soapenv:Header>
          <soapenv:Body>
            <urn:Get>
              <urn:Service_Request_Number>${this.numeroRequerimiento}</urn:Service_Request_Number>
            </urn:Get>
          </soapenv:Body>
        </soapenv:Envelope>`;

        this.http.post('https://myitfull.claro.com.co:8443/arsys/services/ARService?server=remedy&webService=SRM_Request', soapRequest, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text'
      }).subscribe((response) => {
        console.log(response);
      });
    }
  }

}
