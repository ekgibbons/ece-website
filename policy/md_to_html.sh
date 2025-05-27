#!/bin/bash
# Convert each markdown file in the markdown/ directory to an individual HTML file

set -e

MD_DIR="markdown"
HMTL_DIR="html"

for mdfile in "$MD_DIR"/*.md; do
    base=$(basename "$mdfile" .md)
    pandoc "$mdfile" -o "$MD_DIR/$base.html"
    mv "$MD_DIR/$base.html" "$HMTL_DIR/$base.html"
    if [ $? -ne 0 ]; then
        echo "Error converting $mdfile to HTML"
        exit 1
    fi
    echo "Converted $mdfile to $MD_DIR/$base.html"
done
