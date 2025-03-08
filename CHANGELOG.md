# Changelog

All notable changes to Dropbox-Lite will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-03-08
### Added
- Automated release management system:
  - `release.sh` script for creating version branches and tags
  - `delete-release.sh` script for cleaning up versions
  - GitHub Actions workflow for automated release creation
### Updated
- Improved release documentation with Automated and manual release instructions

## [1.0.0] - 2025-02-25

### Added
- Initial release of Dropbox-Lite
- Modern interface built with Next.js and Tailwind CSS
- Drag-and-drop file upload functionality
- Support for multiple file types (Text, Images, PDF, Word, Audio, Video)
- File management features:
  - List view of uploaded files
  - Sort files by name or upload date
  - Download functionality
  - Real-time upload status
- FastAPI backend implementation
- MinIO object storage integration
- SQLite database for file metadata
- Docker and Docker Compose support
- Comprehensive documentation
- Swagger API Documentation

[1.1.0]: https://github.com/ysskrishna/dropbox-lite/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ysskrishna/dropbox-lite/releases/tag/v1.0.0