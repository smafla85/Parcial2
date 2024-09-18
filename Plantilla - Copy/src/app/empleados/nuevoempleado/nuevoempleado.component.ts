import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmpleadosService, IEmpleados } from '../../Services/empleados.service';

@Component({
  selector: 'app-nuevoempleado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './nuevoempleado.component.html',
  styleUrls: ['./nuevoempleado.component.scss']
})
export class NuevoempleadoComponent implements OnInit {
  empleadoForm: FormGroup;
  isEditing: boolean = false;
  empleadoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadosService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.empleadoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      departamento_id: [null]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.empleadoId = +params['id'];
        this.loadEmpleado(this.empleadoId);
      }
    });
  }

  loadEmpleado(id: number): void {
    this.empleadoService.uno(id).subscribe({
      next: (empleado: IEmpleados) => {
        this.empleadoForm.patchValue(empleado);
      },
      error: (error) => {
        console.error('Error al cargar el empleado', error);
        // Manejar el error (por ejemplo, mostrar un mensaje al usuario)
      }
    });
  }

  onSubmit(): void {
    if (this.empleadoForm.valid) {
      const empleadoData: IEmpleados = this.empleadoForm.value;
      if (this.isEditing && this.empleadoId) {
        empleadoData.empleado_id = this.empleadoId;
        this.empleadoService.actualizar(empleadoData).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.router.navigate(['/empleados']);
            } else {
              console.error('Error al actualizar el empleado:', response.message);
              // Manejar el error
            }
          },
          error: (error) => {
            console.error('Error al actualizar el empleado', error);
            // Manejar el error
          }
        });
      } else {
        this.empleadoService.insertar(empleadoData).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.router.navigate(['/empleados']);
            } else {
              console.error('Error al crear el empleado:', response.message);
              // Manejar el error
            }
          },
          error: (error) => {
            console.error('Error al crear el empleado', error);
            // Manejar el error
          }
        });
      }
    }
  }
}