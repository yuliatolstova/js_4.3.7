class View {
  constructor(api) {
    this.api = api;
    this.app = document.getElementById('app');

    this.searchLine = this.createElement('div', 'search-line');
    this.searchInput = this.createElement('input', 'search-input');
    this.searchLine.append(this.searchInput);

    this.reposWrapper = this.createElement('div', 'repos-wrapper');
    this.reposList = this.createElement('ul', 'repos');
    this.reposWrapper.append(this.reposList);

    this.selectedReposList = this.createElement('ul', 'selected-repos');
    this.reposWrapper.append(this.selectedReposList);

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
    repoElement.addEventListener('click', () => this.showRepoData(reposData.name, reposData.owner.login, reposData.stargazers_count));
    repoElement.insertAdjacentHTML('afterbegin', `<span class="repo-prev-name">${reposData.name}</span>`);
    this.reposList.append(repoElement);
  }
  showRepoData(name, owner, stars) {
    this.searchInput.value = '';
    const selectedRepo = this.createElement('li', 'selected-repo');
    selectedRepo.insertAdjacentHTML('afterbegin', `<span>Name: ${name}</span> <span>Owner: ${owner}</span> <span>Stars: ${stars}</span> <i class="cross"></i>`);
    let selectedRepoId = `${name}-${owner}`;
    selectedRepo.setAttribute('id', selectedRepoId);
    if (!document.getElementById(selectedRepoId)) {
      this.selectedReposList.append(selectedRepo);
    }
    selectedRepo.addEventListener('click', (e) => this.deleteSelectedRepo(e));
  }
  deleteSelectedRepo(e) {
    if ((e.target.className = 'cross')) {
      e.target.closest('li').remove();
    }
  }
}
//
const REPOS_PER_PAGE = 5;
class Search {
  constructor(view, api) {
    this.view = view;
    this.api = api;

    this.view.searchInput.addEventListener('keyup', this.debounce(this.searchRepos.bind(this), 400));
  }
  searchRepos() {
    const searchValue = this.view.searchInput.value;
    if (searchValue) {
      this.clearRepos();
      this.api.searchRepos(searchValue).then((res) => {
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
    this.view.reposList.innerHTML = '';
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
const URL = 'https://api.github.com/';
class Api {
  async searchRepos(value) {
    return await fetch(`${URL}search/repositories?q=${value}&per_page=${REPOS_PER_PAGE}`);
  }
}

const api = new Api();
new Search(new View(api), api);
