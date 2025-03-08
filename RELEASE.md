# Release Pipeline

This document outlines the release process for Dropbox-Lite, ensuring consistent versioning, branch management, and release creation.

## Branch Strategy

```
main (default branch)
  └── version-1.x.x (major version branch)
       ├── version-1.0.x (minor version branch)
       │    ├── version-1.0.0 (release tag)
       │    ├── version-1.0.1 (patch release tag)
       │    └── ...
       ├── version-1.1.x
       └── ...
```

## Automated Release Process

1. **Run the Release Script**
   ```bash
   # Execute the release script with the desired version
   ./release.sh <version>
   
   # Example:
   ./release.sh 1.0.0
   ```

   The script will automatically:
   - Validate the version number format (x.y.z)
   - Update and pull the main branch
   - Create or checkout the version branch
   - Create the release tag
   - Push the branch and tag to origin

2. **Automated GitHub Release**
   
   When the tag is pushed to the repository, GitHub Actions will automatically:
   - Create a new GitHub Release
   - Set the release title to "Release vX.Y.Z"
   - Extract and include the relevant section from CHANGELOG.md
   - Publish the release

   Note: No manual intervention is required for the GitHub Release creation.


## Delete a Release
   ```bash
   # Execute the delete script with the version to remove
   ./delete-release.sh <version>
   
   # Example:
   ./delete-release.sh 1.0.0
   ```

   The script will:
   - Validate the version number format (x.y.z)
   - Ask for confirmation before deletion
   - Delete local and remote tags (vx.y.z)
   - Delete local and remote branches (version-x.y.z)
   - Provide feedback for each deletion step

## Release Checklist

Before creating a release:

- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version numbers are updated in all files
- [ ] All dependencies are up to date
- [ ] Database migrations (if any) are prepared

---

## Legacy Manual Release Process (Reference)

The following steps describe the manual release process (kept for reference):

1. **Create Version Branch**
   ```bash
   # For a new version
   git checkout main
   git checkout -b version-1.x.x
   ```

2. **Update Version Numbers**
   - Update version in `frontend/package.json`
   - Add new version section in `CHANGELOG.md`

3. **Create Release Commit**
   ```bash
   git add .
   git commit -m "chore: prepare release v1.x.x"
   ```

4. **Create Git Tag**
   ```bash
   git tag -a v1.x.x -m "Release version v1.x.x"
   ```

5. **Push Changes**
   ```bash
   # Push the branch
   git push origin version-1.x.x
   
   # Push the tag
   git push origin v1.x.x
   ```

6. **Github Release**

1. Go to GitHub Releases
2. Click "Draft a new release"
3. Choose the tag version that was just created
4. Title: "Release v1.0.0"
5. Description: Copy the relevant section from CHANGELOG.md
6. Mark as latest release if appropriate
7. Publish release
