<?php
function generateContentFromArray($pageId, $section = null) {
	global $bdPags;

	if (!isset($bdPags[$pageId])) {
		return "<div class='alert alert-danger'>Página no encontrada: $pageId</div>";
	}

	$pageData = $bdPags[$pageId];

	// If section is specified, return only that section
	if ($section && isset($pageData[$section])) {
		return generateSectionHTML($pageData[$section], $section);
	}

	// Generate full page content
	$content = '';

	// Add page header if exists
	if (isset($pageData['Main Content']['Page Header'])) {
		$content .= generatePageHeader($pageData['Main Content']['Page Header']);
	}

	// Add statistics if exists
	if (isset($pageData['Main Content']['Resource Statistics']) ||
		isset($pageData['Main Content']['Task Statistics']) ||
		isset($pageData['Main Content']['User Statistics'])) {
		$content .= generateStatisticsSection($pageData['Main Content']);
	}

	// Add filters and search if exists
	if (isset($pageData['Main Content']['Filters and Search'])) {
		$content .= generateFiltersSection($pageData['Main Content']['Filters and Search']);
	}

	// Add lists/grids if exists
	if (isset($pageData['Main Content']['Tasks List']) ||
		isset($pageData['Main Content']['Resources Grid']) ||
		isset($pageData['Main Content']['Users List'])) {
		$content .= generateListSection($pageData['Main Content']);
	}

	return $content;
}

function generatePageHeader($headerData) {
	$title = $headerData['Title'] ?? 'Sin título';
	$icon = $headerData['Icon'] ?? 'fas fa-file';
	$description = $headerData['Description'] ?? '';
	$buttonText = $headerData['New Task Button'] ?? $headerData['New Resource Button'] ?? $headerData['New Technician Button'] ?? $headerData['New User Button'] ?? '';

	$buttonHTML = '';
	if ($buttonText) {
		$buttonHTML = "<button class='btn btn-primary' data-bs-toggle='modal' data-bs-target='#addModal'>
			<i class='fas fa-plus me-2'></i>$buttonText
		</button>";
	}

	return <<<HTML
	<div class="row mb-4">
		<div class="col-12">
			<div class="d-flex justify-content-between align-items-center">
				<div>
					<h1 class="h2 mb-1">
						<i class="$icon"></i>
						$title
					</h1>
					<p class="text-muted mb-0">$description</p>
				</div>
				$buttonHTML
			</div>
		</div>
	</div>
HTML;
}

function generateStatisticsSection($mainContent) {
	$content = '';

	// Task Statistics
	if (isset($mainContent['Task Statistics'])) {
		$stats = $mainContent['Task Statistics'];
		$content .= '<div class="row mb-4">';
		foreach ($stats as $key => $stat) {
			$count = $stat['Count'] ?? '0';
			$label = $stat['Label'] ?? $key;
			$desc = $stat['Description'] ?? '';
			$colorClass = match($key) {
				'Pending' => 'warning',
				'In Progress' => 'info',
				'Completed' => 'success',
				'Cancelled' => 'danger',
				default => 'primary'
			};

			$content .= <<<HTML
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-$colorClass mb-2">$count</div>
						<h6 class="card-title">$label</h6>
						<small class="text-muted">$desc</small>
					</div>
				</div>
			</div>
HTML;
		}
		$content .= '</div>';
	}

	// Resource Statistics
	if (isset($mainContent['Resource Statistics'])) {
		$stats = $mainContent['Resource Statistics'];
		$content .= '<div class="row mb-4">';
		foreach ($stats as $key => $stat) {
			$count = $stat['Count'] ?? '0';
			$label = $stat['Label'] ?? $key;
			$desc = $stat['Description'] ?? '';
			$colorClass = match($key) {
				'Total Resources' => 'primary',
				'Available' => 'success',
				'Assigned' => 'warning',
				'Maintenance' => 'danger',
				default => 'primary'
			};

			$content .= <<<HTML
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-$colorClass mb-2">$count</div>
						<h6 class="card-title">$label</h6>
						<small class="text-muted">$desc</small>
					</div>
				</div>
			</div>
HTML;
		}
		$content .= '</div>';
	}

	// User Statistics
	if (isset($mainContent['User Statistics'])) {
		$stats = $mainContent['User Statistics'];
		$content .= '<div class="row mb-4">';
		foreach ($stats as $key => $stat) {
			$count = $stat['Count'] ?? '0';
			$label = $stat['Label'] ?? $key;
			$desc = $stat['Description'] ?? '';
			$colorClass = match($key) {
				'Total Technicians', 'Total Users' => 'primary',
				'Active' => 'success',
				'Inactive' => 'warning',
				'Administrators', 'Assigned' => 'info',
				default => 'primary'
			};

			$content .= <<<HTML
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-$colorClass mb-2">$count</div>
						<h6 class="card-title">$label</h6>
						<small class="text-muted">$desc</small>
					</div>
				</div>
			</div>
HTML;
		}
		$content .= '</div>';
	}

	return $content;
}

