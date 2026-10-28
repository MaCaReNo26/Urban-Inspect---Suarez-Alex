import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Incident } from '../models/incident.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // URL de tu MockAPI (recurso /incidencias)
  private mockApiUrl = 'https://6ae15146be3bc8fead9862de.mockapi.io/incidencias';

  constructor(private http: HttpClient) { }

  // R3: Carga progresiva y paginación remota adaptada para MockAPI


  getIncidents(page: number, limit: number = 10): Observable<Incident[]> {
    const url = `${this.mockApiUrl}?page=${page}&limit=${limit}`;

    return this.http.get<Incident[]>(url);
  }



  // R9: Actualización y persistencia remota
  updateIncident(id: string, data: Partial<Incident>): Observable<Incident> {
    return this.http.put<Incident>(`${this.mockApiUrl}/${id}`, data);
  }

  // R5: Crear nueva incidencia
  createIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.mockApiUrl, incident);
  }

  // R4: Consulta meteorológica real (Open-Meteo)
  getWeather(lat: number, lng: number): Observable<any> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation,weather_code`;
    return this.http.get(url);
  }
}