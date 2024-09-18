import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DepartamentoService } from '../../Services/departamentos.service';
import { Idepartamento } from 'src/app/Interfaces/departamentos';
@Component({
  selector: 'app-nuevodepartamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './nuevodepartamento.component.html',
  styleUrl: './nuevodepartamento.component.scss'
})
export class NuevodepartamentoComponent implements OnInit {
  departamentoForm: FormGroup;
  isEditing: boolean = false;
  departamentoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.departamentoForm = this.fb.group({
      nombre: ['', Validators.required],
      ubicacion: ['', Validators.required],
      jefe_departamento: [''],
      extension: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.departamentoId = +params['id'];
        this.cargarDatosDepartamento();
      }
    });
  }

  cargarDatosDepartamento(): void {
    if (this.departamentoId) {
      this.departamentoService.uno(this.departamentoId).subscribe({
        next: (departamento: Idepartamento) => {
          this.departamentoForm.patchValue(departamento);
        },
        error: (error) => {
          console.error('Error al cargar los datos del departamento:', error);
          // Aquí puedes añadir lógica para manejar el error, como mostrar un mensaje al usuario
        }
      });
    }
  }

  onSubmit(): void {
    if (this.departamentoForm.valid) {
      const departamentoData: Idepartamento = this.departamentoForm.value;
      if (this.isEditing && this.departamentoId) {
        departamentoData.departamento_id = this.departamentoId;
        this.departamentoService.actualizar(departamentoData).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              console.log('Departamento actualizado con éxito');
              this.router.navigate(['/departamentos']);
            } else {
              console.error('Error al actualizar departamento:', response.message);
            }
          },
          error: (error) => {
            console.error('Error al actualizar departamento:', error);
          }
        });
      } else {
        this.departamentoService.insertar(departamentoData).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              console.log('Departamento creado con éxito');
              this.router.navigate(['/departamentos']);
            } else {
              console.error('Error al crear departamento:', response.message);
            }
          },
          error: (error) => {
            console.error('Error al crear departamento:', error);
          }
        });
      }
    }
  }
}