const root = document.getElementById('root');
const static = document.getElementById('static');
const articleButton = document.getElementById('add-article-button');
let modalAlert = document.getElementById('modal-alert');
let modalSuccess = document.getElementById('modal-success');
let articleId = null;

// initializing index page variables
let numberOfArticles = 4;
let indexStart = 0;
let indexEnd = numberOfArticles - 1;
let totalNumberOfArticles = 0;

// UPDATE INDEXES OF ARTICLES
function updateStartEndIndexes(button) {
    if (button === 'next') {
        indexStart = indexStart + numberOfArticles;
        indexEnd = indexEnd + numberOfArticles;
    }

    if (button === 'previous') {
        indexStart = indexStart - numberOfArticles;
        indexEnd = indexEnd - numberOfArticles;
    }
}

// UPDATE NEXT AND PREV BUTTONS ON INDEX PAGE
function updatePrevAndNextButtons() {
    let prevBtn = document.getElementById('button-prev');
    let nextBtn = document.getElementById('button-next');

    if (indexStart === 0) {
        prevBtn.style.display = 'none';
        document.querySelector('footer').classList.add('next-button-class');
    } else {
        prevBtn.style.display = 'block';
    }

    if (indexEnd >= totalNumberOfArticles - 1) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
    }
}

// CREATE ALERT ON SUCCESSFULLY CREATING NEW ARTICLE
let alertNewArticle = document.createElement('div');
alertNewArticle.setAttribute('class', 'alert alert-success');
alertNewArticle.setAttribute('role', 'alert');
alertNewArticle.textContent = 'The article has been created!';
static.appendChild(alertNewArticle);

// HIDE ALERT SUCCESS FUNCTION
function hideAlertSuccess() {
    let alert = document.querySelector('.alert-success');
    alert.style.display = 'block';
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

// CREATE THE DARK THEME BUTTON
function createThemeButton() {
    let themeBox = document.createElement('div');
    themeBox.setAttribute('class', 'theme-switch-box');

    let themeLabel = document.createElement('label');
    themeLabel.setAttribute('class', 'theme-switch');
    themeLabel.setAttribute('for', 'switch');

    let themeInput = document.createElement('input');
    themeInput.setAttribute('type', 'checkbox');
    themeInput.setAttribute('id', 'switch');

    let themeIcons = document.createElement('div');
    themeIcons.setAttribute('class', 'icons');

    let themeMoon = document.createElement('div');
    themeMoon.setAttribute('class', 'far fa-moon round');
    let themeSun = document.createElement('div');
    themeSun.setAttribute('class', 'fas fa-sun round');

    static.appendChild(themeBox);
    themeBox.appendChild(themeLabel);
    themeLabel.appendChild(themeInput);
    themeLabel.appendChild(themeIcons);
    themeIcons.appendChild(themeMoon);
    themeIcons.appendChild(themeSun);
}

createThemeButton();

// CREATING NAV BAR
const nav = ['Home', 'Reviews', 'About', 'Contact'];

function createNav(nav) {
    const navBar = document.createElement('nav');
    navBar.setAttribute('class', 'nav');

    const ul = document.createElement('ul');
    ul.setAttribute('class', 'nav__container');
    navBar.appendChild(ul);

    nav.forEach(element => {
        const li = document.createElement('li');
        li.setAttribute('class', 'nav__item');
        const anchor = document.createElement('a');
        anchor.setAttribute('href', '#');
        anchor.setAttribute('class', 'nav__link');
        anchor.textContent = element;
        if (element === 'Home') {
            anchor.setAttribute('href', '')
        }

        ul.appendChild(li);
        li.appendChild(anchor);

    })
    static.appendChild(navBar);
}

// INITIALIZING NAV BAR
function appInit() {
    createNav(nav);
}

appInit();

// CREATING THE ADD BUTTON
function createAddButton() {
    const div = document.createElement('div');
    div.setAttribute('class', 'add__container');
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'button open-modal fas fa-plus');
    button.textContent = ' Add Article';
    button.addEventListener('click', function() {
        openModal();
        document.querySelector('.button--pink').style.display = 'block';
        document.querySelector('.button-edit-modal').style.display = 'none';
    })
    div.appendChild(button);

    articleButton.appendChild(div);
}


