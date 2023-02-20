export class View {
  constructor(api) {
    this.api = api;
    this.app = document.getElementById('app');

    this.searchLine = this.createElement('div', 'search-line');
    this.searchInput = this.createElement('input', 'search-input');
    this.searchLine.append(this.searchInput);

    this.resultMessage = this.createElement('span', 'result-message');

    this.reposWrapper = this.createElement('div', 'repos-wrapper');
    this.reposList = this.createElement('ul', 'repos');
    this.reposWrapper.append(this.reposList);

    this.selectedReposList = this.createElement('ul', 'selected-repos');
    this.reposWrapper.append(this.selectedReposList);

    this.main = this.createElement('div', 'main');
    this.main.append(this.reposWrapper);

    this.app.append(this.searchLine);
    this.app.append(this.resultMessage);
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
  setResultMessage(message) {
    this.resultMessage.textContent = message;
  }
}
