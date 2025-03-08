# Release Pipeline

This document outlines the release process for Dropbox-Lite, ensuring consistent versioning, branch management, and release creation.

## Branch Strategy

```
main (default branch)
  └── v1.x.x (major version branch)
       ├── v1.0.x (minor version branch)
       │    ├── v1.0.0 (release tag)
       │    ├── v1.0.1 (patch release tag)
       │    └── ...
       ├── v1.1.x
       └── ...
```

## Release Process

1. **Create Version Branch**
   ```bash
   # For a new version
   git checkout main
   git checkout -b v1.x.x
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
   git tag -a v1.x.x -m "Release version 1.x.x"
   ```

5. **Push Changes**
   ```bash
   git push origin v1.x.x
   ```

6. **Create GitHub Release**
   - Go to GitHub Releases
   - Click "Draft a new release"
   - Choose the tag version
   - Title: "Release v1.0.0"
   - Description: Copy the relevant section from CHANGELOG.md
   - Mark as latest release if appropriate
   - Publish release

## Release Checklist

Before creating a release:

- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version numbers are updated in all files
- [ ] All dependencies are up to date
- [ ] Release notes are prepared
- [ ] Docker images are built and tested
- [ ] Database migrations (if any) are prepared