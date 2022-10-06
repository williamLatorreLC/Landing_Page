import { Host, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, combineLatest, Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class FactoryService {
  host =  /*'http://localhost:8443/myit/api/'*/
  './api/';
  constructor(private http: HttpClient,) { }

  // peticiones por get
  async get(url: string) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");



    var requestOptions = {
      method: 'GET',
      headers: myHeaders,

    };

    var result = await fetch(this.host + url, requestOptions)
    const body = await result.json();
    return body
  }
  // peticiones por post

  async post(url: string, data: any) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      data
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    var result = await fetch(this.host + url, requestOptions)
    const body = await result.json();
    return body
  }
}
