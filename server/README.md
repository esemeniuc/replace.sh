# Setup
```bash
cargo install diesel_cli --no-default-features --features "sqlite"

export PATH=$PATH:~/.cargo/bin
diesel migration run
```