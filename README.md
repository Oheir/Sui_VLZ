$env:PACKAGE_ID="0x6c45a01c7b03d54948f95bfcbc6a1cf6a032b6cd81c7a5fb2673cefd4fb8c736"

#  create Forum
sui client call --package $env:PACKAGE_ID --module forum --function create_forum --args "Bitcoin Discussion" "A forum for Bitcoin discussions" "password123" --gas-budget 10000000

# record output of Forum ID
$env:FORUM_ID="0x1f24d5ec34482c32ae99605518c67d13092b24524806034bb2d64fc22c7f5754"

# initialize membership register
sui client call --package $env:PACKAGE_ID --module membership --function init_member_registry --args $env:FORUM_ID --gas-budget 10000000
  
# find REGISTRY_ID
$env:REGISTRY_ID="0x3cc726b5b7298ca4996b969268ddee104e4508160157c0c2a8b45b7167f88e95"

sui client call --package $env:PACKAGE_ID --module membership  --function join_forum --args $env:FORUM_ID $env:REGISTRY_ID "password123" "0x6" --gas-budget 10000000

# create poll's vote_registry register
sui client call --package $PACKAGE_ID --module ballot --function init_vote_registry --args $POLL_ID --gas-budget 10000000
  
# record VOTE_REGISTRY_ID
$env:VOTE_REGISTRY_ID="0x349284b8134d7e9cd666d3e187e5e442019c054c9a17d7a2b60b654f732ad77b"
$env:POLL_ID="0x3769cfca60e0731c4d58892b7e74ff40d33f31d9333056156c8c0eaef0fc8e8c"

# every one vote
sui client call --package $env:PACKAGE_ID --module ballot --function vote --args $env:POLL_ID $env:VOTE_REGISTRY_ID $env:REGISTRY_ID true "0x6" --gas-budget 10000000
