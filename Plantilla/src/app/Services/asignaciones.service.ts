import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAsignacion } from '../Interfaces/asignaciones';

@Injectable({
  providedIn: 'root'
})
export class AsignacionesService {
  private apiUrl = 'http://localhost:81/parcial2/MVC/controllers/asignaciones.controller.php?op=';

  constructor(private http: HttpClient) { }

  todas(): Observable<IAsignacion[]> {
    return this.http.get<IAsignacion[]>(`${this.apiUrl}todas`);
  }

  una(id: number): Observable<IAsignacion> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<IAsignacion>(`${this.apiUrl}una`, formData);
  }

  insertar(asignacion: IAsignacion): Observable<{status: string, message: string, id?: number}> {
    const formData = new FormData();
    formData.append('empleado_id', asignacion.empleado_id.toString());
    formData.append('departamento_id', asignacion.departamento_id.toString());
    formData.append('fecha_inicio', asignacion.fecha_inicio);
    if (asignacion.fecha_fin) {
      formData.append('fecha_fin', asignacion.fecha_fin);
    }
    return this.http.post<{status: string, message: string, id?: number}>(`${this.apiUrl}insertar`, formData);
  }

  actualizar(asignacion: IAsignacion): Observable<{status: string, message: string}> {
    const formData = new FormData();
    formData.append('id', asignacion.asignacion_id!.toString());
    formData.append('empleado_id', asignacion.empleado_id.toString());
    formData.append('departamento_id', asignacion.departamento_id.toString());
    formData.append('fecha_inicio', asignacion.fecha_inicio);
    if (asignacion.fecha_fin) {
      formData.append('fecha_fin', asignacion.fecha_fin);
    }
    return this.http.post<{status: string, message: string}>(`${this.apiUrl}actualizar`, formData);
  }

  eliminar(id: number): Observable<{status: string, message: string}> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<{status: string, message: string}>(`${this.apiUrl}eliminar`, formData);
  }
}