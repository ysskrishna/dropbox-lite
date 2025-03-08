#!/bin/bash

# Function to validate version number format
validate_version() {
    if ! [[ $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "Error: Version must be in format x.y.z (e.g., 1.0.0)"
        exit 1
    fi
}

# Main release process
create_release() {
    local version=$1
    local branch_name="version-$version"
    
    echo "🚀 Starting release process for v$version"
    
    # Ensure we're on main branch and it's up to date
    echo "📥 Updating main branch..."
    git checkout main
    git pull origin main
    
    # Create or checkout version branch
    echo "🌿 Creating/checking out branch '$branch_name'..."
    git checkout -b $branch_name
    
    # Create tag
    echo "🏷️ Creating release tag 'v$version'..."
    git tag -a "v$version" -m "Release version $version"
    
    # Push changes
    echo "📤 Pushing branch '$branch_name' and tag 'v$version'..."
    git push origin $branch_name
    git push origin "v$version"
    
    echo "✅ Release process completed for version v$version"
}

# Script usage
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.0"
    exit 1
fi

# Validate and create release
validate_version $1
create_release $1