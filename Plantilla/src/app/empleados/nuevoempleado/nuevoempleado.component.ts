import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { EmpleadoService} from '../../Services/empleados.service';
import { Iempleados} from 'src/app/Interfaces/empleados';
import { DepartamentoService} from '../../Services/departamentos.service';
import { Idepartamento} from '../../Interfaces/departamentos';

@Component({
  selector: 'app-nuevoempleado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './nuevoempleado.component.html',
  styleUrl: './nuevoempleado.component.scss'
})
export class NuevoEmpleadoComponent implements OnInit {
  empleadoForm: FormGroup;
  isEditing: boolean = false;
  empleadoId: number | null = null;
  departamentos: Idepartamento[] = [];

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private departamentoService: DepartamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.empleadoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      departamento_id: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.empleadoId = +params['id'];
        this.cargarDatosEmpleado();
      }
    });
  }

  cargarDepartamentos(): void {
    this.departamentoService.todos().subscribe({
      next: (departamentos) => {
        this.departamentos = departamentos;
      },
      error: (error) => {
        console.error('Error al cargar departamentos:', error);
      }
    });
  }

  cargarDatosEmpleado(): void {
    if (this.empleadoId) {
      this.empleadoService.uno(this.empleadoId).subscribe({
        next: (empleado: Iempleados) => {
          this.empleadoForm.patchValue(empleado);
        },
        error: (error) => {
          console.error('Error al cargar los datos del empleado:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.empleadoForm.valid) {
      const empleadoData: Iempleados = {
        ...this.empleadoForm.value,
        empleado_id: this.isEditing ? this.empleadoId : undefined
      };
  
      if (this.isEditing && this.empleadoId) {
        this.empleadoService.actualizar(empleadoData).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              console.log('Empleado actualizado con éxito');
              this.router.navigate(['/empleados']);
            } else {
              console.error('Error al actualizar empleado:', response.message);
              // Mostrar el mensaje de error al usuario
            }
          },
          error: (error) => {
            console.error('Error al actualizar empleado:', error);
            // Mostrar el error al usuario
          }
        });
      } else {
        this.empleadoService.insertar(empleadoData).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              console.log('Empleado creado con éxito');
              this.router.navigate(['/empleados']);
            } else {
              console.error('Error al crear empleado:', response.message);
            }
          },
          error: (error) => {
            console.error('Error al crear empleado:', error);
          }
        });
      }
    }
  }
}