// TAKING DATA FROM SERVER
function getArticleList() {
    fetch(`http://localhost:3007/articles?indexStart=${indexStart}&indexEnd=${indexEnd}`)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                response.json()
                    .then(data => {
                        clearRoot();
                        createDomArticleList(data.articlesList);
                        totalNumberOfArticles = data.numberOfArticles;
                        updatePrevAndNextButtons();
                        closeDomSpinner();
                    });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
}

// CREATE ALL ARTICLES FROM MAIN PAGE 
function createArticle(articles) {
    const domArticle = document.createElement('article');

    articles.forEach(element => {
        const articleDiv = document.createElement('div');
        articleDiv.setAttribute('id', 'article' + element.id);
        const domTitle = document.createElement('h2');
        domTitle.textContent = element.title;
        domTitle.setAttribute('class', 'title');

        const domUl = document.createElement('ul');
        domUl.setAttribute('class', 'info__container');

        const domTag = document.createElement('li');
        domTag.setAttribute('class', 'info__item');
        domTag.textContent = element.tag;

        const domAuthor = document.createElement('li');
        domAuthor.setAttribute('class', 'info__item');
        domAuthor.textContent = 'Added by ';

        const domSpan = document.createElement('span');
        domSpan.setAttribute('class', 'info__mark point');
        domSpan.textContent = element.author;
        const domDate = document.createElement('li');
        domDate.setAttribute('class', 'info__item');
        domDate.textContent = element.date;

        domUl.appendChild(domTag);
        domUl.appendChild(domAuthor);
        domAuthor.appendChild(domSpan);
        domUl.appendChild(domDate);

        const domImg = document.createElement('img');
        domImg.setAttribute('src', element.imgUrl);
        domImg.setAttribute('alt', element.imgAlt);

        const domActionDiv = document.createElement('div');
        domActionDiv.setAttribute('class', 'actions__container');

        const editButton = document.createElement('button');
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('class', 'actions__btn border');
        editButton.setAttribute('id', element.id);
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function() {
            openModal();
            editArticle(element);
            document.querySelector('.button-edit-modal').style.display = 'block';
            document.querySelector('.button--pink').style.display = 'none';
        })

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('class', 'actions__btn');
        deleteButton.setAttribute('id', element.id);
        deleteButton.textContent = 'Delete';


        deleteButton.addEventListener('click', () => {
            articleId = element.id;
            openModalAlert();
        });

        domActionDiv.appendChild(editButton);
        domActionDiv.appendChild(deleteButton);

        const paragraph = document.createElement('p');
        let text = element.content;
        let spliced = text.substring(0, text.length / 2);
        if (text.charAt(spliced.length - 1) === '!' || text.charAt(spliced.length - 1) === '.' || text.charAt(spliced.length - 1) === '?') {
            paragraph.textContent = text.substring(0, text.length / 2) + ' ...';
        } else {
            paragraph.textContent = text.substring(0, spliced.lastIndexOf('.') + 1) + ' ...'
        }

        const domContainer = document.createElement('div');
        domContainer.setAttribute('class', 'content__container');
        domContainer.appendChild(paragraph);

        const readMoreDiv = document.createElement('div');
        readMoreDiv.setAttribute('class', 'readmore__container');

        const readMoreAnchor = document.createElement('a');
        readMoreAnchor.setAttribute('class', 'btn-details');
        readMoreAnchor.setAttribute('href', '#/article/' + element.id);

        const readMoreButton = document.createElement('button');
        readMoreButton.setAttribute('type', 'button');
        readMoreButton.setAttribute('class', 'button button-details');
        readMoreAnchor.setAttribute('href', '#/article/' + element.id);
        readMoreButton.textContent = 'Read More';
        readMoreButton.addEventListener('click', function() {
            location.hash = '#/article/' + element.id;
        })

        readMoreDiv.appendChild(readMoreAnchor);
        readMoreAnchor.appendChild(readMoreButton);

        domArticle.appendChild(articleDiv);
        articleDiv.appendChild(domTitle);
        articleDiv.appendChild(domUl);
        articleDiv.appendChild(domActionDiv);
        articleDiv.appendChild(domImg);
        articleDiv.appendChild(domContainer);
        articleDiv.appendChild(readMoreDiv);
    });
    return domArticle;
}

// RENDERING ALL ARTICLES FROM MAIN PAGE + FOOTER
function createDomArticleList(articles) {
    clearRoot();
    const domArticle = createArticle(articles);
    root.appendChild(domArticle);
    createArticle(articles);
    createFooter();
}

