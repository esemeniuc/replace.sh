use juniper::{FieldResult, GraphQLObject, RootNode};

#[derive(GraphQLObject)]
struct FindReplaceCommand {
    find: String,
    replace: String,
    command: String,
}

pub struct Context(pub i32);

impl juniper::Context for Context {}

pub struct Query;

#[juniper::object(
// Here we specify the context type for this object.
Context = Context,
)]
impl Query {
    #[graphql(description = "A tuple for the user's form submission")]
    fn get_find_replace_command(id: String) -> FieldResult<Option<FindReplaceCommand>> {
        Ok(Option::from(FindReplaceCommand {
            find: "1234".to_owned(),
            replace: "Luke".to_owned(),
            command: "Mars".to_owned(),
        }))
    }
}

pub struct Mutation;

#[juniper::object(Context = Context)]
impl Mutation {
    #[graphql(description = "Returns a url for accessing the tuple")]
    fn create_command(find: String, replace: String) -> FieldResult<String> {
        Ok(String::from("Foo"))
    }
}

pub type Schema = RootNode<'static, Query, Mutation>;

pub fn create_schema() -> Schema {
    Schema::new(Query {}, Mutation {})
}