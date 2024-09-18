<?php
require_once('../config/config.php');

class Asignaciones {
    public function todas() {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT a.*, e.nombre AS nombre_empleado, e.apellido AS apellido_empleado, 
                   d.nombre AS nombre_departamento
                   FROM Asignaciones a 
                   JOIN Empleados e ON a.empleado_id = e.empleado_id
                   JOIN Departamentos d ON a.departamento_id = d.departamento_id
                   ORDER BY a.fecha_inicio DESC";
        $datos = mysqli_query($con, $cadena);
        if (!$datos) {
            return "Error en la consulta: " . mysqli_error($con);
        }
        $con->close();
        return $datos;
    }

    public function una($id) {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $id = mysqli_real_escape_string($con, $id);
        $cadena = "SELECT a.*, e.nombre AS nombre_empleado, e.apellido AS apellido_empleado, 
                   d.nombre AS nombre_departamento
                   FROM Asignaciones a 
                   JOIN Empleados e ON a.empleado_id = e.empleado_id
                   JOIN Departamentos d ON a.departamento_id = d.departamento_id
                   WHERE a.asignacion_id = $id";
        $datos = mysqli_query($con, $cadena);
        if (!$datos) {
            return "Error en la consulta: " . mysqli_error($con);
        }
        $con->close();
        return mysqli_fetch_assoc($datos);
    }

    public function insertar($empleado_id, $departamento_id, $fecha_inicio, $fecha_fin) {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $empleado_id = intval($empleado_id);
            $departamento_id = intval($departamento_id);
            $fecha_inicio = mysqli_real_escape_string($con, $fecha_inicio);
            $fecha_fin = $fecha_fin ? "'" . mysqli_real_escape_string($con, $fecha_fin) . "'" : "NULL";

            $cadena = "INSERT INTO Asignaciones (empleado_id, departamento_id, fecha_inicio, fecha_fin) 
                       VALUES ($empleado_id, $departamento_id, '$fecha_inicio', $fecha_fin)";
            if (mysqli_query($con, $cadena)) {
                return mysqli_insert_id($con);
            } else {
                return "Error en la consulta: " . mysqli_error($con);
            }
        } catch (Exception $th) {
            return $th->getMessage();
        } finally {
            $con->close();
        }
    }

    public function actualizar($id, $empleado_id, $departamento_id, $fecha_inicio, $fecha_fin) {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $id = intval($id);
            $empleado_id = intval($empleado_id);
            $departamento_id = intval($departamento_id);
            $fecha_inicio = mysqli_real_escape_string($con, $fecha_inicio);
            $fecha_fin = $fecha_fin ? "'" . mysqli_real_escape_string($con, $fecha_fin) . "'" : "NULL";

            $cadena = "UPDATE Asignaciones SET 
                       empleado_id = $empleado_id, 
                       departamento_id = $departamento_id, 
                       fecha_inicio = '$fecha_inicio', 
                       fecha_fin = $fecha_fin 
                       WHERE asignacion_id = $id";
            if (mysqli_query($con, $cadena)) {
                return $id;
            } else {
                return $con->error;
            }
        } catch (Exception $th) {
            return $th->getMessage();
        } finally {
            $con->close();
        }
    }

    public function eliminar($id) {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $id = intval($id);
            $cadena = "DELETE FROM Asignaciones WHERE asignacion_id = $id";
            if (mysqli_query($con, $cadena)) {
                return 1;
            } else {
                return $con->error;
            }
        } catch (Exception $th) {
            return $th->getMessage();
        } finally {
            $con->close();
        }
    }
}
?>