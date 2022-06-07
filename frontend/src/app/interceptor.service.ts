import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const Authorization = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Il9Kb0VxLU5QcnNtRlYxV2V6MXBUZSJ9.eyJpc3MiOiJodHRwczovL2Rldi1zN2tpbTV6cS5ldS5hdXRoMC5jb20vIiwic3ViIjoic21UY2lId3B4dUoxclFkbDZWVzlWN051UGE2OThNYnpAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcHJhbXB0YS5jb20iLCJpYXQiOjE2NTQ1Mzk4MTEsImV4cCI6MTY1NDYyNjIxMSwiYXpwIjoic21UY2lId3B4dUoxclFkbDZWVzlWN051UGE2OThNYnoiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.a_CAtfe-OEnKM2DxBmtqnirQOSNbOyUliObEUr6utqZxAYoJYO-jh2lcLEeQ89bMtZ6waapmSbagpmjQRrlZEko54_Q9Kd_zR_0Ep8j_X9SmqtYY7cYTVuDV_P4cZBr56kYeizWThuZ85tS4SZ4XczG-aWc8ra-senXUwtiaYaX6LerTvcw4PjRSHBzRcXN2PrLWI17i7dtV-vpw7H0o8LLVWYbwXeh5-EakUwLYtO3W1niCIBllt4vYbPOqu7orHaS5e21SAD0jj8bodF3vaTWKiCT3CBpPw50ujzce_xRpT8kr-B_89cSXSf7rqk67pv9n1It0iqFWchhwF4zVPw';
    return next.handle(httpRequest.clone({ setHeaders: { Authorization } }));
  }
}