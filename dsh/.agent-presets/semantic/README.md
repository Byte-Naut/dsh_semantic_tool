# Semantic Agent Preset

This pre-packaged Agent Preset encapsulates the Software Semantic Harness capabilities into an isolated, per-session agent configuration.

## Features

- **Full coding agent foundation**: Persona, shell execution, filesystem inspection/editing, background jobs, goals, planning mode, and workflows.
- **Dedicated semantic tools**: Exposes `software_semantic_slice` and `software_semantic_assure` without polluting standard or minimal presets.
- **Bundled skill**: Automatically mounts `software-semantic-design` from the local `skills/` directory without requiring global skill installation.
- **Zero Host profile pollution**: Runs per-session; does not require patching global `cordis.patch.yml`.

## How to Install

Copy this directory into your dsh user presets root (`~/.dsh/.agent-presets/semantic`):

### Linux / macOS

```sh
cp -r dsh/.agent-presets/semantic ~/.dsh/.agent-presets/semantic
```

### Windows PowerShell

```powershell
Copy-Item -Recurse -Force "dsh\.agent-presets\semantic" "$HOME\.dsh\.agent-presets\semantic"
```

## Launch

Start a dsh session with this preset:

```sh
dsh web --preset semantic
```

Or select **Semantic Coding Agent** from the Preset selector in the dsh Web GUI.
