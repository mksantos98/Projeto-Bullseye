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
    // Observador de usuários
    firebase.auth().onAuthStateChanged((userData) => {
        if (userData) {

            // Mostra nome do usuário no título
            $('#userName').html(userData.displayName);

            // Mostra perfil do usuário
            var uProfile = `
    <div class="card">
    
        <img class="card-image" src="${userData.photoURL}" alt="${userData.displayName}">
        <div class="card-content">
            <h4>${userData.email}</h4>
            <h2>${userData.displayName}</h2>
            <a class="btn btn-primary btn-block" href="https://account.google.com/" target="_blank"><i class="fab fa-google fa-fw"></i> Ver / Editar perfil</a>
            <a class="btn btn-danger btn-block" href="license"><i class="fas fa-sign-out-alt fa-fw"></i> Sair / Logout</a>
            <a href="license">teste</a>
        </div>
    
    </div>
            `;

            $('#userProfile').html(uProfile);

            // Se não tem usuário logado
        } else {

            // Carrega a home --> Ninguém quer isso
            // loadPage('home');

        }
    });

}