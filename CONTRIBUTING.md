# Contributing to Efrate

Thank you for considering contributing to Efrate! This document outlines the process for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please report it by creating an issue on the GitHub repository. Please include:

- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior and actual behavior
- Screenshots (if applicable)
- Environment information (OS, Node.js version, etc.)

### Suggesting Features

If you have an idea for a new feature or improvement, please create an issue on the GitHub repository. Please include:

- A clear, descriptive title
- Detailed description of the proposed feature
- Explanation of why this feature would be useful
- Any relevant examples or mock-ups

### Pull Requests

If you want to contribute code to the project, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Write tests for your changes
5. Run the test suite to ensure everything passes
6. Submit a pull request

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/serifagir/efrate.git
   cd efrate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Style Guidelines

- We use TypeScript for type safety
- Follow the existing code style
- All code should have appropriate documentation
- All new features should include tests

## Adding a New Provider

If you want to add a new AI provider:

1. Create a new file in `src/providers/` (e.g., `new-provider.ts`)
2. Implement the `AIProvider` interface
3. Update the `createProvider` method in `src/client.ts`
4. Add the provider to the `ProviderType` type in `src/client.ts`
5. Export the provider and its types in `src/index.ts`
6. Add tests for the new provider
7. Update documentation

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Documentation

All new features should be documented:

- Update the README.md if necessary
- Add examples in the examples directory
- Update the documentation in the docs directory

## Need Help?

If you need help with anything, feel free to open an issue with the "question" label.

Thank you for contributing! 