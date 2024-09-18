import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iempleados } from '../Interfaces/empleados';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = 'http://localhost:81/parcial2/MVC/controllers/empleados.controller.php';

  constructor(private http: HttpClient) { }

  getEmpleados(): Observable<Iempleados[]> {
    return this.http.get<Iempleados[]>(`${this.apiUrl}?op=todos`);
  }

  getEmpleado(id: number): Observable<Iempleados> {
    return this.http.post<Iempleados>(`${this.apiUrl}?op=uno`, { id });
  }

  crearEmpleado(empleado: Iempleados): Observable<any> {
    return this.http.post(`${this.apiUrl}?op=insertar`, empleado);
  }

  actualizarEmpleado(empleado: Iempleados): Observable<any> {
    return this.http.post(`${this.apiUrl}?op=actualizar`, empleado);
  }

  eliminarEmpleado(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}?op=eliminar`, { id });
  }
}