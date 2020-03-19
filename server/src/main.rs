#![feature(decl_macro, proc_macro_hygiene)]
extern crate juniper;

use juniper_from_schema::graphql_schema_from_file;
use juniper::{FieldResult, Executor};

use rocket::{response::content, State};


// This is the important line
graphql_schema_from_file!("schema.graphql");

pub struct Context(i32);

impl juniper::Context for Context {}

pub struct Query;

impl QueryFields for Query {
    fn field_hello_world(&self,
                         _executor: &Executor<'_, Context>,
                         name: String,
    ) -> FieldResult<String> {
        _executor.context().0;
        Ok(format!("Hello, {}!", name))
    }
}

pub struct Mutation;

impl MutationFields for Mutation {
    fn field_noop(&self, _executor: &Executor<'_, Context>) -> FieldResult<&bool> {
        Ok(&true)
    }
}

#[rocket::get("/")]
fn graphiql() -> content::Html<String> {
    juniper_rocket::graphiql_source("/graphql")
}

#[rocket::get("/graphql?<request>")]
fn get_graphql_handler(
    request: juniper_rocket::GraphQLRequest,
    schema: State<Schema>,
    context: State<Context>,
) -> juniper_rocket::GraphQLResponse {
    request.execute(&schema, &context)
}

#[rocket::post("/graphql", data = "<request>")]
fn post_graphql_handler(
    request: juniper_rocket::GraphQLRequest,
    schema: State<Schema>,
    context: State<Context>,
) -> juniper_rocket::GraphQLResponse {
    request.execute(&schema, &context)
}

fn main() {
    rocket::ignite()
        .manage(Context { 0: 1 })
        .manage(Schema::new(Query {}, Mutation {}))
        .mount(
            "/",
            rocket::routes![graphiql, get_graphql_handler, post_graphql_handler],
        )
        .launch();
}