function generateFiltersSection($filtersData) {
	$content = '<div class="row mb-4"><div class="col-12"><div class="card"><div class="card-body"><div class="row g-3">';

	// Search input
	if (isset($filtersData['Search Input'])) {
		$placeholder = $filtersData['Search Input'];
		$content .= <<<HTML
		<div class="col-md-4">
			<input type="text" class="form-control" id="searchInput" placeholder="$placeholder">
		</div>
HTML;
	}

	// Filter selects
	$filterCount = 0;
	foreach (['Role Filter', 'Status Filter', 'Priority Filter', 'Assigned Filter', 'Category Filter', 'Department Filter'] as $filterType) {
		if (isset($filtersData[$filterType])) {
			$filterCount++;
			$options = $filtersData[$filterType]['Options'] ?? [];
			$selectHTML = '<option value="">' . ($filterType === 'Role Filter' ? 'Todos los roles' :
							($filterType === 'Status Filter' ? 'Todos los estados' :
							($filterType === 'Priority Filter' ? 'Todas las prioridades' :
							($filterType === 'Assigned Filter' ? 'Todos los usuarios' :
							($filterType === 'Category Filter' ? 'Todas las categorías' :
							'Todos los deptos'))))) . '</option>';

			foreach ($options as $option) {
				$selectHTML .= "<option value='" . strtolower(str_replace(' ', '', $option)) . "'>$option</option>";
			}

			$content .= <<<HTML
			<div class="col-md-2">
				<select class="form-select" id="filter$filterCount">
					$selectHTML
				</select>
			</div>
HTML;
		}
	}

	// Clear filters button
	if (isset($filtersData['Clear Filters'])) {
		$content .= <<<HTML
		<div class="col-md-2">
			<button class="btn btn-outline-secondary w-100" id="clearFilters">
				<i class="fas fa-times me-1"></i>{$filtersData['Clear Filters']}
			</button>
		</div>
HTML;
	}

	$content .= '</div></div></div></div>';

	return $content;
}

function generateListSection($mainContent) {
	$content = '<div class="row"><div class="col-12"><div class="card"><div class="card-header d-flex justify-content-between align-items-center"><h5 class="mb-0">Lista</h5>';

	// View mode toggles
	if (isset($mainContent['Tasks List']['View Modes']) ||
		isset($mainContent['Users List']['View Modes'])) {
		$content .= <<<HTML
		<div class="btn-group" role="group">
			<input type="radio" class="btn-check" name="viewMode" id="cardView" autocomplete="off" checked>
			<label class="btn btn-outline-primary btn-sm" for="cardView">
				<i class="fas fa-th"></i>
			</label>
			<input type="radio" class="btn-check" name="viewMode" id="tableView" autocomplete="off">
			<label class="btn btn-outline-primary btn-sm" for="tableView">
				<i class="fas fa-list"></i>
			</label>
		</div>
HTML;
	}

	$content .= '</div><div class="card-body">';

	// Sample data
	if (isset($mainContent['Tasks List']['Sample Tasks'])) {
		$content .= '<div id="cardViewContainer" class="row">';
		foreach ($mainContent['Tasks List']['Sample Tasks'] as $taskId => $task) {
			$title = $task['Title'] ?? 'Sin título';
			$id = $task['ID'] ?? '';
			$status = $task['Status'] ?? 'pending';
			$priority = $task['Priority'] ?? 'medium';
			$assigned = $task['Assigned'] ?? '';
			$created = $task['Created'] ?? '';
			$due = $task['Due'] ?? '';

			$statusColor = match($status) {
				'Pendiente' => 'warning',
				'En Progreso' => 'info',
				'Completada' => 'success',
				'Cancelada' => 'secondary',
				default => 'warning'
			};

			$priorityColor = match($priority) {
				'Baja' => 'success',
				'Media' => 'warning',
				'Alta' => 'danger',
				'Urgente' => 'danger',
				default => 'warning'
			};

			$content .= <<<HTML
			<div class="col-md-6 col-lg-4 mb-3">
				<div class="card h-100 border-start border-$statusColor border-4">
					<div class="card-header bg-light">
						<div class="d-flex justify-content-between align-items-start">
							<div>
								<h6 class="card-title mb-1">$title</h6>
								<small class="text-muted">ID: $id</small>
							</div>
							<span class="badge bg-$statusColor">$status</span>
						</div>
					</div>
					<div class="card-body">
						<div class="row text-center">
							<div class="col-6">
								<small class="text-muted d-block">Prioridad</small>
								<span class="badge bg-$priorityColor">$priority</span>
							</div>
							<div class="col-6">
								<small class="text-muted d-block">Asignado</small>
								<span class="fw-bold">$assigned</span>
							</div>
						</div>
						<hr>
						<small class="text-muted">Creado: $created | Vence: $due</small>
					</div>
					<div class="card-footer bg-transparent">
						<div class="btn-group w-100" role="group">
							<button class="btn btn-outline-primary btn-sm" title="Editar">
								<i class="fas fa-edit"></i>
							</button>
							<button class="btn btn-outline-success btn-sm" title="Iniciar">
								<i class="fas fa-play"></i>
							</button>
							<button class="btn btn-outline-danger btn-sm" title="Eliminar">
								<i class="fas fa-trash"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
HTML;
		}
		$content .= '</div>';
	}

	$content .= '</div></div></div>';

	return $content;
}

