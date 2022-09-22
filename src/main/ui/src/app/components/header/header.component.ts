import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  activeRoute = location.hash
  activeRouteLC = false;
  PreviousUrl = ""
  constructor() { }

  ngOnInit(): void {
    this.activeRoute = this.activeRoute.replace('#/', '');
    console.log(this.activeRoute);
    if (this.activeRoute != 'listaCasos') {
      this.activeRouteLC = true;
    } else {
      this.activeRouteLC = false;
    }
  }

}
