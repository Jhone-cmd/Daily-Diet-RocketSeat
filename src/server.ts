import { app } from "./app";
import { env } from "./_env/schema";

app.listen({ port:  env.PORT }).then(() => {
    console.log('HTTP Server Running 🚀');     
});