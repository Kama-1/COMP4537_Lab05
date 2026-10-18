import { ApiCaller } from "./ApiCaller.js";
import { STRINGS } from "../lang/en/user.js";

class UI {
  constructor(apiCaller) {
    this.apiCaller = apiCaller;

    this.title = document.querySelector(".title");
    this.insertButton = document.querySelector("#insert");
    this.queryButton = document.querySelector("#custom-query-button");
    this.queryText = document.querySelector("#custom-query-text");

    this.loadStaticStrings();
    this.setInsertListener();
    this.setQueryListener();
  }

  loadStaticStrings() {
    document.title = STRINGS.TITLE;
    this.title.innerText = STRINGS.TITLE;
    this.insertButton.innerText = STRINGS.INSERT_BUTTON;
    this.queryButton.innerText = STRINGS.QUERY_BUTTON;
    this.queryText.placeholder = STRINGS.QUERY_HINT;
  }

  setInsertListener() {
    this.insertButton.addEventListener("click", () => {
      this.apiCaller.postInsert();
    });
  }

  setQueryListener() {
    this.queryButton.addEventListener("click", () => {
      const query = this.queryText.value;
      if (!query) {
        return;
      }
      this.apiCaller.getQuery(query);
    });
  }
}

function main() {
  const ui = new UI(new ApiCaller());
}

main();
