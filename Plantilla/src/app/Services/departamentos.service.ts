import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IDepartamento {
  departamento_id?: number;
  nombre: string;
  ubicacion: string;
  jefe_departamento: string;
  extension?: string;  // Ahora es opcional
}

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private apiUrl = 'http://localhost:81/parcial2/MVC/controllers/departamentos.controller.php?op=';

  constructor(private http: HttpClient) { }

  todos(): Observable<IDepartamento[]> {
    return this.http.get<IDepartamento[]>(`${this.apiUrl}todos`);
  }

  uno(id: number): Observable<IDepartamento> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<IDepartamento>(`${this.apiUrl}uno`, formData);
  }

  insertar(departamento: IDepartamento): Observable<{status: string, message: string, id?: number}> {
    const formData = new FormData();
    formData.append('nombre', departamento.nombre);
    formData.append('ubicacion', departamento.ubicacion);
    formData.append('jefe_departamento', departamento.jefe_departamento);
    if (departamento.extension) {
      formData.append('extension', departamento.extension);
    }
    return this.http.post<{status: string, message: string, id?: number}>(`${this.apiUrl}insertar`, formData);
  }

  actualizar(departamento: IDepartamento): Observable<{status: string, message: string}> {
    const formData = new FormData();
    formData.append('id', departamento.departamento_id!.toString());
    formData.append('nombre', departamento.nombre);
    formData.append('ubicacion', departamento.ubicacion);
    formData.append('jefe_departamento', departamento.jefe_departamento);
    if (departamento.extension) {
      formData.append('extension', departamento.extension);
    }
    return this.http.post<{status: string, message: string}>(`${this.apiUrl}actualizar`, formData);
  }

  eliminar(id: number): Observable<{status: string, message: string}> {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post<{status: string, message: string}>(`${this.apiUrl}eliminar`, formData);
  }
}