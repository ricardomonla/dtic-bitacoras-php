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
			$contenido = getTecnicosContent();
			break;
		case 'usuarios':
			$titulo = getPagInfo('usuarios', 'titulo');
			$contenido = getUsuariosContent();
			break;
		case 'tareas':
			$titulo = getPagInfo('tareas', 'titulo');
			$contenido = getTareasContent();
			break;
		case 'recursos':
			$titulo = getPagInfo('recursos', 'titulo');
			$contenido = getRecursosContent();
			break;
		case 'calendario':
			$titulo = getPagInfo('calendario', 'titulo');
			$contenido = getCalendarioContent();
			break;
		case 'reportes':
			$titulo = getPagInfo('reportes', 'titulo');
			$contenido = getReportesContent();
			break;
		case 'estadoproyecto':
			$titulo = getPagInfo('estadoproyecto', 'titulo');
			$contenido = getEstadoProyectoContent();
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