<?php
/* «® BASE DE DATOS DE PAGINAS  ®» */

$bdPags = [
	'Dashboard' => [
		'index' => [
			'Dashboard DTIC Bitácoras',
			'index.php',
			'fas fa-tachometer-alt',
			'Dashboard principal con estadísticas y navegación',
			'Main Content' => [
				'Dashboard Header' => [
					'Title' => 'Dashboard DTIC Bitácoras',
					'Subtitle' => 'Sistema de Gestión de Tareas y Recursos - Departamento de Tecnología de la Información y Comunicación',
					'Current Date' => 'Fecha Actual',
					'Current Time' => 'Hora Actual',
					'System Status' => 'Online',
					'Active User' => '1',
				],
				'Statistics Cards' => [
					'Tareas Pendientes' => [
						'Icon' => 'fas fa-clock text-warning',
						'Title' => 'Tareas Pendientes',
						'Count' => '0',
						'Description' => 'Esperando asignación',
					],
					'En Progreso' => [
						'Icon' => 'fas fa-play-circle text-info',
						'Title' => 'En Progreso',
						'Count' => '0',
						'Description' => 'Actualmente trabajando',
					],
					'Completadas' => [
						'Icon' => 'fas fa-check-circle text-success',
						'Title' => 'Completadas',
						'Count' => '0',
						'Description' => 'Esta semana',
					],
					'Canceladas' => [
						'Icon' => 'fas fa-times-circle text-danger',
						'Title' => 'Canceladas',
						'Count' => '0',
						'Description' => 'Esta semana',
					],
				],
				'Recent Activity & Upcoming Events' => [
					'Recent Tasks' => [
						'Title' => 'Actividad Reciente',
						'Icon' => 'fas fa-history',
						'Content' => 'No hay actividad reciente para mostrar',
					],
					'Upcoming Events' => [
						'Title' => 'Próximos Eventos',
						'Icon' => 'fas fa-calendar-check',
						'Link' => 'calendario.html',
					],
				],
				'Quick Actions' => [
					'Title' => 'Acciones Rápidas',
					'Icon' => 'fas fa-bolt',
					'Actions' => [
						'New Task' => [
							'Text' => 'Nueva Tarea',
							'Icon' => 'fas fa-plus',
							'Disabled' => true,
						],
						'New Resource' => [
							'Text' => 'Nuevo Recurso',
							'Icon' => 'fas fa-box',
							'Disabled' => true,
						],
						'New Event' => [
							'Text' => 'Nuevo Evento',
							'Icon' => 'fas fa-calendar-plus',
							'Link' => 'calendario.html',
						],
						'View Reports' => [
							'Text' => 'Ver Reportes',
							'Icon' => 'fas fa-chart-bar',
							'Disabled' => true,
						],
					],
				],
				'System Information' => [
					'Title' => 'Información del Sistema',
					'Icon' => 'fas fa-server',
					'Items' => [
						'PHP Version' => [
							'Icon' => 'fas fa-code',
							'Version' => 'PHP 8.1',
							'Description' => 'Versión del servidor',
						],
						'Database' => [
							'Icon' => 'fas fa-database',
							'Version' => 'MySQL 8.0',
							'Description' => 'Base de datos',
						],
						'Calendar' => [
							'Icon' => 'fas fa-calendar-alt',
							'Feature' => 'Calendario',
							'Description' => 'Gestión de eventos',
						],
						'Project Status' => [
							'Icon' => 'fas fa-info-circle',
							'Feature' => 'Estado del Proyecto',
							'Description' => 'Ver progreso',
							'Link' => 'estadoproyecto.html',
						],
					],
				],
			],
		],
	],

	'Gestión' => [
		'tareas' => [
			'Gestión de Tareas',
			'tareas.php',
			'fas fa-tasks',
			'Administra todas las tareas del sistema DTIC Bitácoras',
			'Main Content' => [
				'Page Header' => [
					'Title' => 'Gestión de Tareas',
					'Icon' => 'fas fa-tasks text-primary',
					'Description' => 'Administra todas las tareas del sistema DTIC Bitácoras',
					'New Task Button' => 'Nueva Tarea',
				],
				'Filters and Search' => [
					'Search Input' => 'Buscar tareas...',
					'Status Filter' => [
						'Options' => ['Todos los estados', 'Pendientes', 'En Progreso', 'Completadas', 'Canceladas'],
					],
					'Priority Filter' => [
						'Options' => ['Todas las prioridades', 'Baja', 'Media', 'Alta', 'Urgente'],
					],
					'Assigned Filter' => [
						'Options' => ['Todos los usuarios', 'Juan García', 'María Rodríguez', 'Carlos López', 'Ana Martínez'],
					],
					'Clear Filters' => 'Limpiar',
				],
				'Task Statistics' => [
					'Pending' => ['Count' => '12', 'Label' => 'Pendientes', 'Description' => 'Esperando asignación'],
					'In Progress' => ['Count' => '8', 'Label' => 'En Progreso', 'Description' => 'Actualmente trabajando'],
					'Completed' => ['Count' => '25', 'Label' => 'Completadas', 'Description' => 'Este mes'],
					'Cancelled' => ['Count' => '3', 'Label' => 'Canceladas', 'Description' => 'Este mes'],
				],
				'Tasks List' => [
					'View Modes' => ['Card View', 'Table View'],
					'Sample Tasks' => [
						'Task 1' => [
							'Title' => 'Configurar servidor de desarrollo',
							'ID' => 'TSK-001',
							'Status' => 'Pendiente',
							'Priority' => 'Alta',
							'Assigned' => 'Juan García',
							'Created' => '15/10/2025',
							'Due' => '20/10/2025',
						],
						'Task 2' => [
							'Title' => 'Implementar API de autenticación',
							'ID' => 'TSK-002',
							'Status' => 'En Progreso',
							'Priority' => 'Media',
							'Assigned' => 'María Rodríguez',
							'Created' => '12/10/2025',
							'Due' => '25/10/2025',
						],
					],
				],
			],
		],
		'recursos' => [
			'Gestión de Recursos',
			'recursos.php',
			'fas fa-boxes',
			'Administra el inventario de recursos del sistema DTIC Bitácoras',
			'Main Content' => [
				'Page Header' => [
					'Title' => 'Gestión de Recursos',
					'Icon' => 'fas fa-boxes text-success',
					'Description' => 'Administra el inventario de recursos del sistema DTIC Bitácoras',
					'New Resource Button' => 'Nuevo Recurso',
				],
				'Resource Statistics' => [
					'Total Resources' => ['Count' => '48', 'Label' => 'Total Recursos', 'Description' => 'En inventario'],
					'Available' => ['Count' => '35', 'Label' => 'Disponibles', 'Description' => 'Listos para asignar'],
					'Assigned' => ['Count' => '10', 'Label' => 'Asignados', 'Description' => 'En uso actualmente'],
					'Maintenance' => ['Count' => '3', 'Label' => 'En Mantenimiento', 'Description' => 'Fuera de servicio'],
				],
				'Categories and Filters' => [
					'Search Input' => 'Buscar recursos...',
					'Category Filter' => [
						'Options' => ['Todas las categorías', 'Hardware', 'Software', 'Redes', 'Seguridad', 'Herramientas'],
					],
					'Status Filter' => [
						'Options' => ['Todos los estados', 'Disponible', 'Asignado', 'Mantenimiento', 'Retirado'],
					],
					'Clear Filters' => 'Limpiar',
				],
				'Resources Grid' => [
					'Sample Resources' => [
						'Resource 1' => [
							'Name' => 'Laptop Dell Latitude 5420',
							'ID' => 'RES-001',
							'Category' => 'Hardware',
							'Status' => 'Disponible',
							'Location' => 'Oficina Principal',
						],
						'Resource 2' => [
							'Name' => 'Proyector Epson EB-S41',
							'ID' => 'RES-002',
							'Category' => 'Hardware',
							'Status' => 'Asignado',
							'Assigned To' => 'Juan García',
						],
					],
				],
			],
		],
		'tecnicos' => [
			'Gestión de Técnicos',
			'tecnicos.php',
			'fas fa-user-cog',
			'Administra los técnicos asignados a recursos del sistema DTIC Bitácoras',
			'Main Content' => [
				'Page Header' => [
					'Title' => 'Gestión de Técnicos',
					'Icon' => 'fas fa-users text-info',
					'Description' => 'Administra los técnicos asignados a recursos del sistema DTIC Bitácoras',
					'New Technician Button' => 'Nuevo Técnico',
				],
				'User Statistics' => [
					'Total Technicians' => ['Count' => '6', 'Label' => 'Total Técnicos', 'Description' => 'Registrados en el sistema'],
					'Active' => ['Count' => '5', 'Label' => 'Activos', 'Description' => 'Con acceso al sistema'],
					'Inactive' => ['Count' => '1', 'Label' => 'Inactivos', 'Description' => 'Acceso suspendido'],
					'Administrators' => ['Count' => '1', 'Label' => 'Administradores', 'Description' => 'Acceso completo'],
				],
				'Filters and Search' => [
					'Search Input' => 'Buscar técnicos...',
					'Role Filter' => [
						'Options' => ['Todos los roles', 'Administrador', 'Técnico', 'Visualizador'],
					],
					'Status Filter' => [
						'Options' => ['Todos los estados', 'Activo', 'Inactivo', 'Pendiente'],
					],
					'Department Filter' => [
						'Options' => ['Todos los deptos', 'DTIC', 'Sistemas', 'Redes', 'Seguridad'],
					],
					'Clear Filters' => 'Limpiar',
				],
				'Users List' => [
					'View Modes' => ['Card View', 'Table View'],
					'Sample Technicians' => [
						'Tech 1' => [
							'Name' => 'Roberto Martínez',
							'Role' => 'Administrador',
							'Department' => 'DTIC',
							'Status' => 'Activo',
							'Email' => 'rmartinez@dtic.gob.ar',
							'Tasks' => '3',
						],
						'Tech 2' => [
							'Name' => 'Juan García',
							'Role' => 'Técnico',
							'Department' => 'Sistemas',
							'Status' => 'Activo',
							'Email' => 'jgarcia@dtic.gob.ar',
							'Tasks' => '5',
						],
					],
				],
			],
		],
		'usuarios' => [
			'Gestión de Usuarios',
			'usuarios.php',
			'fas fa-users',
			'Administra los usuarios que trabajan con recursos del sistema DTIC Bitácoras',
			'Main Content' => [
				'Page Header' => [
					'Title' => 'Gestión de Usuarios',
					'Icon' => 'fas fa-users text-primary',
					'Description' => 'Administra los usuarios que trabajan con recursos del sistema DTIC Bitácoras',
					'New User Button' => 'Nuevo Usuario',
				],
				'User Statistics' => [
					'Total Users' => ['Count' => '8', 'Label' => 'Total Usuarios', 'Description' => 'Registrados en el sistema'],
					'Active' => ['Count' => '7', 'Label' => 'Activos', 'Description' => 'Con acceso al sistema'],
					'Inactive' => ['Count' => '1', 'Label' => 'Inactivos', 'Description' => 'Acceso suspendido'],
					'Assigned' => ['Count' => '6', 'Label' => 'Asignados', 'Description' => 'Con recursos asignados'],
				],
				'Filters and Search' => [
					'Search Input' => 'Buscar usuarios...',
					'Role Filter' => [
						'Options' => ['Todos los roles', 'Operador', 'Supervisor', 'Analista', 'Invitado'],
					],
					'Status Filter' => [
						'Options' => ['Todos los estados', 'Activo', 'Inactivo', 'Pendiente'],
					],
					'Department Filter' => [
						'Options' => ['Todos los deptos', 'DTIC', 'Sistemas', 'Redes', 'Seguridad', 'Operaciones'],
					],
					'Clear Filters' => 'Limpiar',
				],
				'Users List' => [
					'View Modes' => ['Card View', 'Table View'],
					'Sample Users' => [
						'User 1' => [
							'Name' => 'Carlos Mendoza',
							'Role' => 'Operador',
							'Department' => 'Operaciones',
							'Status' => 'Activo',
							'Email' => 'cmendoza@dtic.gob.ar',
							'Resources' => '3',
						],
						'User 2' => [
							'Name' => 'Laura Silva',
							'Role' => 'Supervisor',
							'Department' => 'DTIC',
							'Status' => 'Activo',
							'Email' => 'lsilva@dtic.gob.ar',
							'Resources' => '5',
						],
					],
				],
			],
		],
	],

	'Herramientas' => [
		'calendario' => [
			'Calendario Interactivo',
			'calendario.php',
			'fas fa-calendar-alt',
			'Gestión de eventos, tareas programadas y asignaciones de técnicos del DTIC',
			'Main Content' => [
				'Page Header' => [
					'Title' => 'Calendario Interactivo',
					'Icon' => 'fas fa-calendar-alt text-info',
					'Description' => 'Gestión de eventos, tareas programadas y asignaciones de técnicos del DTIC',
					'New Event Button' => 'Nuevo Evento',
					'Export Button' => 'Exportar',
				],
				'Calendar Filters and Controls' => [
					'View Options' => ['Vista Mensual', 'Vista Semanal', 'Vista Diaria', 'Lista Semanal'],
					'Technician Filter' => [
						'Options' => ['Todos los técnicos', 'Juan García', 'María Rodríguez', 'Carlos López', 'Ana Martínez', 'Roberto Martínez'],
					],
					'Resource Filter' => [
						'Options' => ['Todos los recursos', 'Auditorio', 'Proyectores', 'Computadoras', 'Equipos de Red'],
					],
					'Today Button' => 'Hoy',
					'Clear Filters' => 'Limpiar',
				],
				'Calendar Container' => [
					'Calendar Element' => 'FullCalendar instance',
				],
				'Upcoming Events Sidebar' => [
					'Upcoming Events' => [
						'Title' => 'Próximos Eventos',
						'Content' => 'Eventos will be populated by JavaScript',
					],
					'Monthly Statistics' => [
						'Title' => 'Estadísticas del Mes',
						'Events Count' => '0',
						'Tasks Count' => '0',
						'Active Technicians' => '0',
						'Busy Resources' => '0',
					],
				],
			],
		],
		'reportes' => [
			'Reportes y Estadísticas',
			'reportes.php',
			'fas fa-chart-bar',
			'Análisis y reportes del sistema DTIC Bitácoras',
			'Main Content' => [
				'Page Header' => [
					'Title' => 'Reportes y Estadísticas',
					'Icon' => 'fas fa-chart-bar text-warning',
					'Description' => 'Análisis y reportes del sistema DTIC Bitácoras',
					'Export Button' => 'Exportar',
					'Print Button' => 'Imprimir',
				],
				'Report Filters' => [
					'Report Type' => [
						'Options' => ['Tareas', 'Recursos', 'Usuarios', 'Sistema'],
					],
					'Period' => [
						'Options' => ['Hoy', 'Esta semana', 'Este mes', 'Este trimestre', 'Este año'],
					],
					'Date From' => 'Fecha Desde',
					'Date To' => 'Fecha Hasta',
					'Generate Report' => 'Generar Reporte',
					'Reset Filters' => 'Limpiar Filtros',
				],
				'Charts Section' => [
					'Tasks Status Chart' => [
						'Title' => 'Estado de Tareas',
						'Icon' => 'fas fa-chart-pie',
						'Data' => ['Pendientes' => 12, 'En Progreso' => 8, 'Completadas' => 25, 'Canceladas' => 3],
					],
					'Productivity Chart' => [
						'Title' => 'Productividad por Día',
						'Icon' => 'fas fa-chart-line',
						'Data' => ['Lun' => 3, 'Mar' => 5, 'Mié' => 2, 'Jue' => 7, 'Vie' => 4, 'Sáb' => 1, 'Dom' => 3],
					],
				],
				'Detailed Reports' => [
					'Tasks Report' => [
						'Title' => 'Reporte de Tareas',
						'Icon' => 'fas fa-tasks',
						'Metrics' => [
							'Total Tasks' => ['Value' => '48', 'Change' => '+12%'],
							'Completed Tasks' => ['Value' => '25', 'Change' => '+8%'],
							'Average Time' => ['Value' => '3.2 días', 'Change' => '-5%'],
							'Success Rate' => ['Value' => '85%', 'Change' => '+3%'],
						],
					],
					'Resources Report' => [
						'Title' => 'Reporte de Recursos',
						'Icon' => 'fas fa-boxes',
						'Categories' => [
							'Hardware' => ['Total' => 15, 'Assigned' => 8, 'Available' => 7],
							'Software' => ['Total' => 12, 'Assigned' => 5, 'Available' => 7],
							'Networks' => ['Total' => 8, 'Assigned' => 4, 'Available' => 4],
							'Tools' => ['Total' => 13, 'Assigned' => 3, 'Available' => 10],
						],
					],
				],
				'Recent Activity Report' => [
					'Title' => 'Actividad Reciente del Sistema',
					'Icon' => 'fas fa-history',
					'Activities' => [
						'Activity 1' => [
							'Type' => 'success',
							'Title' => 'Nueva tarea completada',
							'Description' => 'Implementar API de autenticación finalizada por María Rodríguez',
							'Time' => 'Hace 2 horas',
						],
						'Activity 2' => [
							'Type' => 'info',
							'Title' => 'Recurso asignado',
							'Description' => 'Laptop Dell Latitude 5420 asignada a Juan García',
							'Time' => 'Hace 4 horas',
						],
					],
				],
				'Export Options' => [
					'Title' => 'Opciones de Exportación',
					'Icon' => 'fas fa-file-export',
					'Formats' => ['PDF', 'Excel', 'CSV', 'JSON'],
				],
			],
		],
	],

	'Sistema' => [
		'estadoproyecto' => [
			'Estado del Proyecto',
			'estadoproyecto.php',
			'fas fa-info-circle',
			'Seguimiento del progreso y estado actual del desarrollo del sistema',
			'Main Content' => [
				'Project Status Header' => [
					'Title' => 'Estado del Proyecto DTIC Bitácoras',
					'Icon' => 'fas fa-project-diagram',
					'Subtitle' => 'Seguimiento del progreso y estado actual del desarrollo del sistema',
				],
				'Current Phase' => [
					'Title' => 'Fase Actual: Etapa 2 - Maquetación de la Interfaz',
					'Icon' => 'fas fa-play-circle text-success',
					'Progress' => '40%',
					'Completed' => '2 de 5 etapas completadas',
					'Phases' => [
						'Phase 1' => [
							'Status' => 'Completada',
							'Title' => 'Etapa 1 - Preparación del Entorno Docker',
							'Description' => 'Configuración completa del contenedor Docker con PHP 8.1, MySQL 8.0 y Apache.',
						],
						'Phase 2' => [
							'Status' => 'En Progreso',
							'Title' => 'Etapa 2 - Maquetación de la Interfaz',
							'Description' => 'Creación del dashboard responsivo con diseño moderno y elementos de UI.',
						],
						'Phase 3' => [
							'Status' => 'Pendiente',
							'Title' => 'Etapa 3 - Implementación del Backend PHP',
							'Description' => 'Desarrollo de APIs y conexión con base de datos MySQL.',
						],
						'Phase 4' => [
							'Status' => 'Pendiente',
							'Title' => 'Etapa 4 - Desarrollo de Funcionalidades JavaScript',
							'Description' => 'Implementación de AJAX y formularios dinámicos.',
						],
						'Phase 5' => [
							'Status' => 'Pendiente',
							'Title' => 'Etapa 5 - Pruebas y Despliegue Final',
							'Description' => 'Testing completo y configuración de producción.',
						],
					],
				],
				'Project Details' => [
					'Technologies Used' => [
						'Title' => 'Tecnologías Utilizadas',
						'Icon' => 'fas fa-cogs',
						'Frontend' => [
							'HTML5' => ['Icon' => 'fab fa-html5 text-danger'],
							'CSS3' => ['Icon' => 'fab fa-css3 text-primary'],
							'JavaScript' => ['Icon' => 'fab fa-js text-warning'],
							'Bootstrap 5' => ['Icon' => 'fas fa-bootstrap text-purple'],
						],
						'Backend' => [
							'PHP 8.1' => ['Icon' => 'fab fa-php text-indigo'],
							'MySQL 8.0' => ['Icon' => 'fas fa-database text-info'],
							'Apache' => ['Icon' => 'fas fa-server text-secondary'],
							'Docker' => ['Icon' => 'fab fa-docker text-blue'],
						],
					],
					'Project Structure' => [
						'Title' => 'Estructura del Proyecto',
						'Icon' => 'fas fa-folder-tree',
						'Directories' => [
							'dtic-bitacoras-php/' => [
								'Status' => 'completed',
								'Subdirectories' => [
									'Dockerfile' => 'completed',
									'docker-compose.yml' => 'completed',
									'public/' => [
										'Status' => 'completed',
										'Files' => [
											'index.html' => 'completed',
											'estadoproyecto.html' => 'completed',
											'index.php' => 'completed',
											'css/' => 'completed',
											'js/' => 'completed',
										],
									],
									'api/' => 'pending',
									'config/' => 'pending',
									'includes/' => 'pending',
									'database/' => 'pending',
									'logs/' => 'pending',
								],
							],
						],
					],
				],
				'Recent Updates' => [
					'Title' => 'Actualizaciones Recientes',
					'Icon' => 'fas fa-history',
					'Updates' => [
						'Update 1' => [
							'Type' => 'success',
							'Title' => 'Etapa 2 Completada',
							'Description' => 'Dashboard responsivo con diseño moderno implementado',
							'Time' => 'Hoy - Maquetación de interfaz finalizada',
						],
						'Update 2' => [
							'Type' => 'success',
							'Title' => 'Etapa 1 Completada',
							'Description' => 'Entorno Docker configurado y funcionando correctamente',
							'Time' => 'Hoy - Configuración de contenedores PHP y MySQL',
						],
						'Update 3' => [
							'Type' => 'primary',
							'Title' => 'Próxima Etapa',
							'Description' => 'Implementación del backend PHP con APIs REST',
							'Time' => 'Próximamente - Etapa 3',
						],
					],
				],
				'Quick Links' => [
					'Title' => 'Enlaces Rápidos',
					'Icon' => 'fas fa-link',
					'Links' => [
						'Dashboard' => [
							'Icon' => 'fas fa-tachometer-alt',
							'Link' => 'index.html',
						],
						'Verification' => [
							'Icon' => 'fas fa-check-circle',
							'Link' => 'index.php',
						],
						'APIs' => [
							'Icon' => 'fas fa-code',
							'Disabled' => true,
							'Note' => 'Etapa 3',
						],
						'Database' => [
							'Icon' => 'fas fa-database',
							'Disabled' => true,
							'Note' => 'Etapa 3',
						],
					],
				],
			],
		],
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