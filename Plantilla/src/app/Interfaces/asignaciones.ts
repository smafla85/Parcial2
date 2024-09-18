export interface IAsignacion {
    asignacion_id?: number;
    empleado_id: number;
    departamento_id: number;
    fecha_inicio: string;
    fecha_fin?: string;
    nombre_empleado?: string;
    apellido_empleado?: string;
    nombre_departamento?: string;
  }