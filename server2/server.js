const en = require("./lang/en/en");
const db = require("./database");
const http = require("http");
const url = require("url");

class Server {
  constructor(database, port = 8800) {
    this.server = http.createServer((req, res) => this.handleRoutes(req, res));
    this.port = port;
    this.database = database;
  }

  run() {
    this.server.listen(this.port);
    console.log(`Server is running and listening on port ${this.port}`);
  }

  handleRoutes(req, res) {
    const q = url.parse(req.url, true);
    if (req.method === "POST" && q?.pathname === "/api/insert/") {
      let body = "";
      req.on("data", (chunk) => {
        if (chunk != null) {
          body += chunk;
        }
      });
      req.on("end", () => {
        this.handleInsert(res, body);
      });
      return;
    }
    if (req.method === "GET" && q?.pathname?.startsWith("/api/sql/")) {
      this.handleSelect(res, this.parseSQL(q.pathname));
      return;
    }
    res.writeHead(404, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(`${en.STRINGS.ROUTE_NOT_FOUND}`);
  }

  handleInsert(res, body) {
    let values;
    try {
      values = JSON.parse(body);
    } catch (error) {
      console.error(error);
      res.writeHead(400, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      });
      res.write(en.STRINGS.JSON_ERROR);
      res.end();
    }

    this.database.insertPatients(
      values,
      (numRowsInserted) => {
        res.writeHead(200, {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        });
        res.write(numRowsInserted + en.STRINGS.ON_INSERT);
        res.end();
      },
      () => {
        res.writeHead(500, {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        });
        res.write(en.STRINGS.DB_ERROR);
        res.end();
      },
    );
  }

  handleSelect(res, statement) {
    this.database.readQuery(
      statement,
      (results) => {
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        res.write(JSON.stringify(results));
        res.end();
      },
      () => {
        res.writeHead(500, {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        });
        res.write(en.STRINGS.DB_ERROR);
        res.end();
      },
    );
  }

  parseSQL(pathName) {
    const routeSections = pathName.split("/");
    return decodeURIComponent(routeSections[routeSections.length - 1]);
  }
}

function main() {
  const server = new Server(new db.Database(), process.env.PORT);
  server.run();
}

main();
