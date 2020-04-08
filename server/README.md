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

#### Build and test locally
```bash
cargo build --release -j $(nproc)
ROCKET_PORT=80 ./target/release/server
```

#### Build client, build server, deploy
```bash
# build client/server
cd ../client && yarn build && cd - && cargo build --release -j $(nproc)

# copy files
scp -C target/release/server root@direct.replace.sh:~/server.swp
scp .env root@direct.replace.sh:~/

# restart service in new tmux
ssh root@direct.replace.sh "cd /root && \
if [[ -f server.swp ]]; then mv server.swp server; fi && \
tmux kill-server; \
tmux new-session -d sh -i -c 'ROCKET_PORT=80 ROCKET_LOG=normal /root/server'"
```
Note: this creates a file `db.sqlite` wherever it is run from
