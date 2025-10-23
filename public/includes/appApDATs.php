<?php
/* «® VERSIONADO  ®» */
  $logVERs = ' =>
    1.0.0 => MAIN: Inicio del sistema DTIC Bitácoras autogenerativo.
    1.0.0 => MAIN: Adaptación del estilo de programación autogenerativo.
    ';

/* «® CONSTANTES  ®» */
  define('APPVER', 'v1.0.0');
  define('APPAUT', '«®» Lic. Ricardo MONLA <rmonla@gmail.com> «®»');
  define('APPDEV', 'https://github.com/rmonla/dtic-bitacoras-php');

  define('APPNOM', 'dtcBitacoras');
  define('APPDET', '

    «®» Sistema de Bitácoras DTIC autogenerativo. «®»
    El objetivo principal es el de gestionar tareas, recursos y técnicos del DTIC
    mediante una interfaz web segura con generación automática de contenido.

    ');

  define('APPSITIO', 'http://localhost:8080/');
  define('APPIMGS', APPSITIO.'_imgs/');

/* «® PREDETERMINACION  ®» */
  header('Content-Type: text/html; charset=utf-8');
  date_default_timezone_set('America/Argentina/La_Rioja');
?>