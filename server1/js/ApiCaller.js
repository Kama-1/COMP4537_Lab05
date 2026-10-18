import { STRINGS } from "../lang/en/user.js";

export class ApiCaller {
  constructor(baseUrl = "http://localhost:8800/") {
    this.baseUrl = baseUrl;
    this.insertRoute = "api/insert/";
    this.queryRoute = "api/sql/";
  }

  postInsert() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", this.baseUrl + this.insertRoute, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.response) {
        const postResponse = document.querySelector("#post-response");
        postResponse.innerText = xhr.responseText;
      }
    };

    const insertValues = JSON.stringify([
      "Sara Brown",
      "1901-01-01",
      "John Smith",
      "1941-01-01",
      "Jack Ma",
      "1961-01-30",
      "Elon Musk",
      "1999-01-01",
    ]);
    xhr.send(insertValues);
  }

  getQuery(query) {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      this.baseUrl + this.queryRoute + encodeURIComponent(query),
      true,
    );

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const queryResponseHeading = document.querySelector("#query-header");
        const queryResponse = document.querySelector("#query-response");
        queryResponse.replaceChildren("");
        if (xhr.status === 200) {
          const response = xhr.responseText;
          const results = JSON.parse(response);
          queryResponseHeading.innerText = STRINGS.QUERY_HEADING;
          results.forEach((row, i) => {
            const line = document.createElement("li");
            line.innerText = JSON.stringify(row);
            queryResponse.append(line);
          });
        } else {
          queryResponseHeading.innerText = xhr.responseText;
        }
      }
    };

    xhr.send();
  }
}
