<?php
/* «® BASE DE DATOS DE PAGINAS  ®» */

$bdPags = [
	'Dashboard' => [
		'index' => ['Dashboard DTIC Bitácoras', 'index.php', 'fas fa-tachometer-alt', 'Dashboard principal con estadísticas y navegación']
	],

	'Gestión' => [
		'tecnicos' => ['Técnicos del Sistema', 'tecnicos.php', 'fas fa-users-cog', 'Administración de técnicos autorizados del DTIC'],
		'usuarios' => ['Usuarios Operativos', 'usuarios.php', 'fas fa-user-friends', 'Gestión de usuarios que trabajan con recursos'],
		'tareas' => ['Tareas del DTIC', 'tareas.php', 'fas fa-tasks', 'Administración de tareas y actividades'],
		'recursos' => ['Recursos del Sistema', 'recursos.php', 'fas fa-cogs', 'Gestión de recursos físicos y digitales']
	],

	'Herramientas' => [
		'calendario' => ['Calendario Interactivo', 'calendario.php', 'fas fa-calendar-alt', 'Programación y gestión de eventos'],
		'reportes' => ['Reportes y Estadísticas', 'reportes.php', 'fas fa-chart-bar', 'Análisis y reportes del sistema']
	],

	'Sistema' => [
		'estadoproyecto' => ['Estado del Proyecto', 'estadoproyecto.php', 'fas fa-info-circle', 'Información del estado del desarrollo']
	]
];

function getPagInfo($pagId, $info='titulo'){
	global $bdPags;

	foreach ($bdPags as $seccion => $paginas) {
		if (isset($paginas[$pagId])) {
			list($titulo, $archivo, $icono, $descripcion) = $paginas[$pagId];

			switch ($info) {
				case 'titulo':
					return $titulo;
					break;
				case 'archivo':
					return $archivo;
					break;
				case 'icono':
					return $icono;
					break;
				case 'descripcion':
					return $descripcion;
					break;
				case 'seccion':
					return $seccion;
					break;
				default:
					return $titulo;
					break;
			}
		}
	}
	return '';
}

function getNavItems($currentPage = 'index'){
	global $bdPags;
	$navHTML = '';

	foreach ($bdPags as $seccion => $paginas) {
		if ($seccion == 'Dashboard') {
			// Dashboard como item principal
			foreach ($paginas as $id => $datos) {
				list($titulo, $archivo, $icono, $descripcion) = $datos;
				$activeClass = ($currentPage == $id) ? 'active' : '';
				$navHTML .= "<li class='nav-item'><a class='nav-link $activeClass' href='index.php?page=$id'><i class='$icono'></i> $titulo</a></li>";
			}
		} else {
			// Otras secciones como dropdowns
			$navHTML .= "<li class='nav-item dropdown'>
				<a class='nav-link dropdown-toggle' href='#' id='nav$seccion' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
					$seccion
				</a>
				<ul class='dropdown-menu' aria-labelledby='nav$seccion'>";

			foreach ($paginas as $id => $datos) {
				list($titulo, $archivo, $icono, $descripcion) = $datos;
				$activeClass = ($currentPage == $id) ? 'active' : '';
				$navHTML .= "<li><a class='dropdown-item $activeClass' href='index.php?page=$id'><i class='$icono'></i> $titulo</a></li>";
			}

			$navHTML .= "</ul></li>";
		}
	}

	return $navHTML;
}
?>