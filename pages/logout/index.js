/**
 * logout/index.js
 * 
 * Created by André Luferat → http://www.luferat.net/
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 * 
 * Controller da página 'logout'.
 */

// (*) Reload prevent
loadedScript['logout'] = true;

function runLogout() {

    // Título da página
    setTitle('Sair / Logout');

    // Detecta se usuário está logado
    firebase.auth().onAuthStateChanged(isLogged);

    // Confirma logout
    $('#forceLogout').click(logout);

}

// Detecta se usuário está logado
function isLogged(user) {
    if (user) {

        // Mostra nome do usuário no título
        $('#userName').html(user.displayName);

        // Mostra perfil do usuário
        var uProfile = `

<p>Se você sair do aplicativo não terá acesso ao conteúdo exclusivo até que se logue novamente.</p>
<p>Tem certeza que deseja sair?</p>
<a class="btn btn-primary btn-400" href="home"><i class="fas fa-home fa-fw"></i> Página inicial</a>
<a class="btn btn-warning btn-400" href="forcelogout"><i class="fas fa-sign-out-alt fa-fw"></i> Sair / Logout</a>

        `;

        $('#userProfile').html(uProfile);

        // Se não tem usuário logado
    } else {

        // Carrega a home --> Ninguém quer isso
        loadPage('home');

    }
}