function getDashboardContent(){
	global $bdPags;

	if (!isset($bdPags['Dashboard']['index']['Main Content'])) {
		return "<div class='alert alert-danger'>Error: Dashboard data not found in configuration</div>";
	}

	$dashboardData = $bdPags['Dashboard']['index']['Main Content'];
	$content = '';

	// Dashboard Header
	if (isset($dashboardData['Dashboard Header'])) {
		$header = $dashboardData['Dashboard Header'];
		$content .= <<<HTML
		<div class="dashboard-header fade-in">
			<h1 class="dashboard-title">
				<i class="fas fa-chart-line me-3"></i>
				{$header['Title']}
			</h1>
			<p class="dashboard-subtitle">
				{$header['Subtitle']}
			</p>
			<div class="row mt-4">
				<div class="col-md-3">
					<div class="text-center">
						<div id="current-date" class="h5 text-muted"></div>
						<small class="text-secondary">{$header['Current Date']}</small>
					</div>
				</div>
				<div class="col-md-3">
					<div class="text-center">
						<div id="current-time" class="h5 text-muted"></div>
						<small class="text-secondary">{$header['Current Time']}</small>
					</div>
				</div>
				<div class="col-md-3">
					<div class="text-center">
						<div id="system-status" class="h5 text-success">
							<i class="fas fa-circle text-success me-1"></i>{$header['System Status']}
						</div>
						<small class="text-secondary">Estado del Sistema</small>
					</div>
				</div>
				<div class="col-md-3">
					<div class="text-center">
						<div id="active-users" class="h5 text-primary">{$header['Active User']}</div>
						<small class="text-secondary">Usuario Activo</small>
					</div>
				</div>
			</div>
		</div>
HTML;
	}

	// Statistics Cards
	if (isset($dashboardData['Statistics Cards'])) {
		$content .= '<div class="row mb-4">';
		foreach ($dashboardData['Statistics Cards'] as $cardKey => $card) {
			$content .= <<<HTML
			<div class="col-md-3 mb-3">
				<div class="card h-100">
					<div class="card-header">
						<i class="{$card['Icon']}"></i>
						{$card['Title']}
					</div>
					<div class="card-body text-center">
						<div class="card-text task-pending" id="pending-tasks">{$card['Count']}</div>
						<small class="text-muted">{$card['Description']}</small>
					</div>
				</div>
			</div>
HTML;
		}
		$content .= '</div>';
	}

	// Recent Activity & Upcoming Events
	if (isset($dashboardData['Recent Activity & Upcoming Events'])) {
		$content .= '<div class="row">';
		foreach ($dashboardData['Recent Activity & Upcoming Events'] as $sectionKey => $section) {
			if ($sectionKey === 'Recent Tasks') {
				$content .= <<<HTML
			<div class="col-md-6 mb-4">
				<div class="card">
					<div class="card-header">
						<i class="{$section['Icon']} me-2"></i>
						{$section['Title']}
					</div>
					<div class="card-body">
						<div id="recent-activity" class="text-center text-muted py-4">
							<i class="fas fa-inbox fa-3x mb-3"></i>
							<p>{$section['Content']}</p>
							<small>Las actividades aparecerán aquí una vez que se implemente el backend.</small>
						</div>
					</div>
				</div>
			</div>
HTML;
			} elseif ($sectionKey === 'Upcoming Events') {
				$content .= <<<HTML
			<div class="col-md-6 mb-4">
				<div class="card">
					<div class="card-header d-flex justify-content-between align-items-center">
						<div>
							<i class="{$section['Icon']} me-2"></i>
							{$section['Title']}
						</div>
						<a href="index.php?page=calendario" class="btn btn-sm btn-outline-primary">
							<i class="fas fa-external-link-alt"></i>
						</a>
					</div>
					<div class="card-body">
						<div id="dashboard-upcoming-events">
							<!-- Events will be populated by JavaScript -->
						</div>
					</div>
				</div>
			</div>
HTML;
			}
		}
		$content .= '</div>';
	}

	// Quick Actions
	if (isset($dashboardData['Quick Actions'])) {
		$actions = $dashboardData['Quick Actions'];
		$content .= <<<HTML
		<div class="row">
			<div class="col-12 mb-4">
				<div class="card">
					<div class="card-header">
						<i class="{$actions['Icon']} me-2"></i>
						{$actions['Title']}
					</div>
					<div class="card-body">
						<div class="row">
HTML;

		foreach ($actions['Actions'] as $actionKey => $action) {
			$disabled = isset($action['Disabled']) && $action['Disabled'] ? 'disabled' : '';
			$onclick = isset($action['Link']) ? "onclick=\"window.location.href='{$action['Link']}'\"" : '';
			$content .= <<<HTML
							<div class="col-md-3">
								<div class="d-grid gap-2">
									<button class="btn btn-primary" id="btn-{$actionKey}" $disabled $onclick>
										<i class="{$action['Icon']} me-2"></i>{$action['Text']}
									</button>
								</div>
							</div>
HTML;
		}

		$content .= <<<HTML
						</div>
						<hr>
						<div class="text-center">
							<small class="text-muted">
								<i class="fas fa-info-circle me-1"></i>
								Las acciones estarán disponibles en etapas posteriores
							</small>
						</div>
					</div>
				</div>
			</div>
		</div>
HTML;
	}

	// System Information
	if (isset($dashboardData['System Information'])) {
		$sysInfo = $dashboardData['System Information'];
		$content .= <<<HTML
		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-header">
						<i class="{$sysInfo['Icon']} me-2"></i>
						{$sysInfo['Title']}
					</div>
					<div class="card-body">
						<div class="row">
HTML;

		foreach ($sysInfo['Items'] as $itemKey => $item) {
			$linkHTML = isset($item['Link']) ? "<a href=\"index.php?page={$item['Link']}\" class=\"text-decoration-none\">" : '';
			$linkClose = isset($item['Link']) ? '</a>' : '';

			$content .= <<<HTML
							<div class="col-md-3">
								<div class="text-center">
									$linkHTML
									<i class="{$item['Icon']} fa-2x text-primary mb-2"></i>
									<div class="h6">{$item['Version']}</div>
									<small class="text-muted">{$item['Description']}</small>
									$linkClose
								</div>
							</div>
HTML;
		}

		$content .= <<<HTML
						</div>
					</div>
				</div>
			</div>
		</div>
HTML;
	}

	return $content;
}

