<?php 
/* «® VERSIONADO  ®» */
  $logVERs = ' => 
    4.1.2 => MAIN: Re-ubico carpetas y optimizo código.
    4.1.1 => MAIN: Cambio nombre y ubicación de los archivos de la App.
    3.10.2 => MAIN: Retiro el index html y se usa el php.
    3.10.1 => AULAS: Agrego aula virtual PreIng22.Int.
    3.9.5 => INDEX: Actuaslizo HTML del INDEX MAIN.
    3.9.4 => INDEX: Corrigue HTML de lhst1ro.
    3.9.3 => INDEX: Genera Pag. HTML de lhst1ro, lte1ro, lte2do, tuhst1ro, tup1ro, tup2do, tusv2do, posg/emia.
    3.9.2 => INDEX: Genera Pag. HTML de preing.
    3.9.1 => INDEX: Genera Pag. HTML MAIN de respaldo.
    3.8.6 => bdAULAs: Baja de Curso Elemento Finito.
    3.8.5 => bdAULAs: Baja de los Cursos GAIA.
    3.8.4 => bdAULAs: Baja de los Cursos EXCEL-Nivel1.
    3.8.3 => bdAULAs: Agraga datos de PList de GAIA.
    3.8.2 => MAIN: Corrige bug zona horaria en logo calendario.
    3.8.1 => MAIN: Retorna a la versión PHP.
    3.7.1 => MAIN: Cambia a la versión html por enlace caído.
    3.6.2 => MAIN: Soluciona BUGs que solo se muestran en servidor UTN.
    3.6.1 => MAIN: Modifica forma de acceder a las constantes e includes.
    3.5.10 => AULAS: Mueve aulas ICI, IEM y IEL para coincidir con los calendarios.
    3.5.9 => MAIN: Optimizo APPVER.
    3.5.8 => AULAS: Agrega aulas virtuales de las carrera ICI, IEM y IEL.
    3.5.7 => AULAS: Agrega aulas de la Carrera ICI.
    3.5.6 => PI2022ME: Arregla error de tipeo.
    3.5.5 => PI2022ME: Agrega aula virtual.
    3.5.4 => ADIGITAL: Agrega redireccfionador al canal Youtube y a la planilla tituladora.
    3.5.3 => appDATs: Modifica como se obtiene la versión
    3.5.2 => INDEX: Modifica includes
    3.5.1 => MAIN: Agrega appINCS.php, appDATS.php
    ';
  $appVer = explode(" => ", $logVERs);
  $appVer = 'v'.trim($appVer[1]);
    
/* «® CONSTANTES  ®» */
  define('APPVER', $appVer);
  define('APPAUT', '«®» Ricardo MONLA <rmonla@gmail.com> «®»');
  define('APPDEV', 'https://github.com/rmonla/dticAulaVirtual');
  define('APPPUB', 'http://www.frlr.utn.edu.ar/dtic/aulavirtual');

  define('APPNOM', 'dtcAulaVirtual');
  define('APPDET', '

    «®» Servicio de aulas virtuales de la UTNLaRioja. «®» 
    El objetivo principal es el de dar acceso a las clases no presenciales a los distintos integrantes de la comunidad educativa de la Facultad.

    ');
  define('AV_SITIO',    'http://www.frlr.utn.edu.ar/dtic/aulavirtual/');
  define('AV_ADIGITAL', 'https://www.youtube.com/channel/UC_cmKYtM9hy9-UI_qHpmahw');
  define('AV_IMGS',     AV_SITIO.'_imgs/');

/* «® PREDETERMINACION  ®» */
  header('Content-Type: text/html; charset=utf-8');
  date_default_timezone_set('America/Argentina/La_Rioja');
?>
