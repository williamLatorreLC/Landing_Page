import { Component } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { SessionServiceService } from '../app/services/sessionService/session-service.service';
import { FactoryService } from 'src/app/services/factory/factory.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'myIT';

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date;
  closeSession: Subscription;
  tiempoInactividad: any;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private SessionService: SessionServiceService,
    private factoryService: FactoryService,
    private router: Router
  ) {
    // Segundos para detectar la inactividad
    idle.setIdle(1);
    
    // Establecer los interrupciones
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      console.log(this.idleState);
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);
      this.cerrarsesion();
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!';
      console.log(this.idleState);
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      console.log(this.idleState);
    });

    keepalive.interval(15);
    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.SessionService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        this.getInfo(); // Llama a getInfo para establecer tiempoInactividad
        idle.watch();
        this.timedOut = false;
        this.closeSession = interval(4000).subscribe(() => {
          this.getInfo();
        });
      } else {
        this.closeSession.unsubscribe();
        idle.stop();
      }
    });
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  cerrarsesion() {
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

  getInfo() {
    this.factoryService
      .post('utils/dec', { token: sessionStorage.getItem('X_MYIT_LAND') })
      .then((res) => {
        this.tiempoInactividad = res.response.map.tiempoInactividad;
        console.log(this.tiempoInactividad);
        
        // Convertir tiempoInactividad a número y establecer el timeout
        const timeoutValue: number = parseInt(this.tiempoInactividad, 10);
        if (!isNaN(timeoutValue)) {
          this.idle.setTimeout(timeoutValue); // Establecer timeout en segundos
        } else {
          console.error("Error: tiempoInactividad no es un número válido.");
        }

        if (res.isError === true) {
          this.cerrarsesion();
        }
      });
  }
}
