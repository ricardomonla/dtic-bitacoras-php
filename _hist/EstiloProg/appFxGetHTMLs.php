<?php  
function getGrupo($grupo='', $titulo='', $aulas=''){
    $grupo2 = $grupo . '_0';
    
    return <<<HTML
    <div class="card"> <!-- $titulo -->
        <div class="card-header" role="tab" id="headingOne">
            <a role="button" class="panel-title collapsed text-black" data-toggle="collapse" data-core="" href="#$grupo2" aria-expanded="false" aria-controls="$grupo">
                <h4 class="mbr-fonts-style display-5">
                    <span class="sign mbr-iconfont mbri-arrow-down inactive"></span>
                    $titulo
                  </h4>
              </a>
          </div>
        <div id="$grupo2" class="panel-collapse noScroll collapse " role="tabpanel" aria-labelledby="headingOne" data-parent="#bootstrap-accordion_0">
            <div class="panel-body p-4">
              $aulas
            </div>
          </div>
    </div>
HTML;
  }

function getGrupos(){
	global $bdAs;
	$hGrupos = '';

	foreach ($bdAs as $gGRUPO => $gAULAS) {
		$hAulas = '';
		list( $gNOM, $gCOD ) = explode(" | ", $gGRUPO);

		$hAulas = getAulas($gAULAS);

		$hGrupos .= getGrupo($gCOD, $gNOM, $hAulas);
	}
	return $hGrupos;
}

function getAulas($bdAs=''){
	$hAulas = '';
	foreach ($bdAs as $aID => $aDATS) {
		// Inicio variables.
			$aLNKs = [];
			# 'aID' => ['aNOM','aIDZ','aIDPL','aIDCAL']
			list($aNOM, $aIDZ, $aIDPL, $aIDCAL) = $aDATS;
		// Enlace AULA.
			if ( is_numeric($aIDZ) ) {
				$aURL = "https://zoom.us/j/$aIDZ";

				$imgSRC = '_imgs/logoZoom.png';
				$imgHTML = "<img src='$imgSRC' alt='Acceso Zoom' style='width:35px;'>";
				
				$aLNKs[] = "<a target='_blank' href='$aURL'>$aNOM</a>";
				$aLNKs[] = "<a target='_blank' href='$aURL'>$imgHTML</a>";
			
			} else 
				$aLNKs[] = "<a target='_blank' href='$aIDZ'>$aNOM</a>";
		// Enlace Play List YTB.
			if ( $aIDPL ) {
				$aURL = "https://www.youtube.com/playlist?list=$aIDPL";

				$imgSRC = '_imgs/logoYTB.png';
				$imgHTML = "<img src='$imgSRC' alt='Clases Grabadas' style='width:40px;'>";

				$aLNKs[] = "<a target='_blank' href='$aURL'>$imgHTML</a>";
			}
		// Enlace Google Calendar. 'htmlembed' : 'embed'
			if ( $aIDCAL ) {
				$aIDCAL = "$aIDCAL@group.calendar.google.com";
				$aURL = "https://calendar.google.com/calendar/embed?src=$aIDCAL&ctz=America%2FArgentina%2FLa_Rioja&mode=AGENDA";
				// $aURL = "https://calendar.google.com/calendar/u/0/r?cid=$aIDCAL&ctz=America%2FArgentina%2FLa_Rioja&mode=AGENDA";
				$icoD = date("j");
				// $icoD = date_format(date_create($strF), '.d.M.H:i');
				$imgSRC = '//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_'.$icoD.'_2x.png';
				// $imgSRC = '//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_'.$icoD.'_2x.png#';
				// $imgSRC = '_imgs/logoGoogleCAL.png';
				$imgHTML = "<img src='$imgSRC' alt='Calendario de Clases' style='width:40px;'>";

				$aLNKs[] = "<a target='_blank' href='$aURL'>$imgHTML</a>";
			}
		// Cargo HTML del Aula.
			$hLNKs = implode(" ", $aLNKs);
			$hAulas .= "<p class='align-center' mbr-fonts-style panel-text display-7'>$hLNKs</p>";
	}
	return $hAulas;
}

function getBody(){
  $appURL = APPPUB;
  $appVER = APPVER;
  $hCont  = getGrupos();
  
  return <<<HTML
	<body>
		<section class="accordion1 cid-rKzC2nyguD" id="accordion1-0">
		  <div class="container">
		      <div class="media-container-row">
		          <div class="col-12 col-md-8">
		              <div class="section-head text-center space30">
		                  <h2 class="mbr-section-title pb-5 mbr-fonts-style display-2"
		                  >Aulas Virtuales - UTNLaRioja</h2>
		                  <div class="align-right">
		                  	<a href='$appURL'>$appVER</a>
		                  	</div>
		              </div>
		              <div class="clearfix"></div>
		              <div id="bootstrap-accordion_0" class="panel-group accordionStyles accordion" role="tablist" aria-multiselectable="true">
		                  
		                  $hCont
		              
		              </div>
		            </div>
		        </div>
		    </div>
		  </section>
		<script src="assets/web/assets/jquery/jquery.min.js"></script>
		<script src="assets/popper/popper.min.js"></script>
		<script src="assets/bootstrap/js/bootstrap.min.js"></script>
		<script src="assets/tether/tether.min.js"></script>
		<script src="assets/smoothscroll/smooth-scroll.js"></script>
		<script src="assets/mbr-switch-arrow/mbr-switch-arrow.js"></script>
		<script src="assets/theme/js/script.js"></script>
	</body>
HTML;
}

function getHead(){
  return <<<HTML
	<head>
	  <meta charset="UTF-8">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
	  <link rel="shortcut icon" href="assets/images/dticAulaVirtual.png" type="image/x-icon">
	  <meta name="description" content="">
	  <meta http-equiv="Refresh" content="150"/>
	  
	  <title>Aulas Virtuales - UTNLaRioja</title>
	  <link rel="stylesheet" href="assets/web/assets/mobirise-icons/mobirise-icons.css">
	  <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
	  <link rel="stylesheet" href="assets/bootstrap/css/bootstrap-grid.min.css">
	  <link rel="stylesheet" href="assets/bootstrap/css/bootstrap-reboot.min.css">
	  <link rel="stylesheet" href="assets/tether/tether.min.css">
	  <link rel="stylesheet" href="assets/theme/css/style.css">
	  <link rel="preload" as="style" href="assets/mobirise/css/mbr-additional.css">
	  <link rel="stylesheet" href="assets/mobirise/css/mbr-additional.css" type="text/css">
	</head>
HTML;
}

function getPag(){
  
  $hHead = getHead(); 
  $hBody = getBody();

  return <<<HTML
	<!DOCTYPE html>
	<html>
		<head>
			$hHead
		</head>
		</body>
			$hBody
		</body>
	</html>
HTML;
}

?>