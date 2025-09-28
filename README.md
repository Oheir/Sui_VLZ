# Shallot

## Description

Shallot is a decentralized and anonymous voting platform built on the SUI blockchain. It allows users to create forums and polls, ensuring privacy and trustless participation through blockchain technology.

## How to use (windows)

### Linux

To use it on linux, replace the "$env:" by "export".

### Create PACKAGE_ID
$env:PACKAGE_ID="0x6c45a01c7b03d54948f95bfcbc6a1cf6a032b6cd81c7a5fb2673cefd4fb8c736"

###  create Forum
sui client call --package $env:PACKAGE_ID --module forum --function create_forum --args "{Forum_Name}" "{Forum_Description}" "{Forum_password}" --gas-budget 10000000

### record output of Forum ID
$env:FORUM_ID="{FORUM_ID}"

### initialize membership register
sui client call --package $env:PACKAGE_ID --module membership --function init_member_registry --args $env:FORUM_ID --gas-budget 10000000
  
### find REGISTRY_ID
$env:REGISTRY_ID="{REGISTRY_ID}"

sui client call --package $env:PACKAGE_ID --module membership  --function join_forum --args $env:FORUM_ID $env:REGISTRY_ID "{Forum_password}" "0x6" --gas-budget 10000000

### create poll's vote_registry register
sui client call --package $PACKAGE_ID --module ballot --function init_vote_registry --args $POLL_ID --gas-budget 10000000
  
### record VOTE_REGISTRY_ID
$env:VOTE_REGISTRY_ID="{VOTE_REGISTRY_ID}"

### Record POLL_ID
$env:POLL_ID="{POLL_ID}"

### every one vote
sui client call --package $env:PACKAGE_ID --module ballot --function vote --args $env:POLL_ID $env:VOTE_REGISTRY_ID $env:REGISTRY_ID true "0x6" --gas-budget 10000000
