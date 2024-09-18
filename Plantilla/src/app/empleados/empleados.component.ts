import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { EmpleadoService, IEmpleados } from '../Services/empleados.service';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent implements OnInit {
  empleados: IEmpleados[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private empleadoService: EmpleadoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.loading = true;
    this.empleadoService.todos().subscribe({
      next: (data) => {
        this.empleados = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar empleados';
        this.loading = false;
        console.error('Error al cargar empleados:', error);
      }
    });
  }

  editarEmpleado(id: number): void {
    this.router.navigate(['/editarempleado', id]);
  }

  eliminarEmpleado(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
      this.empleadoService.eliminar(id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.cargarEmpleados();
          } else {
            this.error = 'Error al eliminar empleado: ' + response.message;
          }
        },
        error: (error) => {
          this.error = 'Error al eliminar empleado';
          console.error('Error al eliminar empleado:', error);
        }
      });
    }
  }

  nuevoEmpleado(): void {
    this.router.navigate(['/nuevoempleado']);
  }
}