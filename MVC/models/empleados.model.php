<?php
require_once('../config/config.php');

class Empleados {
    private $conexion;

    public function __construct() {
        $conectar = new ClaseConectar();
        $this->conexion = $conectar->ProcedimientoParaConectar();
    }

    public function todos() {
        $query = "SELECT e.*, d.nombre as nombre_departamento 
                  FROM empleados e 
                  LEFT JOIN departamentos d ON e.departamento_id = d.departamento_id 
                  ORDER BY e.apellido, e.nombre";
        $resultado = mysqli_query($this->conexion, $query);
        return $resultado;
    }

    public function uno($id) {
        $id = mysqli_real_escape_string($this->conexion, $id);
        $query = "SELECT e.*, d.nombre as nombre_departamento 
                  FROM empleados e 
                  LEFT JOIN departamentos d ON e.departamento_id = d.departamento_id 
                  WHERE e.empleado_id = $id";
        $resultado = mysqli_query($this->conexion, $query);
        return mysqli_fetch_assoc($resultado);
    }

    public function insertar($nombre, $apellido, $email, $telefono, $departamento_id) {
        mysqli_begin_transaction($this->conexion);

        try {
            $nombre = mysqli_real_escape_string($this->conexion, $nombre);
            $apellido = mysqli_real_escape_string($this->conexion, $apellido);
            $email = mysqli_real_escape_string($this->conexion, $email);
            $telefono = mysqli_real_escape_string($this->conexion, $telefono);
            $departamento_id = $departamento_id ? intval($departamento_id) : "NULL";

            $query = "INSERT INTO empleados (nombre, apellido, email, telefono, departamento_id) 
                      VALUES ('$nombre', '$apellido', '$email', '$telefono', $departamento_id)";
            
            if (mysqli_query($this->conexion, $query)) {
                $empleado_id = mysqli_insert_id($this->conexion);
                
                // Crear asignación
                $fecha_inicio = date('Y-m-d');
                $query_asignacion = "INSERT INTO asignaciones (empleado_id, departamento_id, fecha_inicio) 
                                     VALUES ($empleado_id, $departamento_id, '$fecha_inicio')";
                mysqli_query($this->conexion, $query_asignacion);

                mysqli_commit($this->conexion);
                return $empleado_id;
            } else {
                throw new Exception(mysqli_error($this->conexion));
            }
        } catch (Exception $e) {
            mysqli_rollback($this->conexion);
            return "Error: " . $e->getMessage();
        }
    }

    public function actualizar($id, $nombre, $apellido, $email, $telefono, $departamento_id) {
        mysqli_begin_transaction($this->conexion);

        try {
            $id = intval($id);
            $nombre = mysqli_real_escape_string($this->conexion, $nombre);
            $apellido = mysqli_real_escape_string($this->conexion, $apellido);
            $email = $email ? mysqli_real_escape_string($this->conexion, $email) : null;
            $telefono = $telefono ? mysqli_real_escape_string($this->conexion, $telefono) : null;
            $departamento_id = $departamento_id ? intval($departamento_id) : null;

            // Obtener el departamento actual del empleado
            $query_actual = "SELECT departamento_id FROM empleados WHERE empleado_id = $id";
            $resultado_actual = mysqli_query($this->conexion, $query_actual);
            $row_actual = mysqli_fetch_assoc($resultado_actual);
            $departamento_actual = $row_actual['departamento_id'];

            $query = "UPDATE empleados SET 
                      nombre = '$nombre', 
                      apellido = '$apellido', 
                      email = " . ($email ? "'$email'" : "NULL") . ", 
                      telefono = " . ($telefono ? "'$telefono'" : "NULL") . ", 
                      departamento_id = " . ($departamento_id ? $departamento_id : "NULL") . " 
                      WHERE empleado_id = $id";
            
            if (mysqli_query($this->conexion, $query)) {
                // Si el departamento ha cambiado, actualizar asignaciones
                if ($departamento_id != $departamento_actual) {
                    $fecha_fin = date('Y-m-d');
                    $query_fin_asignacion = "UPDATE asignaciones SET fecha_fin = '$fecha_fin' 
                                             WHERE empleado_id = $id AND departamento_id = $departamento_actual AND fecha_fin IS NULL";
                    mysqli_query($this->conexion, $query_fin_asignacion);

                    $fecha_inicio = date('Y-m-d');
                    $query_nueva_asignacion = "INSERT INTO asignaciones (empleado_id, departamento_id, fecha_inicio) 
                                               VALUES ($id, $departamento_id, '$fecha_inicio')";
                    mysqli_query($this->conexion, $query_nueva_asignacion);
                }

                mysqli_commit($this->conexion);
                return $id;
            } else {
                throw new Exception(mysqli_error($this->conexion));
            }
        } catch (Exception $e) {
            mysqli_rollback($this->conexion);
            return "Error: " . $e->getMessage();
        }
    }

    public function eliminar($id) {
        mysqli_begin_transaction($this->conexion);

        try {
            $id = intval($id);
            
            // Eliminar asignaciones del empleado
            $query_asignaciones = "DELETE FROM asignaciones WHERE empleado_id = $id";
            mysqli_query($this->conexion, $query_asignaciones);

            // Eliminar el empleado
            $query = "DELETE FROM empleados WHERE empleado_id = $id";
            
            if (mysqli_query($this->conexion, $query)) {
                mysqli_commit($this->conexion);
                return mysqli_affected_rows($this->conexion);
            } else {
                throw new Exception(mysqli_error($this->conexion));
            }
        } catch (Exception $e) {
            mysqli_rollback($this->conexion);
            return "Error: " . $e->getMessage();
        }
    }

    public function __destruct() {
        mysqli_close($this->conexion);
    }
}
?>