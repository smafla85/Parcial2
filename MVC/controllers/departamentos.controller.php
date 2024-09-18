<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if ($method == "OPTIONS") {
    die();
}

require_once('../models/departamentos.model.php');

$departamentos = new Departamentos;

switch ($_GET["op"]) {
    case 'todos':
        $datos = $departamentos->todos();
        $todos = [];
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'uno':
        $id = $_POST["id"] ?? null;
        if ($id) {
            $datos = $departamentos->uno($id);
            echo json_encode($datos);
        } else {
            echo json_encode(["status" => "error", "message" => "ID no proporcionado"]);
        }
        break;

    case 'insertar':
        $nombre = $_POST["nombre"] ?? null;
        $ubicacion = $_POST["ubicacion"] ?? null;
        $jefe_departamento = $_POST["jefe_departamento"] ?? '';
        $extension = $_POST["extension"] ?? null;

        if ($nombre && $ubicacion) {
            $datos = $departamentos->insertar($nombre, $ubicacion, $jefe_departamento, $extension);
            if (is_numeric($datos)) {
                echo json_encode(["status" => "success", "message" => "Departamento insertado correctamente", "id" => $datos]);
            } else {
                echo json_encode(["status" => "error", "message" => $datos]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Faltan datos requeridos"]);
        }
        break;

        case 'actualizar':
            $id = $_POST["id"] ?? null;
            $nombre = $_POST["nombre"] ?? null;
            $ubicacion = $_POST["ubicacion"] ?? null;
            $jefe_departamento = $_POST["jefe_departamento"] ?? null;
            $extension = $_POST["extension"] ?? null;
    
            if ($id && $nombre && $ubicacion) {
                $datos = $departamentos->actualizar($id, $nombre, $ubicacion, $jefe_departamento, $extension);
                if (is_numeric($datos)) {
                    echo json_encode(["status" => "success", "message" => "Departamento actualizado correctamente"]);
                } else {
                    echo json_encode(["status" => "error", "message" => $datos]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Faltan datos requeridos"]);
            }
            break;
    
        case 'eliminar':
            $id = $_POST["id"] ?? null;
            if ($id) {
                $datos = $departamentos->eliminar($id);
                if ($datos === 1) {
                    echo json_encode(["status" => "success", "message" => "Departamento eliminado correctamente"]);
                } else {
                    echo json_encode(["status" => "error", "message" => $datos]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "ID no proporcionado"]);
            }
            break;

    default:
        echo json_encode(["status" => "error", "message" => "Operación no válida"]);
        break;
}
?>