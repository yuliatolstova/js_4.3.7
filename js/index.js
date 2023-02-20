import { Search } from './module/search.js';
import { View } from './module/view.js';
import { Api } from './module/api.js';
import { Log } from './module/log.js';

const api = new Api();
const application = new Search(new View(api), api, new Log());
