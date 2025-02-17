# Contributing

Please review this document before for guidance on how to make make changes. 

## Structure

```bash
├───.vscode # Editor settings
├───apps
│   └───clothing-processor
│   └───web
├───packages
├───.gitignore
├───.npmrc
├───CONTRIBUTING.md # You are here :)
├───LICENSE.md
├───package.json
├───pnpm-lock.yaml
├───pnpm-workspace.yaml # Define workspaces
├───README.md
├───turbo.json # Turbo repo concepts
```

## Development

### Clone on your local machine

```bash
git clone https://github.com/W-Fits/wfits.app/.git
```

### Navigate to project directory

```bash
cd wfits.app
```

### Create a new Branch

```bash
git checkout -b new-branch 
```

### Install dependencies

```bash
pnpm install
```

### Pushing Changes

```bash
git add .
git commit -a -m "init commit"
git push -u origin new-branch
```

Now you can create a pull request and request reviewers to merge the changes you have made.

### Commit Message Guidance

We make use of semantic commit messages in our organisation, please follow [this](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) guide for more information.