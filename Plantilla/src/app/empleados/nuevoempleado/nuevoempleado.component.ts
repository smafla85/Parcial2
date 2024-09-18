import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmpleadosService } from '../../Services/empleados.service';
import { Iempleados } from '../../Interfaces/empleados';

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
    private empleadosService: EmpleadosService,
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
    this.empleadosService.getEmpleado(id).subscribe({
      next: (empleado: Iempleados) => {
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
      const empleadoData: Iempleados = this.empleadoForm.value;
      if (this.isEditing && this.empleadoId) {
        empleadoData.empleado_id = this.empleadoId;
        this.empleadosService.actualizarEmpleado(empleadoData).subscribe({
          next: () => {
            this.router.navigate(['/empleados']);
          },
          error: (error) => {
            console.error('Error al actualizar el empleado', error);
            // Manejar el error
          }
        });
      } else {
        this.empleadosService.crearEmpleado(empleadoData).subscribe({
          next: () => {
            this.router.navigate(['/empleados']);
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