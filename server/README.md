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
IP_PORT=0.0.0.0:80 ./target/release/replace_sh
```

#### Build client, build server, deploy
```bash
# build client/server
cd ../client && yarn build && cd - && cargo build --release -j $(nproc)

# copy files
scp -C target/release/replace_sh root@direct.replace.sh:~/replace_sh.swp
scp .env root@direct.replace.sh:~/

# restart service in new tmux
ssh root@direct.replace.sh "cd /root && \
if [[ -f replace_sh.swp ]]; then mv replace_sh.swp replace_sh; fi && \
tmux kill-server; \
tmux new-session -d sh -i -c 'IP_PORT=0.0.0.0:80 /root/replace_sh'"
```
Note: this creates a file `db.sqlite` wherever it is run from
