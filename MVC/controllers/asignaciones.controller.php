<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if ($method == "OPTIONS") {
    die();
}

require_once('../models/asignaciones.model.php');

$asignaciones = new Asignaciones;

switch ($_GET["op"]) {
    case 'todas':
        $datos = $asignaciones->todas();
        $todas = [];
        while ($row = mysqli_fetch_assoc($datos)) {
            $todas[] = $row;
        }
        echo json_encode($todas);
        break;

    case 'una':
        $id = $_POST["id"] ?? null;
        if ($id) {
            $datos = $asignaciones->una($id);
            echo json_encode($datos);
        } else {
            echo json_encode(["status" => "error", "message" => "ID no proporcionado"]);
        }
        break;

    case 'insertar':
        $empleado_id = $_POST["empleado_id"] ?? null;
        $departamento_id = $_POST["departamento_id"] ?? null;
        $fecha_inicio = $_POST["fecha_inicio"] ?? null;
        $fecha_fin = $_POST["fecha_fin"] ?? null;

        if ($empleado_id && $departamento_id && $fecha_inicio) {
            $datos = $asignaciones->insertar($empleado_id, $departamento_id, $fecha_inicio, $fecha_fin);
            if (is_numeric($datos)) {
                echo json_encode(["status" => "success", "message" => "Asignación insertada correctamente", "id" => $datos]);
            } else {
                echo json_encode(["status" => "error", "message" => $datos]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Faltan datos requeridos"]);
        }
        break;

    case 'actualizar':
        $id = $_POST["id"] ?? null;
        $empleado_id = $_POST["empleado_id"] ?? null;
        $departamento_id = $_POST["departamento_id"] ?? null;
        $fecha_inicio = $_POST["fecha_inicio"] ?? null;
        $fecha_fin = $_POST["fecha_fin"] ?? null;

        if ($id && $empleado_id && $departamento_id && $fecha_inicio) {
            $datos = $asignaciones->actualizar($id, $empleado_id, $departamento_id, $fecha_inicio, $fecha_fin);
            if (is_numeric($datos)) {
                echo json_encode(["status" => "success", "message" => "Asignación actualizada correctamente"]);
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
            $datos = $asignaciones->eliminar($id);
            if ($datos === 1) {
                echo json_encode(["status" => "success", "message" => "Asignación eliminada correctamente"]);
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