// CREATE FOOTER FROM MAIN PAGE
function createFooter() {
    const footer = document.createElement('footer');
    footer.setAttribute('class', 'footer');
    const previousButton = document.createElement('button');

    previousButton.setAttribute('class', 'footer__link footer__link--previous');
    previousButton.setAttribute('id', 'button-prev')
    previousButton.textContent = 'previous';

    previousButton.addEventListener('click', function() {
        updateStartEndIndexes('previous');
        getArticleList();
    });

    const nextButton = document.createElement('button');
    nextButton.setAttribute('id', 'button-next');
    nextButton.setAttribute('class', 'footer__link footer__link--next');
    nextButton.textContent = 'next';

    nextButton.addEventListener('click', () => {
        updateStartEndIndexes('next');
        getArticleList();
    });

    footer.appendChild(previousButton);
    footer.appendChild(nextButton);

    root.appendChild(footer);
}


// CREATE FOOTER FROM DETAILS PAGE
function detailsFooter(prevId, nextId) {

    const footer = document.createElement('footer');
    footer.setAttribute('class', 'footer-details');

    if (prevId) {
        let prevBtn = document.createElement('button');
        prevBtn.setAttribute('class', 'footer__link');
        prevBtn.textContent = 'previous article';

        prevBtn.addEventListener('click', function() {
            location.hash = `#/article/${prevId}`;
        })
        footer.appendChild(prevBtn);
    }
    if (nextId) {
        let prevDiv = document.createElement('div');
        let nextBtn = document.createElement('button');
        nextBtn.setAttribute('class', 'footer__link footer__link--next');
        nextBtn.textContent = 'next article';

        nextBtn.addEventListener('click', function() {
            location.hash = `#/article/${nextId}`;
        })
        footer.appendChild(prevDiv);
        footer.appendChild(nextBtn);
    }
    return footer;
}

function createDetailsArticle(article) {
    const domArticle = document.createElement('article');

    const divArticle = document.createElement('div');
    divArticle.setAttribute('id', 'article' + article.id);
    divArticle.setAttribute('class', 'article');
    domArticle.appendChild(divArticle);
    const domTitle = document.createElement('h2');
    domTitle.textContent = article.title;
    domTitle.setAttribute('class', 'title');

    const domUl = document.createElement('ul');
    domUl.setAttribute('class', 'info__container');

    const domTag = document.createElement('li');
    domTag.setAttribute('class', 'info__item');
    domTag.textContent = article.tag;

    const domAuthor = document.createElement('li');
    domAuthor.setAttribute('class', 'info__item');
    domAuthor.textContent = 'Added by ';

    const domSpan = document.createElement('span');
    domSpan.setAttribute('class', 'info__mark point');
    domSpan.textContent = article.author;

    const domDate = document.createElement('li');
    domDate.setAttribute('class', 'info__item');
    domDate.textContent = article.date;

    domUl.appendChild(domTag);
    domUl.appendChild(domAuthor);
    domAuthor.appendChild(domSpan);
    domUl.appendChild(domDate);

    const contentContainer = document.createElement('div');
    contentContainer.setAttribute('class', 'content__container');

    const domImg = document.createElement('img');
    domImg.setAttribute('src', article.imgUrl);
    domImg.setAttribute('alt', article.imgAlt);

    divArticle.appendChild(domTitle);
    divArticle.appendChild(domUl);
    divArticle.appendChild(domImg);
    divArticle.appendChild(contentContainer);

    const firstParagraph = document.createElement('p');
    let text = article.content;
    let spliced = text.substring(0, text.length / 2);
    if (text.charAt(spliced.length - 1) === '!' || text.charAt(spliced.length - 1) === '.' || text.charAt(spliced.length - 1) === '?') {
        firstParagraph.textContent = text.substring(0, text.length / 2);
    } else {
        firstParagraph.textContent = text.substring(0, spliced.lastIndexOf('.') + 1);
    }

    const secondParagraph = document.createElement('p');
    secondParagraph.textContent = text.substring(spliced.lastIndexOf('.') + 1);

    const saying = document.createElement('p');
    saying.setAttribute('class', 'saying');
    saying.textContent = article.saying;

    contentContainer.appendChild(firstParagraph);
    contentContainer.appendChild(saying);
    contentContainer.appendChild(secondParagraph);

    return domArticle;
}

