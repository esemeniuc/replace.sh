#![feature(decl_macro, proc_macro_hygiene)]
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate juniper;
#[macro_use]
extern crate rocket;

mod graphql;
mod db;
mod models;

use rocket::{response::content, State};
use rocket::http::{Status, Method, ContentType};
use rocket::response;
use rust_embed::RustEmbed;

use std::ffi::OsStr;
use std::io::Cursor;
use std::path::PathBuf;

//from https://github.com/pyros2097/rust-embed/blob/master/examples/rocket.rs
#[derive(RustEmbed)]
#[folder = "../client/build"]
struct Asset;

#[get("/")]
fn index<'r>() -> response::Result<'r> {
    Asset::get("index.html").map_or_else(
        || Err(Status::NotFound),
        |d| response::Response::build().header(ContentType::HTML).sized_body(Cursor::new(d)).ok(),
    )
}

#[get("/<file..>")]
fn dist<'r>(file: PathBuf) -> response::Result<'r> {
    let filename = file.display().to_string();
    Asset::get(&filename).map_or_else(
        || index(), //redirect to homepage for react
        |d| {
            let ext = file
                .as_path()
                .extension()
                .and_then(OsStr::to_str)
                .ok_or_else(|| Status::new(400, "Could not get file extension"))?;
            let content_type = ContentType::from_extension(ext).ok_or_else(|| Status::new(400, "Could not get file content type"))?;
            response::Response::build().header(content_type).sized_body(Cursor::new(d)).ok()
        },
    )
}

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
        .mount(
            "/",
            rocket::routes![index, dist, graphiql, get_graphql_handler, post_graphql_handler],
        )
        .launch();
}
