#![feature(decl_macro, proc_macro_hygiene)]
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate juniper;
// extern crate dotenv;

use rocket::{response::content, State};

mod graphql;
mod db;
// mod schema;
mod models;

#[rocket::get("/")]
fn graphiql() -> content::Html<String> {
    juniper_rocket::playground_source("/graphql")
}

#[rocket::get("/graphql?<request>")]
fn get_graphql_handler(
    request: juniper_rocket::GraphQLRequest,
    schema: State<graphql::Schema>,
    context: State<graphql::Context>,
) -> juniper_rocket::GraphQLResponse {
    request.execute(&schema, &context)
}

#[rocket::post("/graphql", data = "<request>")]
fn post_graphql_handler(
    request: juniper_rocket::GraphQLRequest,
    schema: State<graphql::Schema>,
    context: State<graphql::Context>,
) -> juniper_rocket::GraphQLResponse {
    request.execute(&schema, &context)
}

fn main() {
    rocket::ignite()
        .manage(graphql::create_schema())
        .manage(graphql::Context { pool: db::establish_connection() })
        .mount(
            "/",
            rocket::routes![graphiql, get_graphql_handler, post_graphql_handler],
        )
        .launch();
}
