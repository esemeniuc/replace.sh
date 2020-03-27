table! {
    find_replace_commands (id) {
        id -> Integer,
        find -> Text,
        replace -> Text,
        command -> Text,
        is_global -> Bool,
        is_inplace -> Bool,
        shortcode -> Text,
    }
}
