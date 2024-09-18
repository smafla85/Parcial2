<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if ($method == "OPTIONS") {
    die();
}

require_once('../models/empleados.model.php');

$empleados = new Empleados;

switch ($_GET["op"]) {
    case 'todos':
        $datos = $empleados->todos();
        $empleados_array = array();
        while ($row = mysqli_fetch_assoc($datos)) {
            $empleados_array[] = $row;
        }
        echo json_encode($empleados_array);
        break;

    case 'uno':
        $id = isset($_POST["id"]) ? $_POST["id"] : die(json_encode(["status" => "error", "message" => "ID no proporcionado"]));
        $datos = $empleados->uno($id);
        echo json_encode($datos);
        break;

    case 'insertar':
        $nombre = $_POST["nombre"] ?? null;
        $apellido = $_POST["apellido"] ?? null;
        $email = $_POST["email"] ?? null;
        $telefono = $_POST["telefono"] ?? null;
        $departamento_id = $_POST["departamento_id"] ?? null;

        if ($nombre && $apellido && $departamento_id) {
            $resultado = $empleados->insertar($nombre, $apellido, $email, $telefono, $departamento_id);
            if (is_numeric($resultado)) {
                echo json_encode(["status" => "success", "message" => "Empleado insertado y asignado correctamente", "id" => $resultado]);
            } else {
                echo json_encode(["status" => "error", "message" => $resultado]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Faltan datos requeridos"]);
        }
        break;

    case 'actualizar':
        $empleado_id = $_POST["empleado_id"] ?? null;
        $nombre = $_POST["nombre"] ?? null;
        $apellido = $_POST["apellido"] ?? null;
        $email = $_POST["email"] ?? '';
        $telefono = $_POST["telefono"] ?? '';
        $departamento_id = $_POST["departamento_id"] ?? null;
    
        if ($empleado_id && $nombre && $apellido && $departamento_id) {
            $resultado = $empleados->actualizar($empleado_id, $nombre, $apellido, $email, $telefono, $departamento_id);
            if (is_numeric($resultado)) {
                echo json_encode(["status" => "success", "message" => "Empleado actualizado y asignación modificada correctamente"]);
            } else {
                echo json_encode(["status" => "error", "message" => $resultado]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Faltan datos requeridos"]);
        }
        break;

        case 'eliminar':
            $id = isset($_POST["id"]) ? intval($_POST["id"]) : 0;
            if ($id > 0) {
                $resultado = $empleados->eliminar($id);
                if ($resultado >= 0) {  // Cambiado de > 0 a >= 0
                    echo json_encode(["status" => "success", "message" => "Empleado y sus asignaciones eliminados correctamente"]);
                } else {
                    echo json_encode(["status" => "error", "message" => $resultado]);  // Devuelve el mensaje de error específico
                }
            } else {
                echo json_encode(["status" => "error", "message" => "ID no válido"]);
            }
            break;

    default:
        echo json_encode(["status" => "error", "message" => "Operación no válida"]);
        break;
}
?>