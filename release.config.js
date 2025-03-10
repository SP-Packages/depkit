export default {
  branches: ["main"],
  repositoryUrl: "https://github.com/SP-Packages/printer.git",
  prepare: [
    {
      path: "@semantic-release/exec",
      cmd: "zip -r dist.zip dist/",
    },
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
      },
    ],
    "@semantic-release/changelog",
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message: "chore(release): v${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: [
          { path: "dist.zip", label: "Distribution Files", overwrite: true },
          { path: "package.json", label: "Package Metadata", overwrite: true },
          { path: "README.md", label: "Documentation", overwrite: true },
        ],
      },
    ],
  ],
};
