# replace.sh server
A graphql backend that stores and serves created find-replaces. Built with Rust and sqlite. Automatically integrates client html code as part of the binary.

## Requirements

- Rust nightly (for Rocket web server)
- Sqlite

## Setup

```bash
cargo install diesel_cli --no-default-features --features "sqlite"

export PATH=$PATH:~/.cargo/bin
diesel migration run
```

## Deployment

```bash
cargo build --release -j $(nproc)
ROCKET_PORT=80 ./target/release/server
```
Note: this creates a file `db.sqlite` whereever it is run from