function getTecnicosContent(){
	return <<<HTML
		<div class="row mb-4">
			<div class="col-12">
				<div class="d-flex justify-content-between align-items-center">
					<div>
						<h1 class="h2 mb-1">
							<i class="fas fa-users text-info me-2"></i>
							Gestión de Técnicos
						</h1>
						<p class="text-muted mb-0">Administra los técnicos asignados a recursos del sistema DTIC Bitácoras</p>
					</div>
					<button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#addUserModal">
						<i class="fas fa-user-plus me-2"></i>Nuevo Técnico
					</button>
				</div>
			</div>
		</div>

		<div class="row mb-4">
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-primary mb-2" id="totalUsers">6</div>
						<h6 class="card-title">Total Técnicos</h6>
						<small class="text-muted">Registrados en el sistema</small>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-success mb-2" id="activeUsers">5</div>
						<h6 class="card-title">Activos</h6>
						<small class="text-muted">Con acceso al sistema</small>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-warning mb-2" id="inactiveUsers">1</div>
						<h6 class="card-title">Inactivos</h6>
						<small class="text-muted">Acceso suspendido</small>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-danger mb-2" id="adminUsers">1</div>
						<h6 class="card-title">Administradores</h6>
						<small class="text-muted">Acceso completo</small>
					</div>
				</div>
			</div>
		</div>

		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<div class="row g-3">
							<div class="col-md-4">
								<input type="text" class="form-control" id="searchUsers" placeholder="Buscar técnicos...">
							</div>
							<div class="col-md-2">
								<select class="form-select" id="filterRole">
									<option value="">Todos los roles</option>
									<option value="admin">Administrador</option>
									<option value="technician">Técnico</option>
									<option value="viewer">Visualizador</option>
								</select>
							</div>
							<div class="col-md-2">
								<select class="form-select" id="filterStatus">
									<option value="">Todos los estados</option>
									<option value="active">Activo</option>
									<option value="inactive">Inactivo</option>
									<option value="pending">Pendiente</option>
								</select>
							</div>
							<div class="col-md-2">
								<select class="form-select" id="filterDepartment">
									<option value="">Todos los deptos</option>
									<option value="dtic">DTIC</option>
									<option value="sistemas">Sistemas</option>
									<option value="redes">Redes</option>
									<option value="seguridad">Seguridad</option>
								</select>
							</div>
							<div class="col-md-2">
								<button class="btn btn-outline-secondary w-100" id="clearFilters">
									<i class="fas fa-times me-1"></i>Limpiar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-header d-flex justify-content-between align-items-center">
						<h5 class="mb-0">Lista de Técnicos</h5>
						<div class="btn-group" role="group">
							<input type="radio" class="btn-check" name="viewMode" id="cardView" autocomplete="off" checked>
							<label class="btn btn-outline-primary btn-sm" for="cardView">
								<i class="fas fa-th"></i>
							</label>
							<input type="radio" class="btn-check" name="viewMode" id="tableView" autocomplete="off">
							<label class="btn btn-outline-primary btn-sm" for="tableView">
								<i class="fas fa-list"></i>
							</label>
						</div>
					</div>
					<div class="card-body">
						<div id="cardViewContainer" class="row">
							<div class="col-md-6 col-lg-4 mb-3">
								<div class="card h-100">
									<div class="card-header bg-danger text-white">
										<div class="d-flex justify-content-between align-items-center">
											<div class="d-flex align-items-center">
												<div class="avatar-circle bg-white text-danger me-3">
													<i class="fas fa-user-shield"></i>
												</div>
												<div>
													<h6 class="mb-0">Roberto Martínez</h6>
													<small>Administrador</small>
												</div>
											</div>
											<span class="badge bg-success">Activo</span>
										</div>
									</div>
									<div class="card-body">
										<div class="row">
											<div class="col-12">
												<p class="mb-2"><strong>Email:</strong> rmartinez@dtic.gob.ar</p>
												<p class="mb-2"><strong>Departamento:</strong> DTIC</p>
												<p class="mb-2"><strong>Teléfono:</strong> +54 11 1234-5678</p>
												<p class="mb-2"><strong>Último acceso:</strong> Hoy 10:30</p>
												<p class="mb-0"><strong>Tareas asignadas:</strong> 3</p>
											</div>
										</div>
									</div>
									<div class="card-footer">
										<div class="btn-group w-100" role="group">
											<button class="btn btn-outline-primary btn-sm" title="Ver Perfil">
												<i class="fas fa-eye"></i>
											</button>
											<button class="btn btn-outline-warning btn-sm" title="Editar">
												<i class="fas fa-edit"></i>
											</button>
											<button class="btn btn-outline-info btn-sm" title="Permisos">
												<i class="fas fa-key"></i>
											</button>
											<button class="btn btn-outline-danger btn-sm" title="Desactivar">
												<i class="fas fa-ban"></i>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div id="tableViewContainer" class="d-none">
							<div class="table-responsive">
								<table class="table table-hover">
									<thead>
										<tr>
											<th>Nombre</th>
											<th>Email</th>
											<th>Rol</th>
											<th>Departamento</th>
											<th>Estado</th>
											<th>Último Acceso</th>
											<th>Acciones</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Roberto Martínez</td>
											<td>rmartinez@dtic.gob.ar</td>
											<td><span class="badge bg-danger">Administrador</span></td>
											<td>DTIC</td>
											<td><span class="badge bg-success">Activo</span></td>
											<td>Hoy 10:30</td>
											<td>
												<div class="btn-group" role="group">
													<button class="btn btn-outline-primary btn-sm" title="Ver">
														<i class="fas fa-eye"></i>
													</button>
													<button class="btn btn-outline-warning btn-sm" title="Editar">
														<i class="fas fa-edit"></i>
													</button>
													<button class="btn btn-outline-danger btn-sm" title="Desactivar">
														<i class="fas fa-ban"></i>
													</button>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
HTML;
}