// CREATING ONE DETAILED ARTICLE
function getArticleDetails() {
    let currLocation = window.location.hash;

    if (currLocation.startsWith('#/article')) {
        const articleId = location.hash.substring(10);

        if (articleId) {
            fetch(`http://localhost:3007/articles/${articleId}`)
                .then(
                    function(response) {
                        response.json().then(function(data) {
                            if (data.status !== 404) {
                                clearRoot();
                                clearArticleButton();

                                let main = document.createElement('main');
                                main.setAttribute('class', 'main-details');
                                const articleRendering = createDetailsArticle(data);
                                main.appendChild(articleRendering);

                                const footerRendering = detailsFooter(data.prevId, data.nextId);
                                main.appendChild(footerRendering);

                                root.appendChild(main);
                                closeDomSpinner();
                            } else {
                                location.hash = 'not-found';
                            }
                        })

                    })
                .catch(function(err) {
                    console.log('Fetch Error :-S', err);
                });
        }
    }
}

// CREATE MODAL
let modal = document.getElementById('modal-box');

function createModal() {
    const modalDiv = document.createElement('div');
    modalDiv.setAttribute('class', 'add-modal');

    const modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modal__content');

    const modalTitle = document.createElement('h2');
    modalTitle.setAttribute('class', 'title modal-title');
    modalTitle.textContent = 'Add/Edit article';

    const inputsContainer = document.createElement('div');
    inputsContainer.setAttribute('class', 'inputs__container');

    const errorMessage = document.createElement('div');
    errorMessage.setAttribute('id', 'error-modal');

    const title = document.createElement('input');
    title.setAttribute('type', 'text');
    title.setAttribute('class', 'input margin');
    title.setAttribute('id', 'title')
    title.setAttribute('placeholder', 'Please enter title');

    const invalidTitle = document.createElement("p");
    invalidTitle.setAttribute("id", "invalid-title");
    invalidTitle.setAttribute("class", "invalid-feedback");
    invalidTitle.textContent = "Title should contain only letters";
    title.appendChild(invalidTitle);

    const tag = document.createElement('input');
    tag.setAttribute('type', 'text');
    tag.setAttribute('class', 'input');
    tag.setAttribute('id', 'tag')
    tag.setAttribute('placeholder', 'Please enter tag');

    const author = document.createElement('input');
    author.setAttribute('type', 'text');
    author.setAttribute('class', 'input margin');
    author.setAttribute('id', 'author')
    author.setAttribute('placeholder', 'Please enter author');

    const date = document.createElement('input');
    const today = new Date();
    date.setAttribute('type', 'text');
    date.setAttribute('class', 'input');
    date.setAttribute('id', 'date')
    date.setAttribute('placeholder', `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`);

    date.disabled = true;

    const image = document.createElement('input');
    image.setAttribute('type', 'text');
    image.setAttribute('class', 'input margin');
    image.setAttribute('id', 'url')
    image.setAttribute('placeholder', 'Please enter image url');

    const saying = document.createElement('input');
    saying.setAttribute('type', 'text');
    saying.setAttribute('class', 'input');
    saying.setAttribute('id', 'saying')
    saying.setAttribute('placeholder', 'Please enter saying');

    const textarea = document.createElement('textarea');
    textarea.setAttribute('class', 'textarea');
    textarea.setAttribute('id', 'textarea')
    textarea.setAttribute('name', 'content');
    textarea.setAttribute('cols', '28');
    textarea.setAttribute('rows', '7');
    textarea.setAttribute('placeholder', 'Please enter content');

    const modalButtonsDiv = document.createElement('div');
    modalButtonsDiv.setAttribute('class', 'modal__buttons');

    const closeModalButton = document.createElement('button');
    closeModalButton.setAttribute('type', 'button');
    closeModalButton.setAttribute('class', 'button close-modal');
    closeModalButton.textContent = 'Cancel';

    const saveModalButton = document.createElement('button');
    saveModalButton.setAttribute('type', 'button');
    saveModalButton.setAttribute('class', 'button button--pink');
    saveModalButton.textContent = 'Save';
    saveModalButton.addEventListener('click', function() {

        let isValid = validateModal();
        if (isValid) {
            hideAlertSuccess();
            createNewArticle();
            errorMessage.innerHTML = '';
        }
    })

    const editModalButton = document.createElement('button');
    editModalButton.setAttribute('type', 'button');
    editModalButton.setAttribute('class', 'button button-edit-modal');
    editModalButton.textContent = 'Edit';

    modalDiv.appendChild(modalContent);
    modalDiv.appendChild(errorMessage);

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(inputsContainer);

    inputsContainer.appendChild(title);
    inputsContainer.appendChild(tag);
    inputsContainer.appendChild(author);
    inputsContainer.appendChild(date);
    inputsContainer.appendChild(image);
    inputsContainer.appendChild(saying);
    modalContent.appendChild(textarea);
    modalContent.appendChild(modalButtonsDiv);
    modalButtonsDiv.appendChild(closeModalButton);
    modalButtonsDiv.appendChild(saveModalButton);
    modalButtonsDiv.appendChild(editModalButton);

    modal.appendChild(modalDiv);
}

