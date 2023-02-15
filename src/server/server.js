import express from "express";
import http from "http";

// Fetch settings
import { isDevelopment } from "./settings";

// --------------------
// SETUP
const app = express();
const server = new http.Server(app);

// --------------------
// CONFIG
app.set("view engine", "pug");
app.use(express.static("public"));

const useExternalStyles = !isDevelopment;
const scriptRoot = isDevelopment ? "http://localhost:8080/build" : "/build";

app.get("*", (req, res) => {
	res.render("index", {
		useExternalStyles,
		scriptRoot
	});
});

// --------------------
// STARTUP
const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`Started http server on ${port}`);
});
