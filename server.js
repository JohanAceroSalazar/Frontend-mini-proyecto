const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 5500;
const root = path.join(__dirname, "src");

const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
};

function resolveFile(requestUrl) {
    const safePath = requestUrl === "/" ? "/index.html" : requestUrl;
    return path.join(root, safePath.replace(/^\/+/, ""));
}

const server = http.createServer((req, res) => {
    const filePath = resolveFile(req.url || "/");

    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Not found");
            return;
        }

        const extension = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            "Content-Type": contentTypes[extension] || "application/octet-stream",
        });
        res.end(data);
    });
});

server.listen(port, () => {
    console.log(`Frontend ready on http://localhost:${port}`);
});
