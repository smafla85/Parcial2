import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AsignacionesService } from '../Services/asignaciones.service';
import { IAsignacion } from '../Interfaces/asignaciones';

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.scss']
})
export class AsignacionesComponent implements OnInit {
  asignaciones: IAsignacion[] = [];
  loading: boolean = true;

  constructor(
    private asignacionesService: AsignacionesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarAsignaciones();
  }

  cargarAsignaciones(): void {
    this.loading = true;
    this.asignacionesService.todas().subscribe({
      next: (data) => {
        this.asignaciones = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar asignaciones:', error);
        this.loading = false;
      }
    });
  }

  nuevaAsignacion(): void {
    this.router.navigate(['/nuevaasignacion']);
  }

  editarAsignacion(id: number): void {
    this.router.navigate(['/editarasignacion', id]);
  }

  eliminarAsignacion(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta asignación?')) {
      this.asignacionesService.eliminar(id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.cargarAsignaciones();
          } else {
            console.error('Error al eliminar asignación:', response.message);
          }
        },
        error: (error) => {
          console.error('Error al eliminar asignación:', error);
        }
      });
    }
  }

  generarReporte(): void {
    const reportUrl = 'http://localhost:81/parcial2/MVC/reports/asignaciones.reports.php';
    window.open(reportUrl, '_blank');
  }
}