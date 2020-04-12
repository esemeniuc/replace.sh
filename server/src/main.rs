#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate juniper;

mod graphql;
mod db;
mod models;

use rust_embed::RustEmbed;
use std::sync::Arc;
use actix_web::{web, App, Error, HttpRequest, HttpResponse, HttpServer};
use actix_cors::Cors;
use actix_web::body::Body;
use std::borrow::Cow;

//from https://github.com/pyros2097/rust-embed/blob/master/examples/actix.rs
#[derive(RustEmbed)]
#[folder = "../client/build"]
struct Asset;

fn handle_embedded_file(path: &str) -> HttpResponse {
    match Asset::get(path) {
        Some(content) => {
            let body: Body = match content {
                Cow::Borrowed(bytes) => bytes.into(),
                Cow::Owned(bytes) => bytes.into(),
            };
            HttpResponse::Ok().content_type(mime_guess::from_path(path).first_or_octet_stream().as_ref()).body(body)
        }
        None => index(),
    }
}

fn index() -> HttpResponse {
    handle_embedded_file("index.html")
}

fn dist(req: HttpRequest) -> HttpResponse {
    let path = &req.path()["/".len()..]; // trim the preceding `/` in path
    handle_embedded_file(path)
}

async fn graphiql() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(juniper::http::playground::playground_source("/graphql"))
}

async fn graphql(
    schema: web::Data<Arc<graphql::Schema>>,
    context: web::Data<graphql::Context>,
    request: web::Json<juniper::http::GraphQLRequest>,
) -> Result<HttpResponse, Error> {
    let user = web::block(move || {
        let res = request.execute(&schema, &context);
        Ok::<_, serde_json::error::Error>(serde_json::to_string(&res)?)
    })
        .await?;
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(user))
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let listener = std::env::var("IP_PORT").expect("IP_PORT must be set. Eg. 0.0.0.0:80");

    let schema = std::sync::Arc::new(graphql::create_schema());
    let context = graphql::Context { pool: db::establish_connection() };
    db::run_migrations(&context.pool).expect("Unable to run migrations");
    HttpServer::new(move || {
        App::new()
            .wrap(Cors::new()
                .allowed_origin("https://replace.sh")
                .allowed_origin("http://localhost:3000")
                .allowed_origin("http://localhost:8000")
                .allowed_methods(vec!["GET", "POST"])
                .finish())
            .data(schema.clone())
            .data(context.clone())
            .service(web::resource("/graphql").route(web::post().to(graphql)))
            .service(web::resource("/graphiql").route(web::get().to(graphiql)))
            .service(web::resource("/").route(web::get().to(index)))
            .service(web::resource("/{_:.*}").route(web::get().to(dist)))
    })
        .bind(listener)?
        .run()
        .await
}