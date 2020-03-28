#![feature(decl_macro, proc_macro_hygiene)]
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate juniper;


use rocket::{response::content, State, http::Method};
use rocket_contrib::serve::StaticFiles;

mod graphql;
mod db;
mod models;

#[rocket::get("/graphiql")]
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
    let cors = rocket_cors::CorsOptions {
        allowed_methods: vec![Method::Get, Method::Post, Method::Options].into_iter().map(From::from).collect(),
        ..Default::default()
    }.to_cors().expect("Unable to create CORS handler");
    let context = graphql::Context { pool: db::establish_connection() };
    db::run_migrations(&context.pool).expect("Unable to run migrations");

    rocket::ignite()
        .manage(graphql::create_schema())
        .manage(context)
        .attach(cors)
        .mount("/", StaticFiles::from("../client/build"))
        .mount(
            "/",
            rocket::routes![graphiql, get_graphql_handler, post_graphql_handler],
        )
        .launch();
}