function getUsuariosContent(){
	return <<<HTML
		<div class="row mb-4">
			<div class="col-12">
				<div class="d-flex justify-content-between align-items-center">
					<div>
						<h1 class="h2 mb-1">
							<i class="fas fa-users text-primary me-2"></i>
							Gestión de Usuarios
						</h1>
						<p class="text-muted mb-0">Administra los usuarios que trabajan con recursos del sistema DTIC Bitácoras</p>
					</div>
					<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">
						<i class="fas fa-user-plus me-2"></i>Nuevo Usuario
					</button>
				</div>
			</div>
		</div>

		<div class="row mb-4">
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-primary mb-2" id="totalUsers">8</div>
						<h6 class="card-title">Total Usuarios</h6>
						<small class="text-muted">Registrados en el sistema</small>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-success mb-2" id="activeUsers">7</div>
						<h6 class="card-title">Activos</h6>
						<small class="text-muted">Con acceso al sistema</small>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-warning mb-2" id="inactiveUsers">1</div>
						<h6 class="card-title">Inactivos</h6>
						<small class="text-muted">Acceso suspendido</small>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-info mb-2" id="assignedUsers">6</div>
						<h6 class="card-title">Asignados</h6>
						<small class="text-muted">Con recursos asignados</small>
					</div>
				</div>
			</div>
		</div>

		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<div class="row g-3">
							<div class="col-md-4">
								<input type="text" class="form-control" id="searchUsers" placeholder="Buscar usuarios...">
							</div>
							<div class="col-md-2">
								<select class="form-select" id="filterRole">
									<option value="">Todos los roles</option>
									<option value="operador">Operador</option>
									<option value="supervisor">Supervisor</option>
									<option value="analista">Analista</option>
									<option value="invitado">Invitado</option>
								</select>
							</div>
							<div class="col-md-2">
								<select class="form-select" id="filterStatus">
									<option value="">Todos los estados</option>
									<option value="active">Activo</option>
									<option value="inactive">Inactivo</option>
									<option value="pending">Pendiente</option>
								</select>
							</div>
							<div class="col-md-2">
								<select class="form-select" id="filterDepartment">
									<option value="">Todos los deptos</option>
									<option value="dtic">DTIC</option>
									<option value="sistemas">Sistemas</option>
									<option value="redes">Redes</option>
									<option value="seguridad">Seguridad</option>
									<option value="operaciones">Operaciones</option>
								</select>
							</div>
							<div class="col-md-2">
								<button class="btn btn-outline-secondary w-100" id="clearFilters">
									<i class="fas fa-times me-1"></i>Limpiar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-header d-flex justify-content-between align-items-center">
						<h5 class="mb-0">Lista de Usuarios</h5>
						<div class="btn-group" role="group">
							<input type="radio" class="btn-check" name="viewMode" id="cardView" autocomplete="off" checked>
							<label class="btn btn-outline-primary btn-sm" for="cardView">
								<i class="fas fa-th"></i>
							</label>
							<input type="radio" class="btn-check" name="viewMode" id="tableView" autocomplete="off">
							<label class="btn btn-outline-primary btn-sm" for="tableView">
								<i class="fas fa-list"></i>
							</label>
						</div>
					</div>
					<div class="card-body">
						<div id="cardViewContainer" class="row">
							<div class="col-md-6 col-lg-4 mb-3">
								<div class="card h-100">
									<div class="card-header bg-primary text-white">
										<div class="d-flex justify-content-between align-items-center">
											<div class="d-flex align-items-center">
												<div class="avatar-circle bg-white text-primary me-3">
													<i class="fas fa-user"></i>
												</div>
												<div>
													<h6 class="mb-0">Carlos Mendoza</h6>
													<small>Operador</small>
												</div>
											</div>
											<span class="badge bg-success">Activo</span>
										</div>
									</div>
									<div class="card-body">
										<div class="row">
											<div class="col-12">
												<p class="mb-2"><strong>Email:</strong> cmendoza@dtic.gob.ar</p>
												<p class="mb-2"><strong>Departamento:</strong> Operaciones</p>
												<p class="mb-2"><strong>Teléfono:</strong> +54 11 1234-5690</p>
												<p class="mb-2"><strong>Último acceso:</strong> Hoy 09:30</p>
												<p class="mb-0"><strong>Recursos asignados:</strong> 3</p>
											</div>
										</div>
									</div>
									<div class="card-footer">
										<div class="btn-group w-100" role="group">
											<button class="btn btn-outline-primary btn-sm" title="Ver Perfil">
												<i class="fas fa-eye"></i>
											</button>
											<button class="btn btn-outline-warning btn-sm" title="Editar">
												<i class="fas fa-edit"></i>
											</button>
											<button class="btn btn-outline-info btn-sm" title="Asignar Recursos">
												<i class="fas fa-link"></i>
											</button>
											<button class="btn btn-outline-danger btn-sm" title="Desactivar">
												<i class="fas fa-ban"></i>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
HTML;
}

