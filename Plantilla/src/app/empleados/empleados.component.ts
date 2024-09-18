import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmpleadosService } from '../Services/empleados.service';
import { Iempleados } from '../Interfaces/empleados';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent implements OnInit {
  empleados: Iempleados[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private empleadosService: EmpleadosService) { }

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.loading = true;
    this.empleadosService.getEmpleados().subscribe({
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
    // Usar Router.navigate en el componente que maneja la navegación
  }

  eliminarEmpleado(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
      this.empleadosService.eliminarEmpleado(id).subscribe({
        next: () => {
          this.cargarEmpleados(); // Recargar la lista después de eliminar
        },
        error: (error) => {
          this.error = 'Error al eliminar empleado';
          console.error('Error al eliminar empleado:', error);
        }
      });
    }
  }

  nuevoEmpleado(): void {
    // Usar Router.navigate en el componente que maneja la navegación
  }
}