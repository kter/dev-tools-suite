# Process package.json files in tools subdirectories only (not nested)
find tools -maxdepth 2 -mindepth 2 -name "package.json" -exec sh -c 'echo "Processing: $1"; jq ".version = (.version | split(\".\") | .[2] = (.[2] | tonumber + 1 | tostring) | join(\".\"))" "$1" > "$1.tmp" && mv "$1.tmp" "$1"' _ {} \;