function getTareasContent(){
	return <<<HTML
		<div class="row mb-4">
			<div class="col-12">
				<div class="d-flex justify-content-between align-items-center">
					<div>
						<h1 class="h2 mb-1">
							<i class="fas fa-tasks text-primary me-2"></i>
							Gestión de Tareas
						</h1>
						<p class="text-muted mb-0">Administra todas las tareas del sistema DTIC Bitácoras</p>
					</div>
					<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTaskModal">
						<i class="fas fa-plus me-2"></i>Nueva Tarea
					</button>
				</div>
			</div>
		</div>

		<div class="row mb-4">
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-warning mb-2" id="totalPending">12</div>
						<h6 class="card-title">Pendientes</h6>
						<small class="text-muted">Esperando asignación</small>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-info mb-2" id="totalInProgress">8</div>
						<h6 class="card-title">En Progreso</h6>
						<small class="text-muted">Actualmente trabajando</small>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-success mb-2" id="totalCompleted">25</div>
						<h6 class="card-title">Completadas</h6>
						<small class="text-muted">Este mes</small>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-danger mb-2" id="totalCancelled">3</div>
						<h6 class="card-title">Canceladas</h6>
						<small class="text-muted">Este mes</small>
					</div>
				</div>
			</div>
		</div>

		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<div class="row g-3">
							<div class="col-md-4">
								<input type="text" class="form-control" id="searchTasks" placeholder="Buscar tareas...">
							</div>
							<div class="col-md-2">
								<select class="form-select" id="filterStatus">
									<option value="">Todos los estados</option>
									<option value="pending">Pendientes</option>
									<option value="in-progress">En Progreso</option>
									<option value="completed">Completadas</option>
									<option value="cancelled">Canceladas</option>
								</select>
							</div>
							<div class="col-md-2">
								<select class="form-select" id="filterPriority">
									<option value="">Todas las prioridades</option>
									<option value="low">Baja</option>
									<option value="medium">Media</option>
									<option value="high">Alta</option>
									<option value="urgent">Urgente</option>
								</select>
							</div>
							<div class="col-md-2">
								<select class="form-select" id="filterAssigned">
									<option value="">Todos los usuarios</option>
									<option value="jgarcia">Juan García</option>
									<option value="mrodriguez">María Rodríguez</option>
									<option value="clopez">Carlos López</option>
									<option value="anamartinez">Ana Martínez</option>
								</select>
							</div>
							<div class="col-md-2">
								<button class="btn btn-outline-secondary w-100" id="clearFilters">
									<i class="fas fa-times me-1"></i>Limpiar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-header d-flex justify-content-between align-items-center">
						<h5 class="mb-0">Lista de Tareas</h5>
						<div class="btn-group" role="group">
							<input type="radio" class="btn-check" name="viewMode" id="cardView" autocomplete="off" checked>
							<label class="btn btn-outline-primary btn-sm" for="cardView">
								<i class="fas fa-th"></i>
							</label>
							<input type="radio" class="btn-check" name="viewMode" id="tableView" autocomplete="off">
							<label class="btn btn-outline-primary btn-sm" for="tableView">
								<i class="fas fa-list"></i>
							</label>
						</div>
					</div>
					<div class="card-body">
						<div id="cardViewContainer" class="row">
							<div class="col-md-6 col-lg-4 mb-3">
								<div class="card h-100 border-start border-warning border-4">
									<div class="card-header bg-light">
										<div class="d-flex justify-content-between align-items-start">
											<div>
												<h6 class="card-title mb-1">Configurar servidor de desarrollo</h6>
												<small class="text-muted">ID: TSK-001</small>
											</div>
											<span class="badge bg-warning">Pendiente</span>
										</div>
									</div>
									<div class="card-body">
										<p class="card-text small">Instalar y configurar el servidor de desarrollo para el proyecto DTIC Bitácoras con todos los servicios necesarios.</p>
										<div class="row text-center">
											<div class="col-6">
												<small class="text-muted d-block">Prioridad</small>
												<span class="badge bg-danger">Alta</span>
											</div>
											<div class="col-6">
												<small class="text-muted d-block">Asignado</small>
												<span class="fw-bold">Juan García</span>
											</div>
										</div>
										<hr>
										<div class="mb-2">
											<small class="text-muted d-block">Estado actual:</small>
											<span class="badge bg-light text-dark">Esperando asignación</span>
										</div>
										<div class="mb-2">
											<small class="text-muted d-block">Última actividad:</small>
											<small>Tarea creada - Sin movimientos previos</small>
										</div>
										<small class="text-muted">Creado: 15/10/2025 | Vence: 20/10/2025</small>
									</div>
									<div class="card-footer bg-transparent">
										<div class="btn-group w-100" role="group">
											<button class="btn btn-outline-primary btn-sm" title="Editar">
												<i class="fas fa-edit"></i>
											</button>
											<button class="btn btn-outline-success btn-sm" title="Iniciar">
												<i class="fas fa-play"></i>
											</button>
											<button class="btn btn-outline-danger btn-sm" title="Eliminar">
												<i class="fas fa-trash"></i>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
HTML;
}