createModal();

// CREATE MODAL ALERT
function createModalAlert() {
    const divAlert = document.createElement('div');
    divAlert.setAttribute('id', 'div-modal-alert');
    divAlert.setAttribute('class', 'delete-modal-alert');

    const formAlert = document.createElement('div');
    formAlert.setAttribute('class', 'modal-content');

    const divAlertContainer = document.createElement('div');
    divAlertContainer.setAttribute('class', 'alert-container');

    const titleAlert = document.createElement('h1');
    titleAlert.setAttribute('class', 'alert-title')
    titleAlert.textContent = 'Delete Article';

    const paragraphAlert = document.createElement('p');
    paragraphAlert.setAttribute('class', 'alert-delete-p')
    paragraphAlert.textContent = 'Are you sure you want to delete this article?';

    const divClearFix = document.createElement('div');
    divClearFix.setAttribute('class', 'clearfix');

    const cancelAlertBtn = document.createElement('button');
    cancelAlertBtn.setAttribute('type', 'button');
    cancelAlertBtn.setAttribute('class', 'button cancel-alert-button');
    cancelAlertBtn.textContent = 'Cancel';
    cancelAlertBtn.addEventListener('click', hideModalAlert);

    const deleteAlertBtn = document.createElement('button');
    deleteAlertBtn.setAttribute('type', 'button');
    deleteAlertBtn.setAttribute('class', 'delete-alert-button');
    deleteAlertBtn.textContent = 'Delete';

    divAlert.appendChild(formAlert);
    formAlert.appendChild(divAlertContainer);
    divAlertContainer.appendChild(titleAlert);
    divAlertContainer.appendChild(paragraphAlert);
    divAlertContainer.appendChild(divClearFix);
    divClearFix.appendChild(cancelAlertBtn);
    divClearFix.appendChild(deleteAlertBtn);

    modalAlert.appendChild(divAlert);
}

createModalAlert();

// CLEAR THE CONTENT
function clearRoot() {
    root.innerHTML = '';
    window.scrollTo(0, 0);
}

function clearStatic() {
    static.innerHTML = '';
}

function clearArticleButton() {
    articleButton.innerHTML = '';
}

function renderArticleListPage() {
    displayDomSpinner();
    createAddButton();
    getArticleList();
}

function displayDomSpinner() {
    document.getElementById('loader').style.display = 'block';
}

function closeDomSpinner() {
    document.getElementById('loader').style.display = 'none';
}

function clearForm() {
    let title = document.getElementById('title');
    let tag = document.getElementById('tag');
    let author = document.getElementById('author');
    let date = document.getElementById('date');
    let imgUrl = document.getElementById('url');
    let saying = document.getElementById('saying');
    let textarea = document.getElementById('textarea');

    title.value = '';
    tag.value = '';
    author.value = '';
    date.value = '';
    imgUrl.value = '';
    saying.value = '';
    textarea.value = '';
}

// GETTING THE ELEMENTS TO CLOSE THE MODAL
let modalOverlay = document.querySelector('.modal__overlay');
let closeModal = document.querySelector('.close-modal')

// OPEN MODAL FUNCTION, called directly in the function that creates the ADD BUTTON
function openModal() {
    modalOverlay.style.visibility = 'visible';
    modalOverlay.style.opacity = 1;
}

