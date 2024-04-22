import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CasosService {
  host =  './api/'
  /*'./api/'*/;
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
