import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IEmpleados {
  empleado_id?: number;
  nombre: string;
  apellido: string;
  email?: string;  // Ahora es opcional
  telefono?: string;  // Ahora es opcional
  departamento_id?: number;  // Ahora es opcional
  nombre_departamento?: string;  // Si lo usas
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:81/parcial2/MVC/controllers/empleados.controller.php?op=';

  constructor(private http: HttpClient) { }

  todos(): Observable<IEmpleados[]> {
    return this.http.get<IEmpleados[]>(`${this.apiUrl}todos`);
  }

  uno(id: number): Observable<IEmpleados> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<IEmpleados>(`${this.apiUrl}uno`, formData);
  }

  insertar(empleado: IEmpleados): Observable<{status: string, message: string, id?: number}> {
    const formData = new FormData();
    formData.append('nombre', empleado.nombre);
    formData.append('apellido', empleado.apellido);
    if (empleado.email) formData.append('email', empleado.email);
    if (empleado.telefono) formData.append('telefono', empleado.telefono);
    if (empleado.departamento_id) formData.append('departamento_id', empleado.departamento_id.toString());
    return this.http.post<{status: string, message: string, id?: number}>(`${this.apiUrl}insertar`, formData);
  }

  /*actualizar(empleado: IEmpleados): Observable<{status: string, message: string}> {
    const formData = new FormData();
    formData.append('empleado_id', empleado.empleado_id!.toString());
    formData.append('nombre', empleado.nombre);
    formData.append('apellido', empleado.apellido);
    if (empleado.email) formData.append('email', empleado.email);
    if (empleado.telefono) formData.append('telefono', empleado.telefono);
    if (empleado.departamento_id) formData.append('departamento_id', empleado.departamento_id.toString());
    return this.http.post<{status: string, message: string}>(`${this.apiUrl}actualizar`, formData);
  }*/

    actualizar(empleado: IEmpleados): Observable<{status: string, message: string}> {
      const formData = new FormData();
      formData.append('empleado_id', empleado.empleado_id!.toString());
      formData.append('nombre', empleado.nombre);
      formData.append('apellido', empleado.apellido);
      formData.append('email', empleado.email || '');
      formData.append('telefono', empleado.telefono || '');
      formData.append('departamento_id', empleado.departamento_id?.toString() || '');
    
      return this.http.post<{status: string, message: string}>(`${this.apiUrl}actualizar`, formData);
    }

  eliminar(id: number): Observable<{status: string, message: string}> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<{status: string, message: string}>(`${this.apiUrl}eliminar`, formData);
  }
}