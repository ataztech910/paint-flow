import errorHandler from "errorhandler";

import app from "./app";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
// const server = app.listen(app.get("port"), () => {
//     console.log(
//         "  App is running at http://localhost:%d in %s mode",
//         app.get("port"),
//         app.get("env")
//     );
//     console.log("  Press CTRL-C to stop\n");
// });

const onConnection = (socket: any) => {
    socket.on("drawing", (data: any) => {
        console.log(data);
        return socket.broadcast.emit("drawing", data);
    });
};
const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", onConnection);
server.listen(process.env.PORT || 3231, () => console.log("listening on port " + process.env.PORT || 3231));

export default server;
