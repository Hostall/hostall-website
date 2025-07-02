# Contributing to HOSTALL

Thank you for your interest in contributing to HOSTALL! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

Before reporting a bug, please check if it already exists in the [Issues](https://github.com/teamhostall/hostall/issues) section. If it doesn't, create a new issue using our bug report template.

When filing a bug report, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots or GIFs if applicable
- Environment details (browser, OS, device)
- Any relevant console errors

### Suggesting Features

Have an idea for a new feature? Create an issue using our feature request template. Please provide:

- A clear description of the feature
- The problem it solves
- Potential implementation approach
- Mockups or examples if applicable

### Pull Requests

We welcome pull requests for bug fixes, features, or improvements!

1. Fork the repository
2. Create a new branch from `main` with a descriptive name
3. Make your changes following our coding standards
4. Write or update tests as necessary
5. Update documentation as needed
6. Submit a pull request with a clear description of the changes

#### Pull Request Process

1. Ensure all tests pass before submitting
2. Update the README.md or documentation if needed
3. The PR should work in all supported browsers
4. A project maintainer will review your changes
5. Address any requested changes
6. Once approved, your PR will be merged

## Development Setup

### Prerequisites

- Node.js 18.x or later
- npm 8.x or later
- Supabase CLI for local development
- Git

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/teamhostall/hostall.git

# Navigate to the project directory
cd hostall

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Local Supabase Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db push
```

## Coding Standards

### JavaScript

- Use ES6+ features when appropriate
- Follow the existing code style (semicolons, 2-space indentation)
- Add comments for complex logic
- Use meaningful variable and function names

### HTML/CSS

- Write semantic HTML
- Follow BEM methodology for CSS classes
- Ensure responsiveness for mobile devices
- Test across different browsers

### Security

- Sanitize all user inputs
- Use parameterized queries for database operations
- Follow security best practices for authentication
- Never commit sensitive information (API keys, credentials)

## Testing

- Write tests for new functionality
- Ensure existing tests pass
- Test on multiple browsers and devices
- Test edge cases and error scenarios

## Documentation

- Update documentation for new features
- Document APIs, components, and important functions
- Keep the README and other guides up to date
- Use clear, concise language

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding or modifying tests
- `chore:` for maintenance tasks

Example: `feat: add two-factor authentication`

## Getting Help

If you need help with contributing:

- Check the documentation
- Join our Discord server for real-time help
- Ask questions in GitHub Discussions
- Contact the maintainers at dev@hostall.com

## Recognition

Contributors will be recognized in our README.md and in release notes. Thank you for your contributions!