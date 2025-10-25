<?php
/**
 * Sistema de navegación DTIC Bitácoras
 * Genera navegación dinámica para todas las páginas
 */

// Incluir archivos necesarios
require_once 'auth_middleware.php';

/**
 * Generar navegación principal
 *
 * @param string $currentPage Página actual para resaltar
 * @return string HTML de la navegación
 */
function renderNavigation(string $currentPage = ''): string {
    $navItems = [
        [
            'id' => 'dashboard',
            'url' => '/dashboard',
            'icon' => 'fas fa-tachometer-alt',
            'text' => 'Dashboard',
            'active' => $currentPage === 'dashboard' || $currentPage === 'index'
        ],
        [
            'id' => 'tasks',
            'url' => '/tareas',
            'icon' => 'fas fa-tasks',
            'text' => 'Tareas',
            'active' => $currentPage === 'tareas'
        ],
        [
            'id' => 'resources',
            'url' => '/recursos',
            'icon' => 'fas fa-boxes',
            'text' => 'Recursos',
            'active' => $currentPage === 'recursos'
        ],
        [
            'id' => 'calendar',
            'url' => '/calendario',
            'icon' => 'fas fa-calendar-alt',
            'text' => 'Calendario',
            'active' => $currentPage === 'calendario'
        ],
        [
            'id' => 'technicians',
            'url' => '/tecnicos',
            'icon' => 'fas fa-user-cog',
            'text' => 'Técnicos',
            'active' => $currentPage === 'tecnicos'
        ],
        [
            'id' => 'users',
            'url' => '/usuarios',
            'icon' => 'fas fa-users',
            'text' => 'Usuarios',
            'active' => $currentPage === 'usuarios'
        ],
        [
            'id' => 'reports',
            'url' => '/reportes',
            'icon' => 'fas fa-chart-bar',
            'text' => 'Reportes',
            'active' => $currentPage === 'reportes'
        ]
    ];

    $navHtml = '<ul class="navbar-nav me-auto">';

    foreach ($navItems as $item) {
        $activeClass = $item['active'] ? ' active' : '';
        $navHtml .= "
            <li class='nav-item'>
                <a class='nav-link{$activeClass}' href='{$item['url']}' id='nav-{$item['id']}'>
                    <i class='{$item['icon']} me-1'></i>{$item['text']}
                </a>
            </li>
        ";
    }

    $navHtml .= '</ul>';

    return $navHtml;
}

/**
 * Generar navbar completo con navegación y usuario
 *
 * @param string $currentPage Página actual
 * @return string HTML completo del navbar
 */
function renderNavbar(string $currentPage = ''): string {
    $brandUrl = '/dashboard';
    $brandText = 'DTIC Bitácoras';

    $navbarHtml = "
        <nav class='navbar navbar-expand-lg navbar-dark'>
            <div class='container'>
                <a class='navbar-brand' href='{$brandUrl}'>
                    <i class='fas fa-clipboard-list me-2'></i>
                    {$brandText}
                </a>
                <button class='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav'>
                    <span class='navbar-toggler-icon'></span>
                </button>
                <div class='collapse navbar-collapse' id='navbarNav'>
                    " . renderNavigation($currentPage) . "
                    " . renderUserInfo() . "
                </div>
            </div>
        </nav>
    ";

    return $navbarHtml;
}

/**
 * Generar footer estándar
 *
 * @return string HTML del footer
 */
function renderFooter(): string {
    return "
        <footer class='footer mt-5'>
            <div class='container'>
                <div class='row'>
                    <div class='col-12'>
                        <p class='mb-0'>
                            <i class='fas fa-copyright me-1'></i>
                            2025 DTIC - Departamento de Tecnología de la Información y Comunicación |
                            <i class='fas fa-code me-1'></i>
                            Desarrollado con HTML, CSS, JavaScript y PHP
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    ";
}

/**
 * Generar head estándar con meta tags y CSS
 *
 * @param string $title Título de la página
 * @param string $description Descripción de la página
 * @return string HTML del head
 */
function renderHead(string $title = '', string $description = ''): string {
    $fullTitle = $title ? "DTIC Bitácoras - {$title}" : 'DTIC Bitácoras - Dashboard';
    $metaDescription = $description ?: 'Sistema de Gestión de Tareas y Recursos - Departamento de Tecnología de la Información y Comunicación';

    // Enviar headers HTTP para UTF-8
    header('Content-Type: text/html; charset=UTF-8');

    return "
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>{$fullTitle}</title>
            <meta name='description' content='{$metaDescription}'>

            <!-- Bootstrap 5 CSS -->
            <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet'>

            <!-- Font Awesome Icons -->
            <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' rel='stylesheet'>

            <!-- Custom CSS -->
            <link href='css/styles.css' rel='stylesheet'>
        </head>
    ";
}

/**
 * Generar estructura HTML básica de página
 *
 * @param string $currentPage Página actual
 * @param string $title Título de la página
 * @param string $content Contenido principal de la página
 * @param string $extraScripts Scripts adicionales
 * @return string HTML completo de la página
 */
function renderPage(string $currentPage, string $title, string $content, string $extraScripts = ''): string {
    $pageHtml = "
        <!DOCTYPE html>
        <html lang='es'>
        " . renderHead($title) . "
        <body>
            " . renderNavbar($currentPage) . "

            <div class='container mt-4'>
                {$content}
            </div>

            " . renderFooter() . "

            <!-- Bootstrap 5 JS -->
            <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'></script>

            <!-- Custom JavaScript -->
            <script src='js/dashboard.js'></script>

            {$extraScripts}

            " . renderLogoutScript() . "
        </body>
        </html>
    ";

    return $pageHtml;
}

/**
 * Obtener página actual desde la URL
 *
 * @return string Nombre de la página actual
 */
function getCurrentPage(): string {
    $currentFile = basename($_SERVER['PHP_SELF'], '.php');
    if ($currentFile === 'index') {
        $currentFile = 'dashboard';
    }
    return $currentFile;
}