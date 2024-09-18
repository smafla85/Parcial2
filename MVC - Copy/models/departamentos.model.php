<?php
require_once('../config/config.php');

class Departamentos {
    private $conexion;

    public function __construct() {
        $conectar = new ClaseConectar();
        $this->conexion = $conectar->ProcedimientoParaConectar();
    }

    public function todos() {
        $cadena = "SELECT * FROM Departamentos ORDER BY nombre";
        $datos = mysqli_query($this->conexion, $cadena);
        if (!$datos) {
            return "Error en la consulta: " . mysqli_error($this->conexion);
        }
        return $datos;
    }

    public function uno($id) {
        $id = mysqli_real_escape_string($this->conexion, $id);
        $cadena = "SELECT * FROM Departamentos WHERE departamento_id = $id";
        $datos = mysqli_query($this->conexion, $cadena);
        if (!$datos) {
            return "Error en la consulta: " . mysqli_error($this->conexion);
        }
        return mysqli_fetch_assoc($datos);
    }

    public function insertar($nombre, $ubicacion, $jefe_departamento, $extension) {
        try {
            $nombre = mysqli_real_escape_string($this->conexion, $nombre);
            $ubicacion = mysqli_real_escape_string($this->conexion, $ubicacion);
            $jefe_departamento = mysqli_real_escape_string($this->conexion, $jefe_departamento);
            $extension = mysqli_real_escape_string($this->conexion, $extension);

            $cadena = "INSERT INTO Departamentos (nombre, ubicacion, jefe_departamento, extension) 
                       VALUES ('$nombre', '$ubicacion', '$jefe_departamento', '$extension')";
            if (mysqli_query($this->conexion, $cadena)) {
                return mysqli_insert_id($this->conexion);
            } else {
                return "Error en la consulta: " . mysqli_error($this->conexion);
            }
        } catch (Exception $th) {
            return $th->getMessage();
        }
    }

    public function actualizar($id, $nombre, $ubicacion, $jefe_departamento, $extension) {
        try {
            $id = intval($id);
            $nombre = mysqli_real_escape_string($this->conexion, $nombre);
            $ubicacion = mysqli_real_escape_string($this->conexion, $ubicacion);
            $jefe_departamento = mysqli_real_escape_string($this->conexion, $jefe_departamento);
            $extension = mysqli_real_escape_string($this->conexion, $extension);

            $cadena = "UPDATE Departamentos SET 
                       nombre = '$nombre', 
                       ubicacion = '$ubicacion', 
                       jefe_departamento = '$jefe_departamento', 
                       extension = '$extension' 
                       WHERE departamento_id = $id";
            if (mysqli_query($this->conexion, $cadena)) {
                return $id;
            } else {
                return mysqli_error($this->conexion);
            }
        } catch (Exception $th) {
            return $th->getMessage();
        }
    }

    public function eliminar($id) {
        try {
            $id = intval($id);
            
            // Primero, actualizamos los empleados que pertenecen a este departamento
            $cadena1 = "UPDATE Empleados SET departamento_id = NULL WHERE departamento_id = $id";
            mysqli_query($this->conexion, $cadena1);
            
            // Luego, eliminamos el departamento
            $cadena2 = "DELETE FROM Departamentos WHERE departamento_id = $id";
            if (mysqli_query($this->conexion, $cadena2)) {
                return 1;
            } else {
                return mysqli_error($this->conexion);
            }
        } catch (Exception $th) {
            return $th->getMessage();
        }
    }

    public function __destruct() {
        mysqli_close($this->conexion);
    }
}
?>