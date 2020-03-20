use juniper::FieldResult;
use juniper::RootNode;

use juniper::{GraphQLObject};

#[derive(GraphQLObject)]
#[graphql(description = "A humanoid creature in the Star Wars universe")]
struct FindReplaceCommand {
    find: String,
    replace: String,
    command: String,
}
pub struct Context(pub i32);
impl juniper::Context for Context {}

pub struct QueryRoot;

#[juniper::object(
// Here we specify the context type for this object.
Context = Context,
)]
impl QueryRoot {
    fn human(id: String) -> FieldResult<FindReplaceCommand> {
        // Ok(Human {
        //     id: "1234".to_owned(),
        //     name: "Luke".to_owned(),
        //     appears_in: vec![Episode::NewHope],
        //     home_planet: "Mars".to_owned(),
        // })
        unimplemented!()
    }
}

pub struct MutationRoot;

#[juniper::object(
// Here we specify the context type for this object.
Context = Context,
)]
impl MutationRoot {
    fn create_human() -> FieldResult<FindReplaceCommand> {
        // Ok(Human {
        //     id: "1234".to_owned(),
        //     name: new_human.name,
        //     appears_in: new_human.appears_in,
        //     home_planet: new_human.home_planet,
        // })
        unimplemented!()
    }
}

pub type Schema = RootNode<'static, QueryRoot, MutationRoot>;

pub fn create_schema() -> Schema {
    Schema::new(QueryRoot {}, MutationRoot {})
}