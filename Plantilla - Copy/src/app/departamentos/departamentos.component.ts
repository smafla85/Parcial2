import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DepartamentoService } from '../Services/departamentos.service';
import { Idepartamento } from '../Interfaces/departamentos';


@Component({
  selector: 'app-departamentos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.scss']
})
export class DepartamentosComponent implements OnInit {
  departamentos: Idepartamento[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private departamentoService: DepartamentoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarDepartamentos();
  }

  cargarDepartamentos(): void {
    this.loading = true;
    this.departamentoService.todos().subscribe({
      next: (data) => {
        this.departamentos = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar departamentos';
        this.loading = false;
        console.error('Error al cargar departamentos:', error);
      }
    });
  }

  editarDepartamento(id: number): void {
    this.router.navigate(['/editardepartamento', id]);
  }

  eliminarDepartamento(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este departamento?')) {
      this.departamentoService.eliminar(id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.cargarDepartamentos();
          } else {
            this.error = 'Error al eliminar departamento: ' + response.message;
          }
        },
        error: (error) => {
          this.error = 'Error al eliminar departamento';
          console.error('Error al eliminar departamento:', error);
        }
      });
    }
  }

  nuevoDepartamento(): void {
    this.router.navigate(['/nuevodepartamento']);
  }
}