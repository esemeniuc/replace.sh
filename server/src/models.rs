#[derive(Queryable)]
pub struct FindReplaceCommand {
    pub id: i64,
    pub find: String,
    pub replace: String,
    pub command: String,
    pub shortcode: String,
}