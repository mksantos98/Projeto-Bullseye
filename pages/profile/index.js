/**
 * profile/index.js
 * 
 * Created by André Luferat → http://www.luferat.net/
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 * 
 * Controller da página 'profile'.
 */

// (*) Reload prevent
loadedScript['profile'] = true;

function runProfile() {

    // Título da página
    setTitle('Seu perfil');

    // Detecta se usuário está logado
    firebase.auth().onAuthStateChanged(isLogged);

}

// Detecta se usuário está logado
function isLogged(user) {
    if (user) {

        // Mostra nome do usuário no título
        $('#userName').html(user.displayName);

        // Mostra perfil do usuário
        var uProfile = `
<div class="card">

    <img class="card-image" src="${user.photoURL}" alt="${user.displayName}">
    <div class="card-content">
        <h4>${user.email}</h4>
        <h3>${user.displayName}</h3>
        <p>Seu perfil é gerenciado pelo Google. Não armazenamos nenhuma informação pessoal sobre você.</p>
        Para ver/editar seu perfil, clique no botão abaixo:
        <a class="btn btn-primary btn-block" href="https://account.google.com/" target="_blank"><i class="fab fa-google fa-fw"></i> Ver / Editar perfil</a>
        Para sair do aplicativo, clique no botão abaixo:
        <a class="btn btn-warning btn-block" href="logout"><i class="fas fa-sign-out-alt fa-fw"></i> Sair / Logout</a>
    </div>

</div>
        `;

        $('#userProfile').html(uProfile);

        // Se não tem usuário logado
    } else {

        // Carrega a home --> Ninguém quer isso
        loadPage('home');

    }
}