// CLOSING THE MODAL
function hideModal() {
    let error = document.getElementById('error-modal');

    modalOverlay.style.visibility = 'hidden';
    modalOverlay.style.opacity = 0;
    error.innerHTML = '';
    clearForm();
}

closeModal.addEventListener('click', hideModal);

// GETTING THE ELEMENTS TO CLOSE THE MODAL ALERT
let modalOverlayAlert = document.querySelector('.modal__overlay__alert');
let closeModalAlert = document.querySelector('.cancel-alert-button');

// OPEN MODAL ALERT FUNCTION, called directly in the function that creates the ADD BUTTON
function openModalAlert() {
    document.getElementById('div-modal-alert').style.display = 'block';
    modalOverlayAlert.style.visibility = 'visible';
    modalOverlayAlert.style.opacity = 1;
}

// add event listener for the delete button from modal
let btnDeleteAlert = document.querySelector('.delete-alert-button');
btnDeleteAlert.addEventListener('click', (e) => {
    deleteArticle(articleId);
    hideModalAlert();
    e.stopPropagation();
})

// CLOSING THE MODAL ALERT
closeModalAlert.addEventListener('click', function(e) {
    hideModalAlert();
});

function hideModalAlert() {
    modalOverlayAlert.style.visibility = 'hidden';
    modalOverlayAlert.style.opacity = 0;
}

// DELETING ARTICLE DEPENDING ON THE ID, function called directly where the delete button is created (createArticle)
function deleteArticle() {
    if (!articleId) {
        return;
    }
    fetch('http://localhost:3007/articles/' + articleId, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            articleId = null;
            if (totalNumberOfArticles % numberOfArticles === 1) {
                indexStart = indexStart - numberOfArticles;
                indexEnd = indexEnd - numberOfArticles;
            }
            getArticleList();

        })
        .catch((error) => {
            articleId = null;
            console.error('Error:', error);
        });
}

// CREATING NEW ARTICLE, UPDATING THE ARTICLE LIST
function createNewArticle() {
    let title = document.getElementById('title').value;
    let tag = document.getElementById('tag').value;
    let author = document.getElementById('author').value;
    let imgUrl = document.getElementById('url').value;
    let saying = document.getElementById('saying').value;
    let textarea = document.getElementById('textarea').value;
    let today = new Date();

    fetch('http://localhost:3007/articles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'title': title,
            'imgUrl': imgUrl,
            'imgAlt': 'photo',
            'content': textarea,
            'tag': tag,
            'author': author,
            'date': `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`,
            'saying': saying,
        })

    }).then(res => res.json())

    .then(data => {
        hideModal();
        clearForm();
        getArticleList();
    })

    .catch((err) => console.log(err));
}

// EDIT ARTICLE FUNCTION
function editArticle(article) {
    let title = document.getElementById('title');
    let tag = document.getElementById('tag');
    let author = document.getElementById('author');
    let date = document.getElementById('date');
    let url = document.getElementById('url');
    let saying = document.getElementById('saying');
    let textarea = document.getElementById('textarea');

    title.value = article.title;
    tag.value = article.tag;
    author.value = article.author;
    date.value = article.date;
    url.value = article.imgUrl;
    saying.value = article.saying;
    textarea.value = article.content;

    let saveModalButton = document.querySelector('.button-edit-modal');
    saveModalButton.addEventListener('click', function() {
        let isValid = validateModal();

        if (isValid) {
            updateArticle(article.id);
        }
    })
}

