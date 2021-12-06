/**
 * global.js
 * 
 * Created by André Luferat → http://www.luferat.net/
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 * 
 * Aplicativo principal.
 */

// Setup inicial do aplicativo
var app = {
    name: 'Bullseye',                       // Nome do site
    slogan: 'No alvo da sua carreira!',     // Slogan do site
    sep: '~'                                // Separador do título
}

// (*) Evita reload dos scripts
var loadedScript = {};

/* Inicializa jQuery */
$(document).ready(runApp);

// Aplicativo principal - Tratamento de eventos
function runApp() {

    // Oculta splash screen após alguns segundos
    // setTimeout(() => {
    //     $('#splashScreen').fadeOut('fast');
    // }, 1000);

    // Página inicial
    loadPage('home');

    // Monitora cliques nas tags <a> do documento
    $(document).on('click', 'a', routerLink);

    // Observador de usuários
    firebase.auth().onAuthStateChanged((user) => {

        // Aponta para link de autenticação no menu
        var appUser = $('#appUser');

        // Se um usuário está logado
        if (user) {

            // Exibe a imagem do usuário no menu
            appUser.html(`<img src="${user.photoURL}" alt="${user.displayName}"><span>Perfil</span>`);

            // Troca a função do botão login para profile
            appUser.attr('href', 'profile');

            // Se não tem usuário logado
        } else {

            // Remove a imagem do usuário no menu
            appUser.html(`<img src="assets/user.png" alt="Logue-se"><span>Entrar</span>`);

            // Troca a função do botão profile para login
            appUser.attr('href', 'login');
        }

        // Oculta splash screen quando autenticação ocorrer
        setTimeout(() => {
            $('#splashScreen').fadeOut('fast');
        }, 500);

    });

}

// Processa cliques nas tags <a> do documento
function routerLink() {

    // Obtém atributo 'href' do link clicado
    var href = $(this).attr('href');

    // Obtém atributo 'target' do link clicado
    // Se não tem 'target' fica 'undefined'
    var target = $(this).attr('target');

    // Se 'href' está vazio ou não existe (undefined), não faz nada
    if (!href || href === '') return false;

    // Trata os tipos de link
    if (
        href.substr(0, 7) === 'http://' ||  // Se é um link externo 'http' ou
        href.substr(0, 8) === 'https://' || // Se é um link externo 'https' ou
        target === '_blank' ||              // Se o 'target' é '_blank' ou
        href.substr(0, 1) === '#'           // Se é uma âncora
    ) return true;                          // Retorna o controla para o HTML

    // Se é login
    if (href == 'login') {
        login();
        return false;
    }

    // Se é logout
    if (href == 'forcelogout') {
        logout();
        return false;
    }

    // Se é uma rota, chama a função 'loadPage', passando a rota
    loadPage(href);

    // Conclui sem fazer nada
    return false;
}

// Carrega página à partir da rota
function loadPage(pagePath) {

    // Dividir a rota em partes para obter variáveis
    var route = pagePath.split('?');

    // Objeto '{}' com caminhos da página
    var page = {
        css: `pages/${route[0]}/index.css`,     // Caminho para CSS da página
        html: `pages/${route[0]}/index.html`,   // Caminho para HTMl da página
        js: `pages/${route[0]}/index.js`,        // Caminho para JavaScript da página
    };

    // (*) Carrega JavaScript da página se ele não existe
    if (!loadedScript[route[0]]) {
        $.getScript(page.js, () => {

            // Carrega CSS
            $('#pageCSS').load(page.css, () => {

                // Carrega o HTML em <div id="pageHTML"></div> logo após o CSS
                $('#pageHTML').load(page.html);
            });
        });

        // Se Javascript da página existe carrega somente HTML e CSS da página
    } else {
        // Carrega CSS da página em <style id="pageCSS"></style>
        $('#pageCSS').load(page.css, () => {

            // Carrega o HTML em <div id="pageHTML"></div> logo após o CSS
            $('#pageHTML').load(page.html);
        });
    }

    // Atualiza endereço da página
    window.history.replaceState('', '', pagePath);

    return false;
}

// Processa o título da página. Tag <title>...</title>
function setTitle(pageTitle = '') {

    // Variável que armazena o título
    var title;

    // Se não definiu o título, usa o formato abaixo
    if (pageTitle == '') title = `${app.name} ${app.sep} ${app.slogan}`;

    // Se definiu o título, usa o formato abaixo
    else title = `${app.name} ${app.sep} ${pageTitle}`;

    // Reescreve a tag <title>
    $('title').text(title);

}

// Sanitiza campos de formulário
function sanitizeString(stringValue, stripTags = true) {

    // Remove todas as tags HTML
    if (stripTags) stringValue = stringValue.replace(/<[^>]*>?/gm, "");

    // Quebras de linha viram <br>
    stringValue = stringValue.replace(/\n/g, "<br />").trim();

    // Remove espaços antes e depois
    return stringValue.trim();
}

// Gera a data atual em formato system date "YYYY-MM-DD HH:II:SS"
function getSystemDate() {
    var yourDate = new Date(); // Obtém a data atual do navegador
    var offset = yourDate.getTimezoneOffset(); // Obtém o fusohorário
    yourDate = new Date(yourDate.getTime() - offset * 60 * 1000); // Ajusta o fusohorário
    returnDate = yourDate.toISOString().split("T"); // Separa data da hora
    returnTime = returnDate[1].split("."); // Separa partes da data
    return `${returnDate[0]} ${returnTime[0]}`; // Formata data como system date
}

// Formata uma 'system date' (YYYY-MM-DD HH:II:SS) para 'Br date' (DD/MM/YYYY HH:II:SS)
function getBrDate(dateString, separator = ' às ') {
    var p1 = dateString.split(" "); // Separa data e hora
    var p2 = p1[0].split("-"); // Separa partes da data
    return `${p2[2]}/${p2[1]}/${p2[0]}${separator}${p1[1]}`; // Remonta partes da data e hora
}

// Login de usuários
function login() {

    // Define o provedor de autenticação --> Google
    var provider = new firebase.auth.GoogleAuthProvider();

    // Inicia processo de autenticação
    firebase.auth()
        .signInWithPopup(provider)

        // Se der certo
        // .then()

        // Se der errado
        .catch((error) => {

            // Exibe mensagem de erro no console
            console.error(`Oooops! Algo deu errado: ${error}`);
        });

}

// Logout de usuários
function logout() {
    firebase.auth().signOut()
        .then(() => {
            loadPage('home');
        })
        .catch((error) => {

            // Exibe mensagem de erro no console
            console.error(`Oooops! Algo deu errado: ${error}`);
        });
    return false;
}
