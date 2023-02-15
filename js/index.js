class View {
  constructor() {
    this.app = document.getElementById('app');

    this.searchLine = this.createElement('div', 'search-line');
    this.searchInput = this.createElement('input', 'search-input');
    this.searchLine.append(this.searchInput);

    this.reposWrapper = this.createElement('div', 'repos-wrapper');
    this.reposList = this.createElement('ul', 'repos');
    this.reposWrapper.append(this.reposList);

    this.main = this.createElement('div', 'main');
    this.main.append(this.reposWrapper);

    this.app.append(this.searchLine);
    this.app.append(this.main);
  }
  createElement(elementTag, className) {
    const element = document.createElement(elementTag);
    if (className) {
      element.classList.add(className);
    }
    return element;
  }
  createRepos(reposData) {
    const repoElement = this.createElement('li', 'repo-prev');
    repoElement.insertAdjacentHTML('afterbegin', `<span class="repo-prev-name">${reposData.name}</span>`);
    this.reposList.append(repoElement);
  }
}
//
const REPOS_PER_PAGE = 5;
class Search {
  constructor(view) {
    this.view = view;
    this.view.searchInput.addEventListener('keyup', this.debounce(this.searchRepos.bind(this), 400));
  }
  async searchRepos() {
    const searchValue = this.view.searchInput.value;
    if (searchValue) {
      this.clearRepos();
      return await fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=${REPOS_PER_PAGE}`).then((res) => {
        if (res.ok) {
          res.json().then((res) => {
            res.items.forEach((repo) => {
              this.view.createRepos(repo);
            });
          });
        }
      });
    } else {
      this.clearRepos();
    }
  }
  clearRepos() {
    this.view.reposList.innerHTML = ''; //('afterbegin', '');
  }
  debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}
new Search(new View());