function getRecursosContent(){
	return <<<HTML
		<div class="row mb-4">
			<div class="col-12">
				<div class="d-flex justify-content-between align-items-center">
					<div>
						<h1 class="h2 mb-1">
							<i class="fas fa-boxes text-success me-2"></i>
							Gestión de Recursos
						</h1>
						<p class="text-muted mb-0">Administra el inventario de recursos del sistema DTIC Bitácoras</p>
					</div>
					<button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addResourceModal">
						<i class="fas fa-plus me-2"></i>Nuevo Recurso
					</button>
				</div>
			</div>
		</div>

		<div class="row mb-4">
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-primary mb-2" id="totalResources">48</div>
						<h6 class="card-title">Total Recursos</h6>
						<small class="text-muted">En inventario</small>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-success mb-2" id="availableResources">35</div>
						<h6 class="card-title">Disponibles</h6>
						<small class="text-muted">Listos para asignar</small>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-warning mb-2" id="assignedResources">10</div>
						<h6 class="card-title">Asignados</h6>
						<small class="text-muted">En uso actualmente</small>
					</div>
				</div>
			</div>
			<div class="col-md-3 mb-3">
				<div class="card text-center h-100">
					<div class="card-body">
						<div class="display-4 text-danger mb-2" id="maintenanceResources">3</div>
						<h6 class="card-title">En Mantenimiento</h6>
						<small class="text-muted">Fuera de servicio</small>
					</div>
				</div>
			</div>
		</div>

		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<div class="row g-3">
							<div class="col-md-3">
								<input type="text" class="form-control" id="searchResources" placeholder="Buscar recursos...">
							</div>
							<div class="col-md-3">
								<select class="form-select" id="filterCategory">
									<option value="">Todas las categorías</option>
									<option value="hardware">Hardware</option>
									<option value="software">Software</option>
									<option value="network">Redes</option>
									<option value="security">Seguridad</option>
									<option value="tools">Herramientas</option>
								</select>
							</div>
							<div class="col-md-3">
								<select class="form-select" id="filterStatus">
									<option value="">Todos los estados</option>
									<option value="available">Disponible</option>
									<option value="assigned">Asignado</option>
									<option value="maintenance">Mantenimiento</option>
									<option value="retired">Retirado</option>
								</select>
							</div>
							<div class="col-md-3">
								<button class="btn btn-outline-secondary w-100" id="clearFilters">
									<i class="fas fa-times me-1"></i>Limpiar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row" id="resourcesGrid">
			<div class="col-md-6 col-lg-4 mb-4">
				<div class="card h-100">
					<div class="card-header bg-primary text-white">
						<div class="d-flex justify-content-between align-items-center">
							<h6 class="mb-0">
								<i class="fas fa-laptop me-2"></i>Laptop Dell Latitude 5420
							</h6>
							<span class="badge bg-success">Disponible</span>
						</div>
					</div>
					<div class="card-body">
						<div class="row">
							<div class="col-4 text-center">
								<i class="fas fa-laptop fa-3x text-primary mb-2"></i>
							</div>
							<div class="col-8">
								<p class="mb-2"><strong>ID:</strong> RES-001</p>
								<p class="mb-2"><strong>Categoría:</strong> Hardware</p>
								<p class="mb-2"><strong>Modelo:</strong> Dell Latitude 5420</p>
								<p class="mb-2"><strong>Serie:</strong> DL5420-2025-001</p>
								<p class="mb-0"><strong>Ubicación:</strong> Oficina Principal</p>
							</div>
						</div>
						<hr>
						<div class="mb-2">
							<small class="text-muted d-block">Última tarea realizada:</small>
							<small class="fw-bold">Configurar servidor de desarrollo (TSK-001)</small><br>
							<small>Completada el 18/10/2025 por Juan García</small>
						</div>
					</div>
					<div class="card-footer">
						<div class="btn-group w-100" role="group">
							<button class="btn btn-outline-primary btn-sm" title="Ver Detalles">
								<i class="fas fa-eye"></i>
							</button>
							<button class="btn btn-outline-warning btn-sm" title="Editar">
								<i class="fas fa-edit"></i>
							</button>
							<button class="btn btn-outline-success btn-sm" title="Asignar">
								<i class="fas fa-user-plus"></i>
							</button>
							<button class="btn btn-outline-danger btn-sm" title="Eliminar">
								<i class="fas fa-trash"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
HTML;
}

