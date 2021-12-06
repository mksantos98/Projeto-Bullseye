/**
 * view/index.js
 * 
 * Created by André Luferat → http://www.luferat.net/
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 * 
 * Controller da página 'view'.
 */

// (*) Reload prevent
loadedScript['view'] = true;

// Armazenará o Id do artigo --> global
var articleId = '';

// Armazenará os dados do comentarista logado
var commentUser = {};

function runView() {

    // Título da página
    setTitle('Artigo completo');

    // Obtém o Id do artigo
    articleId = sanitizeString(location.search.replace('?', ''));

    // Observador de usuários
    firebase.auth().onAuthStateChanged((user) => {

        // Se um usuário está logado
        if (user) {

            // Armazena os dados do usuário logado
            commentUser = user;

            // Exibe a caixa de comentários
            $('#commentBox').html(`
<form id="commentForm" class="commentForm">
    <div id="commentFeedback" class="feedBack">Seu comentário foi enviado!</div>
    <textarea id="commentField"></textarea>
    <button type="submit" class="btn btn-primary btn-inline">Enviar <i class="fas fa-arrow-alt-circle-right fa-fw"></i></button>
</form>            
            `);

            // Detecta envio de um comentário
            $('#commentForm').submit(sendComment);

            // Se não tem usuário logado
        } else {

            // Exibe na view pedindo para logar
            $('#commentBox').html(`<blockquote>Logue-se para comentar. <a href="login" class="btn btn-primary btn-inline"><i class="fas fa-sign-in-alt fa-fw"></i> Entrar</a></blockquote>`);
        }
    });

    // Obtém o documento do artigo
    db.collection('articles').doc(articleId).get()

        // Se deu certo...       
        .then((doc) => {

            // Se o artigo existe
            if (doc.exists) {

                // Armazena documento em 'art'
                var art = doc.data();

                // Título da página
                setTitle(art.title);

                // Converte data para Br
                var brDate = getBrDate(art.date);

                var artView = `
<h2>${art.title}</h2>
<small class="author-date">Por ${art.author} em ${brDate}.</small>
<div class="content">${art.text}</div>
            `;

                // Lê todos os comentários do banco de dados para este artigo
                db.collection('comments') // Nome da coleção
                    .where('article', '==', articleId) // Somente para este artigo
                    .where('status', '==', 'ativo') // Somente com status ativo
                    .orderBy('date', 'desc') // Ordenado pela data mais recente
                    .onSnapshot((querySnapshot) => {

                        // Variável com view dos comentários
                        var comments = '';

                        // Se não encontrou comentários -> querySnapshot.empty = true
                        if (querySnapshot.empty)
                            $('#commentList').html(`<blockquote>Nenhum comentário ainda!</blockquote>`);

                        // Se encontrou comentários
                        else {

                            // Obtém cada comentário contido em 'querySnapshot' e armazena na variável 'doc'
                            querySnapshot.forEach((doc) => {

                                // Obtém os campos e valores do documento e armazena na variável 'commentData'
                                var commentData = doc.data();

                                // Obtém o id documento e armazena em 'article.id'
                                commentData.id = doc.id;

                                // Formata a data para pt-Br
                                commentDate = getBrDate(commentData.date);

                                // Monta a view dos comentários
                                comments += `
<div class="comment-item">
    <div class="comment-header">
        <div class="comment-image"><img src="${commentData.userPhoto}" alt="${commentData.userName}"></div>
        <div class="comment-about">Por ${commentData.userName} em ${commentDate}</div>
    </div>    
    <div class="comment-content">${commentData.comment}</div>
</div>
`;

                            });

                            // Exibe comentários
                            $('#commentList').html(comments);

                            // Limpa o campo de comentários
                            $('#commentField').val('');

                        } // else

                    });

                // Se o artigo não existe
            } else {
                artView += `
<h2>Ooops!</h2>
<p>Artigo não encontrado.</p>
`;
            }

            // Exibe na view
            $('#artView').html(artView);
        })

        // Se deu errado...
        .catch((error) => {
            console.erro("Ooops! Algo deu errado:", error);
        });

}

// Processa envio do comentário
function sendComment() {

    // Obtém e sanitiza os campos preenchidos
    var comment = {
        date: getSystemDate(),
        article: sanitizeString(articleId),
        userId: commentUser.uid,
        userName: commentUser.displayName,
        userEmail: commentUser.email,
        userPhoto: commentUser.photoURL,
        comment: sanitizeString($('#commentField').val()),
        status: 'ativo'
    }

    // Não envia o form se comentário está vazio
    if (comment.comment === '') return false;

    // Salva contato no banco de dados
    db.collection('comments').add(comment)

        // Deu certo
        .then((docId) => {

            // Exibe feedback
            $('#commentFeedback').slideDown('fast', () => {

                // Oculta feedback após algum tempo (3 segundos = 3000 milessegundos)
                setTimeout(() => {
                    $('#commentFeedback').slideUp('fast');
                }, 3000);
            });
        })

        // Deu errado
        .catch((error) => {
            console.error(`Ooops! Algo deu errado: ${error}`);
        });

    // Termina sem fazer mais nada
    return false;
}
