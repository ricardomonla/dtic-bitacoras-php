<?php
function getHead($titulo = 'DTIC Bitácoras'){
	return <<<HTML
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>$titulo - DTIC Bitácoras</title>
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
		<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
		<link href="css/styles.css" rel="stylesheet">
		<link href="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css" rel="stylesheet">
	</head>
HTML;
}

function getNavbar($currentPage = 'index'){
	$navItems = getNavItems($currentPage);

	return <<<HTML
	<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
		<div class="container">
			<a class="navbar-brand" href="index.php">
				<i class="fas fa-cogs"></i> DTIC Bitácoras
			</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav ms-auto">
					$navItems
				</ul>
			</div>
		</div>
	</nav>
HTML;
}

function getFooter(){
	return <<<HTML
	<footer class="bg-dark text-light py-4 mt-5">
		<div class="container">
			<div class="row">
				<div class="col-md-6">
					<h5>DTIC Bitácoras</h5>
					<p>Sistema de gestión de tareas, recursos y técnicos del DTIC</p>
				</div>
				<div class="col-md-6 text-end">
					<p>&copy; 2024 DTIC - Facultad Regional La Rioja</p>
					<p class="small">Desarrollado por: Lic. Ricardo MONLA</p>
				</div>
			</div>
		</div>
	</footer>
HTML;
}

function getScripts(){
	return <<<HTML
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js"></script>
	<script src="js/dashboard.js"></script>
	<script src="js/calendar.js"></script>
HTML;
}

function getDashboardStats(){
	return <<<HTML
	<div class="row mb-4">
		<div class="col-md-3">
			<div class="card bg-primary text-white">
				<div class="card-body">
					<h5 class="card-title"><i class="fas fa-tasks"></i> Tareas Pendientes</h5>
					<h2 id="pending-tasks">0</h2>
					<small>Esperando asignación</small>
				</div>
			</div>
		</div>
		<div class="col-md-3">
			<div class="card bg-warning text-white">
				<div class="card-body">
					<h5 class="card-title"><i class="fas fa-play-circle"></i> En Progreso</h5>
					<h2 id="in-progress-tasks">0</h2>
					<small>Siendo ejecutadas</small>
				</div>
			</div>
		</div>
		<div class="col-md-3">
			<div class="card bg-success text-white">
				<div class="card-body">
					<h5 class="card-title"><i class="fas fa-check-circle"></i> Completadas</h5>
					<h2 id="completed-tasks">0</h2>
					<small>Esta semana</small>
				</div>
			</div>
		</div>
		<div class="col-md-3">
			<div class="card bg-info text-white">
				<div class="card-body">
					<h5 class="card-title"><i class="fas fa-users"></i> Técnicos Activos</h5>
					<h2 id="active-technicians">0</h2>
					<small>Disponibles</small>
				</div>
			</div>
		</div>
	</div>
HTML;
}

function getUpcomingEvents(){
	return <<<HTML
	<div class="col-md-6">
		<div class="card">
			<div class="card-header">
				<h5><i class="fas fa-calendar-check"></i> Próximos Eventos</h5>
			</div>
			<div class="card-body">
				<div class="list-group list-group-flush">
					<a href="#" class="list-group-item list-group-item-action">
						<div class="d-flex w-100 justify-content-between">
							<h6 class="mb-1">Mantenimiento Servidores</h6>
							<small>Hoy 14:00</small>
						</div>
						<p class="mb-1">Revisión mensual de servidores principales</p>
						<small class="text-muted">Técnico: Juan Pérez</small>
					</a>
					<a href="#" class="list-group-item list-group-item-action">
						<div class="d-flex w-100 justify-content-between">
							<h6 class="mb-1">Actualización Software</h6>
							<small>Mañana 09:00</small>
						</div>
						<p class="mb-1">Instalación de parches de seguridad</p>
						<small class="text-muted">Técnico: María García</small>
					</a>
					<a href="#" class="list-group-item list-group-item-action">
						<div class="d-flex w-100 justify-content-between">
							<h6 class="mb-1">Reunión de Equipo</h6>
							<small>15/10 10:00</small>
						</div>
						<p class="mb-1">Revisión de proyectos en curso</p>
						<small class="text-muted">Sala de reuniones</small>
					</a>
				</div>
			</div>
		</div>
	</div>
HTML;
}

function getRecentActivity(){
	return <<<HTML
	<div class="col-md-6">
		<div class="card">
			<div class="card-header">
				<h5><i class="fas fa-history"></i> Actividad Reciente</h5>
			</div>
			<div class="card-body">
				<div class="timeline">
					<div class="timeline-item">
						<div class="timeline-marker bg-success"></div>
						<div class="timeline-content">
							<h6>Tarea completada</h6>
							<p>Configuración de red WiFi - Aula 101</p>
							<small class="text-muted">Hace 2 horas - Juan Pérez</small>
						</div>
					</div>
					<div class="timeline-item">
						<div class="timeline-marker bg-warning"></div>
						<div class="timeline-content">
							<h6>Tarea iniciada</h6>
							<p>Mantenimiento preventivo - Servidor Principal</p>
							<small class="text-muted">Hace 4 horas - María García</small>
						</div>
					</div>
					<div class="timeline-item">
						<div class="timeline-marker bg-info"></div>
						<div class="timeline-content">
							<h6>Nuevo recurso registrado</h6>
							<p>Notebook Dell Latitude 5420 - RES-015</p>
							<small class="text-muted">Hace 6 horas - Carlos López</small>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
HTML;
}

function getPageTemplate($titulo, $contenido, $currentPage = 'index', $scriptsExtra = ''){
	$head = getHead($titulo);
	$navbar = getNavbar($currentPage);
	$footer = getFooter();
	$scripts = getScripts();

	return <<<HTML
<!DOCTYPE html>
<html lang="es">
$head
<body>
	$navbar

	<div class="container mt-4">
		$contenido
	</div>

	$footer

	$scripts
	$scriptsExtra
</body>
</html>
HTML;
}
?>