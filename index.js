import { serve } from "bun";
import { db } from "./db.js";

serve({
    port: 3000,

    async fetch(req) {
        const url = new URL(req.url);
            
        // Create (POST /users)
        if (req.method === "POST" && url.pathname === "/users") {
            const { name, email } = await req.json();
            try {
                db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
                return new Response(JSON.stringify({ message: "User created" }), {
                status: 201,
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: "Error creating user" }), {
                status: 500,
                });
            }
        }

        // Read (GET /users or GET /users/:id)
        if (req.method === "GET" && url.pathname.startsWith("/users")) {
            const id = url.pathname.split("/")[2];
            if (id) {
                const user = db.query("SELECT * FROM users WHERE id = ?", [id]).get();
                if (user) {
                return new Response(JSON.stringify(user), { status: 200 });
                }
                return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                });
            } else {
                const users = db.query("SELECT * FROM users").all();
                return new Response(JSON.stringify(users), { status: 200 });
            }
        }

        // Update (PUT /users/:id)
        if (req.method === "PUT" && url.pathname.startsWith("/users/")) {
            const id = url.pathname.split("/")[2];
            const { name, email } = await req.json();
            try {
                db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [
                name,
                email,
                id,
                ]);
                return new Response(JSON.stringify({ message: "User updated" }), {
                status: 200,
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: "Error updating user" }), {
                status: 500,
                });
            }
        }

        // Delete (DELETE /users/:id)
        if (req.method === "DELETE" && url.pathname.startsWith("/users/")) {
            const id = url.pathname.split("/")[2];
            try {
                db.run("DELETE FROM users WHERE id = ?", [id]);
                return new Response(JSON.stringify({ message: "User deleted" }), {
                status: 200,
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: "Error deleting user" }), {
                status: 500,
                });
            }
        }

        return new Response("Not Found", { status: 404 });
    },
});

console.log("Server running on http://localhost:3000");
