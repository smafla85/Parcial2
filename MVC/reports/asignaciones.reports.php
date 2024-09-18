<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if ($method == "OPTIONS") {
    die();
}

require('fpdf/fpdf.php');
require_once('../config/config.php');
require_once("../models/asignaciones.model.php");

$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetMargins(10, 10, 10);
$pdf->AliasNbPages();

// Función para el encabezado
function generateHeader($pdf) {
    $pdf->SetFont('Helvetica', 'B', 15);
    $pdf->Cell(0, 10, 'REPORTE DE ASIGNACIONES', 0, 1, 'C');
    $pdf->Ln(5);
}

// Función para el pie de página
function generateFooter($pdf) {
    $pdf->SetY(-15);
    $pdf->SetFont('Helvetica', '', 8);
    $pdf->Cell(0, 10, 'Pagina ' . $pdf->PageNo() . '/{nb}', 0, 0, 'C');
}

// Función para generar el encabezado de la tabla
function generateTableHeader($pdf) {
    $pdf->SetFont('Helvetica', 'B', 10);
    $pdf->Cell(50, 7, "Empleado", 1, 0, 'C');
    $pdf->Cell(50, 7, "Departamento", 1, 0, 'C');
    $pdf->Cell(30, 7, "Fecha Inicio", 1, 0, 'C');
    $pdf->Cell(30, 7, "Fecha Fin", 1, 0, 'C');
    $pdf->Cell(30, 7, "Duracion", 1, 1, 'C');
    $pdf->SetFont('Helvetica', '', 9);
}

// Llamar a la función generateHeader
generateHeader($pdf);

// Crear instancia del modelo de Asignaciones
$asignacionesModel = new Asignaciones();

// Obtener todas las asignaciones
$asignaciones = $asignacionesModel->todas();

// Generar el encabezado de la tabla
generateTableHeader($pdf);

while ($row = mysqli_fetch_assoc($asignaciones)) {
    $nombreEmpleado = iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $row['nombre_empleado'] . ' ' . $row['apellido_empleado']);
    $nombreDepartamento = iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $row['nombre_departamento']);
    
    $fechaInicio = new DateTime($row['fecha_inicio']);
    $fechaFin = $row['fecha_fin'] ? new DateTime($row['fecha_fin']) : new DateTime();
    $duracion = $fechaInicio->diff($fechaFin);
    
    $pdf->Cell(50, 6, $nombreEmpleado, 1, 0, 'L');
    $pdf->Cell(50, 6, $nombreDepartamento, 1, 0, 'L');
    $pdf->Cell(30, 6, $row['fecha_inicio'], 1, 0, 'C');
    $pdf->Cell(30, 6, $row['fecha_fin'] ? $row['fecha_fin'] : 'Actual', 1, 0, 'C');
    
    // Formato de duración
    if ($duracion->y > 0) {
        $duracionTexto = $duracion->y . ' anio(s)';
    } elseif ($duracion->m > 0) {
        $duracionTexto = $duracion->m . ' mes(es)';
    } else {
        $duracionTexto = $duracion->d . ' dia(s)';
    }
    
    $pdf->Cell(30, 6, $duracionTexto, 1, 1, 'C');

    // Verificar si se necesita una nueva página
    if ($pdf->GetY() > 250) {
        $pdf->AddPage();
        generateHeader($pdf);
        generateTableHeader($pdf);
    }
}

// Llamar a la función generateFooter
generateFooter($pdf);

$pdf->Output('I', 'reporte_asignaciones.pdf', true);
?>