// EDITING ARTICLE
function updateArticle(id) {
    let title = document.getElementById('title').value;
    let tag = document.getElementById('tag').value;
    let author = document.getElementById('author').value;
    let date = document.getElementById('date').value;
    let imgUrl = document.getElementById('url').value;
    let saying = document.getElementById('saying').value;
    let textarea = document.getElementById('textarea').value;

    const putObject = {
        title: title,
        tag: tag,
        author: author,
        date: date,
        imgUrl: imgUrl,
        saying: saying,
        content: textarea,
    }
    fetch('http://localhost:3007/articles/' + id, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(putObject),
        })
        .then(response => response.json())
        .then((data) => {
            hideModal();
            clearForm();
            getArticleList();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// DARK MODE
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
let body = document.querySelector('body');
let error = document.getElementById('error-box');

function switchTheme(e) {
    if (e.target.checked) {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        changeImageNotFound('dark');

    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        changeImageNotFound('light');
    }
}

function changeImageNotFound(theme) {
    let img = document.getElementById('error-box');
    if (img) {
        if (theme === 'dark') {
            img.style.backgroundImage = 'url("/img/Valley-dark.jpg")';
        } else {
            img.style.backgroundImage = 'url("/img/Valley-light.jpg")';
        }
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}


// CREATING THE ERROR PAGE
function createPage404() {
    clearRoot();
    clearArticleButton();

    let errorDiv = document.createElement('div');
    errorDiv.setAttribute('class', 'error-box');
    errorDiv.setAttribute('id', 'error-box');

    if (localStorage.getItem('theme') === 'light') {
        errorDiv.style.backgroundImage = "url('/img/Valley-light.jpg')";
    } else if (localStorage.getItem('theme') === 'dark') {
        errorDiv.style.backgroundImage = "url('/img/Valley-dark.jpg')";
    }

    let errorInfoDiv = document.createElement('div');
    errorInfoDiv.setAttribute('class', 'error-info');

    let errorParagraph = document.createElement('h1');
    errorParagraph.setAttribute('class', 'error-message');
    errorParagraph.textContent = 'Error 404 - Page not found!'

    let anchorToHomepage = document.createElement('a');
    anchorToHomepage.setAttribute('href', '');
    let goToHomepageButton = document.createElement('button');
    goToHomepageButton.setAttribute('type', 'button');
    goToHomepageButton.setAttribute('class', 'to-homepage');
    goToHomepageButton.textContent = 'BACK TO HOMEPAGE';

    root.style.margin = 0;

    errorDiv.appendChild(errorInfoDiv);
    errorInfoDiv.appendChild(errorParagraph);
    errorInfoDiv.appendChild(anchorToHomepage);
    anchorToHomepage.appendChild(goToHomepageButton);
    root.appendChild(errorDiv);
}


// VALIDATING THE MODAL FUNCTION
function validateModal() {
    let regexJpg = /\.(jpe?g|png|gif|bmp)$/i;
    let upperCaseLetter = /([A-Z]{1})([a-z]+)(\s)([A-Z]{1})([a-z]+){1}(|\s)$/g;

    let isValid = true;
    let errors = [];

    let title = document.getElementById('title');
    let tag = document.getElementById('tag');
    let author = document.getElementById('author');
    let imgUrl = document.getElementById('url');
    let saying = document.getElementById('saying');
    let textarea = document.getElementById('textarea');

    let error = document.getElementById('error-modal');

    if (!title.value) {
        isValid = false;
        errors.push('Please insert the title of your article!');
    }

    if (title.value.length < 5) {
        isValid = false;
        errors.push('The title must be at least 5 characters long!')
    }

    if (!tag.value) {
        isValid = false;
        errors.push('Please insert the tag of your article!');
    }
    if (tag.value.length > 30) {
        isValid = false;
        errors.push('Please keep your tag under 30 characters!');
    }
    if (!author.value) {
        isValid = false;
        errors.push('Please insert the author of your article!');
    }
    if (!upperCaseLetter.test(author.value)) {
        isValid = false;
        errors.push('Please use capital letters for the author\'s first and last name!')
    }

    if (!imgUrl.value) {
        isValid = false;
        errors.push('Please insert an image url!');
    }

    if (!regexJpg.test(imgUrl.value)) {
        isValid = false;
        errors.push('Please insert an image with jpg/jpeg/png/bmp/gif extension!')
    }

    if (!saying.value) {
        isValid = false;
        errors.push('Please insert the main saying of your article!');
    }
    if (!textarea.value) {
        isValid = false;
        errors.push('Please insert the content of your article!');
    }

    if (errors.length > 0) {
        error.innerText = errors[0]
    }

    return isValid;
}

// CREATE HASH ROUTE
window.onload = () => {
    const initialHash = window.location.hash;

    if (initialHash === '') {
        window.location.hash = '#/';
    } else {
        locationHashChange();
    }
};

function locationHashChange() {

    const hash = location.hash;

    if (hash === '#/') {
        renderArticleListPage();
        return;
    }
    if (hash === '#/not-found') {
        createPage404();
        closeDomSpinner();
        return;
    }
    if (hash.includes('#/article/') && hash.substring(10)) {
        getArticleDetails();
        return;
    }
    closeDomSpinner();
    createPage404();
}

window.addEventListener('hashchange', locationHashChange, false);