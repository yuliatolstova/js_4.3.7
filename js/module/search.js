export class Search {
  constructor(view, api, log) {
    this.view = view;
    this.api = api;
    this.log = log;

    this.view.searchInput.addEventListener('input', this.debounce(this.searchRepos.bind(this), 400));
  }
  searchRepos() {
    let totalCount;
    let message;
    this.view.setResultMessage('');
    const searchValue = this.view.searchInput.value;
    if (searchValue) {
      this.clearRepos();
      this.api.searchRepos(searchValue).then((res) => {
        if (res.ok) {
          res.json().then((res) => {
            totalCount = res.total_count;
            message = this.log.showResultMessage(totalCount);
            this.view.setResultMessage(message);
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
