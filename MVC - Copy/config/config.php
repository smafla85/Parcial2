<?php
class ClaseConectar
{
    public $conexion;
    protected $db;
    private $host = "127.0.0.1";
    private $usuario = "root";
    private $pass = "root";
    private $base = "empleados_db";
    private $puerto = 3307; // Agrega el puerto

    public function ProcedimientoParaConectar()
    {
        // Usa mysqli_connect con el puerto especificado
        $this->conexion = mysqli_connect($this->host, $this->usuario, $this->pass, $this->base, $this->puerto);
        
        // Configura el conjunto de caracteres
        mysqli_query($this->conexion, "SET NAMES 'utf8'");
        
        // Verifica si hubo un error en la conexión
        if ($this->conexion->connect_error) {
            die("Error al conectar con el servidor: " . $this->conexion->connect_error);
        }
        
        $this->db = $this->conexion;
        
        // Verifica si hubo un error al conectar con la base de datos
        if ($this->db == false) {
            die("Error al conectar con la base de datos: " . $this->conexion->connect_error);
        }

        return $this->conexion;
    }
}
