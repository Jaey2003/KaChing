default: build

all: test

test: build
	cargo test

build:
	stellar contract build
	@ls -l target/wasm32v1-none/release/*.wasm

fmt:
	cargo fmt --all

clean:
	cargo clean

deploy: build
	@echo "Deploying contract to Testnet..."
	$(eval CONTRACT_ID=$(shell stellar contract deploy --wasm target/wasm32v1-none/release/ka_ching.wasm --source dev --network testnet))
	@echo "Updating frontend environment variables..."
	@echo "NEXT_PUBLIC_CONTRACT_ID=$(CONTRACT_ID)" > ../frontend/.env.local
	@echo "Deployed successfully! Contract ID: $(CONTRACT_ID)"
