import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AsignacionesService } from '../../Services/asignaciones.service';
import { EmpleadoService } from '../../Services/empleados.service';
import { DepartamentoService } from '../../Services/departamentos.service';
import { IAsignacion } from '../../Interfaces/asignaciones';
import { Iempleados } from '../../Interfaces/empleados';
import { Idepartamento } from '../../Interfaces/departamentos';

@Component({
  selector: 'app-nuevaasignacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nuevaasignacion.component.html',
  styleUrls: ['./nuevaasignacion.component.scss']
})
export class NuevaasignacionComponent implements OnInit {
  asignacionForm: FormGroup;
  isEditing: boolean = false;
  empleados: Iempleados[] = [];
  departamentos: Idepartamento[] = [];

  constructor(
    private fb: FormBuilder,
    private asignacionesService: AsignacionesService,
    private empleadosService: EmpleadoService,
    private departamentosService: DepartamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.asignacionForm = this.fb.group({
      empleado_id: ['', Validators.required],
      departamento_id: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['']
    });
  }

  ngOnInit(): void {
    this.cargarEmpleados();
    this.cargarDepartamentos();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.cargarAsignacion(+id);
    }
  }

  cargarEmpleados(): void {
    this.empleadosService.todos().subscribe({
      next: (data) => this.empleados = data,
      error: (error) => console.error('Error al cargar empleados:', error)
    });
  }

  cargarDepartamentos(): void {
    this.departamentosService.todos().subscribe({
      next: (data) => this.departamentos = data,
      error: (error) => console.error('Error al cargar departamentos:', error)
    });
  }

  cargarAsignacion(id: number): void {
    this.asignacionesService.una(id).subscribe({
      next: (asignacion) => {
        this.asignacionForm.patchValue(asignacion);
      },
      error: (error) => console.error('Error al cargar la asignación:', error)
    });
  }

  onSubmit(): void {
    if (this.asignacionForm.valid) {
      const asignacionData: IAsignacion = this.asignacionForm.value;
      if (this.isEditing) {
        const id = this.route.snapshot.paramMap.get('id');
        asignacionData.asignacion_id = Number(id);
        this.asignacionesService.actualizar(asignacionData).subscribe({
          next: () => this.router.navigate(['/asignaciones']),
          error: (error) => console.error('Error al actualizar la asignación:', error)
        });
      } else {
        this.asignacionesService.insertar(asignacionData).subscribe({
          next: () => this.router.navigate(['/asignaciones']),
          error: (error) => console.error('Error al crear la asignación:', error)
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/asignaciones']);
  }
}