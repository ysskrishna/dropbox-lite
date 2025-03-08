#!/bin/bash

# Function to validate version number format
validate_version() {
    if ! [[ $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "Error: Version must be in format x.y.z (e.g., 1.0.0)"
        exit 1
    fi
}

# Main deletion process
delete_release() {
    local version=$1
    local branch_name="version-$version"
    
    echo "⚠️  Are you sure you want to delete version v$version? This will remove:"
    echo "   - Local and remote tags 'v$version'"
    echo "   - Local and remote branches '$branch_name'"
    read -p "Please confirm (y/N): " confirm
    
    if [[ $confirm != [yY] ]]; then
        echo "❌ Deletion cancelled"
        exit 1
    fi
    
    echo "🗑️ Starting deletion process for v$version"
    
    # Delete remote tag
    echo "🏷️ Deleting remote tag 'v$version'..."
    git push origin --delete "v$version" || echo "Remote tag 'v$version' doesn't exist"
    
    # Delete local tag
    echo "🏷️ Deleting local tag 'v$version'..."
    git tag -d "v$version" || echo "Local tag 'v$version' doesn't exist"
    
    # Delete remote branch
    echo "🌿 Deleting remote branch '$branch_name'..."
    git push origin --delete $branch_name || echo "Remote branch '$branch_name' doesn't exist"
    
    # Delete local branch
    echo "🌿 Deleting local branch '$branch_name'..."
    git branch -D $branch_name || echo "Local branch '$branch_name' doesn't exist"
    
    echo "✅ Deletion process completed for version v$version"
}

# Script usage
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.0"
    exit 1
fi

# Validate and delete release
validate_version $1
delete_release $1 