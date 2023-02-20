export class Api {
  async searchRepos(value) {
    return await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`);
  }
}
