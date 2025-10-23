<?php
/* «® INCLUDES  ®» */
	include_once 'includes/appApDATs.php';
	include_once 'includes/appBbPaginas.php';
	include_once 'includes/appFxGetHTMLs.php';
	include_once 'includes/appFxPaginas.php';

/* «® DETERMINAR PAGINA ACTUAL  ®» */
	$currentPage = isset($_GET['page']) ? $_GET['page'] : 'index';

/* «® GENERAR CONTENIDO SEGUN PAGINA  ®» */
	switch ($currentPage) {
		case 'tecnicos':
			$titulo = getPagInfo('tecnicos', 'titulo');
			$contenido = generateContentFromArray('Gestión', 'tecnicos');
			break;
		case 'usuarios':
			$titulo = getPagInfo('usuarios', 'titulo');
			$contenido = generateContentFromArray('Gestión', 'usuarios');
			break;
		case 'tareas':
			$titulo = getPagInfo('tareas', 'titulo');
			$contenido = generateContentFromArray('Gestión', 'tareas');
			break;
		case 'recursos':
			$titulo = getPagInfo('recursos', 'titulo');
			$contenido = generateContentFromArray('Gestión', 'recursos');
			break;
		case 'calendario':
			$titulo = getPagInfo('calendario', 'titulo');
			$contenido = generateContentFromArray('Herramientas', 'calendario');
			break;
		case 'reportes':
			$titulo = getPagInfo('reportes', 'titulo');
			$contenido = generateContentFromArray('Herramientas', 'reportes');
			break;
		case 'estadoproyecto':
			$titulo = getPagInfo('estadoproyecto', 'titulo');
			$contenido = generateContentFromArray('Sistema', 'estadoproyecto');
			break;
		default:
			$titulo = 'Dashboard DTIC Bitácoras';
			$contenido = getDashboardContent();
			$currentPage = 'index';
			break;
	}

/* «® SALIDA  ®» */
	echo getPageTemplate($titulo, $contenido, $currentPage);
?>