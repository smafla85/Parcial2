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
        $nombre = mysqli_real_escape_string($this->conexion, $nombre);
        $apellido = mysqli_real_escape_string($this->conexion, $apellido);
        $email = mysqli_real_escape_string($this->conexion, $email);
        $telefono = mysqli_real_escape_string($this->conexion, $telefono);
        $departamento_id = $departamento_id ? intval($departamento_id) : "NULL";

        $query = "INSERT INTO empleados (nombre, apellido, email, telefono, departamento_id) 
                  VALUES ('$nombre', '$apellido', '$email', '$telefono', $departamento_id)";
        
        if (mysqli_query($this->conexion, $query)) {
            return mysqli_insert_id($this->conexion);
        } else {
            return "Error: " . mysqli_error($this->conexion);
        }
    }

    public function actualizar($id, $nombre, $apellido, $email, $telefono, $departamento_id) {
        $id = intval($id);
        $nombre = mysqli_real_escape_string($this->conexion, $nombre);
        $apellido = mysqli_real_escape_string($this->conexion, $apellido);
        $email = mysqli_real_escape_string($this->conexion, $email);
        $telefono = mysqli_real_escape_string($this->conexion, $telefono);
        $departamento_id = $departamento_id ? intval($departamento_id) : "NULL";

        $query = "UPDATE empleados SET 
                  nombre = '$nombre', 
                  apellido = '$apellido', 
                  email = '$email', 
                  telefono = '$telefono', 
                  departamento_id = $departamento_id 
                  WHERE empleado_id = $id";
        
        if (mysqli_query($this->conexion, $query)) {
            return $id;
        } else {
            return "Error: " . mysqli_error($this->conexion);
        }
    }

    public function eliminar($id) {
        $id = intval($id);
        $query = "DELETE FROM empleados WHERE empleado_id = $id";
        
        if (mysqli_query($this->conexion, $query)) {
            return mysqli_affected_rows($this->conexion);
        } else {
            return "Error: " . mysqli_error($this->conexion);
        }
    }

    public function __destruct() {
        mysqli_close($this->conexion);
    }
}
?>