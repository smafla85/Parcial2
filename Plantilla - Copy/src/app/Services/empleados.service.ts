import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IEmpleados {
  empleado_id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  departamento_id: number | null;
  nombre_departamento?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  apiurl = 'http://localhost:81/parcial2/MVC/controllers/empleados.controller.php?op=';

  constructor(private http: HttpClient) {}

  todos(): Observable<IEmpleados[]> {
    return this.http.get<IEmpleados[]>(this.apiurl + 'todos');
  }

  uno(id: number): Observable<IEmpleados> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<IEmpleados>(this.apiurl + 'uno', formData);
  }

  insertar(empleado: IEmpleados): Observable<{ status: string; message: string; id?: number }> {
    const formData = new FormData();
    formData.append('nombre', empleado.nombre);
    formData.append('apellido', empleado.apellido);
    formData.append('email', empleado.email);
    formData.append('telefono', empleado.telefono);
    formData.append('departamento_id', empleado.departamento_id ? empleado.departamento_id.toString() : '');
    return this.http.post<{ status: string; message: string; id?: number }>(this.apiurl + 'insertar', formData);
  }

  actualizar(empleado: IEmpleados): Observable<{ status: string; message: string }> {
    const formData = new FormData();
    formData.append('id', empleado.empleado_id!.toString());
    formData.append('nombre', empleado.nombre);
    formData.append('apellido', empleado.apellido);
    formData.append('email', empleado.email);
    formData.append('telefono', empleado.telefono);
    formData.append('departamento_id', empleado.departamento_id ? empleado.departamento_id.toString() : '');
    return this.http.post<{ status: string; message: string }>(this.apiurl + 'actualizar', formData);
  }

  eliminar(id: number): Observable<{ status: string; message: string }> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<{ status: string; message: string }>(this.apiurl + 'eliminar', formData);
  }
}