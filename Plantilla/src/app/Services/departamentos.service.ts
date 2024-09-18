import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Idepartamento } from '../Interfaces/departamentos';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {
  private apiUrl = 'http://localhost:81/parcial2/MVC/controllers/departamentos.controller.php';

  constructor(private http: HttpClient) { }

  getDepartamentos(): Observable<Idepartamento[]> {
    return this.http.get<Idepartamento[]>(`${this.apiUrl}?op=todos`);
  }

  getDepartamento(id: number): Observable<Idepartamento> {
    return this.http.post<Idepartamento>(`${this.apiUrl}?op=uno`, { id });
  }

  crearDepartamento(departamento: Idepartamento): Observable<any> {
    return this.http.post(`${this.apiUrl}?op=insertar`, departamento);
  }

  actualizarDepartamento(departamento: Idepartamento): Observable<any> {
    return this.http.post(`${this.apiUrl}?op=actualizar`, departamento);
  }

  eliminarDepartamento(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}?op=eliminar`, { id });
  }
}