function getCalendarioContent(){
	return <<<HTML
		<div class="row mb-4">
			<div class="col-12">
				<div class="d-flex justify-content-between align-items-center">
					<div>
						<h1 class="h2 mb-1">
							<i class="fas fa-calendar-alt text-info me-2"></i>
							Calendario Interactivo
						</h1>
						<p class="text-muted mb-0">Gestión de eventos, tareas programadas y asignaciones de técnicos del DTIC</p>
					</div>
					<div class="btn-group" role="group">
						<button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#addEventModal">
							<i class="fas fa-plus me-2"></i>Nuevo Evento
						</button>
						<button class="btn btn-outline-secondary" id="exportCalendar">
							<i class="fas fa-download me-2"></i>Exportar
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="row mb-4">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<div class="row g-3">
							<div class="col-md-3">
								<select class="form-select" id="calendarView">
									<option value="dayGridMonth">Vista Mensual</option>
									<option value="timeGridWeek">Vista Semanal</option>
									<option value="timeGridDay">Vista Diaria</option>
									<option value="listWeek">Lista Semanal</option>
								</select>
							</div>
							<div class="col-md-3">
								<select class="form-select" id="technicianFilter">
									<option value="">Todos los técnicos</option>
									<option value="jgarcia">Juan García</option>
									<option value="mrodriguez">María Rodríguez</option>
									<option value="clopez">Carlos López</option>
									<option value="amartinez">Ana Martínez</option>
									<option value="rmartinez">Roberto Martínez</option>
								</select>
							</div>
							<div class="col-md-3">
								<select class="form-select" id="resourceFilter">
									<option value="">Todos los recursos</option>
									<option value="auditorio">Auditorio</option>
									<option value="proyector">Proyectores</option>
									<option value="computadoras">Computadoras</option>
									<option value="redes">Equipos de Red</option>
								</select>
							</div>
							<div class="col-md-3">
								<div class="d-flex gap-2">
									<button class="btn btn-outline-primary flex-fill" id="todayBtn">Hoy</button>
HTML;
}								