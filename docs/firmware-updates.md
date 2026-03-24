---
title: Firmware Updates
description:
  HTTP update platform pointing at GitHub Pages, with Home Assistant entities for auto-update, frequency, and manual check.
---

# Firmware Updates

OTA behaviour is defined in [`addon/firmware_update.yaml`](https://github.com/jtenniswood/espcontrol/blob/main/guition-esp32-p4-jc1060p470/addon/firmware_update.yaml).

## Update source

The device uses ESPHome’s **`update`** platform **`http_request`** with:

```text
source: https://jtenniswood.github.io/espcontrol/firmware/manifest.json
```

That URL must exist on **GitHub Pages** for the `espcontrol` repository. The docs site build copies static assets from `docs/public` into the site root; release **artifacts** can be merged into `docs/.vitepress/dist/firmware/` in CI (see workflow) so `manifest.json` and `*.bin` files are published alongside the documentation.

Until a release publishes a compatible manifest, the URL may return **404** — plan updates accordingly.

## Project version

- `esphome.project` is set to **`jtenniswood.espcontrol`** with version from substitution **`firmware_version`** (default **`dev`** in tree).
- **Firmware: Version** text sensor exposes the running build string.

## Home Assistant entities

| Entity | Role |
| --- | --- |
| **Firmware: Auto Update** | When on, available updates can be installed automatically (subject to interval logic). |
| **Firmware: Update Frequency** | `Hourly`, `Daily`, `Weekly`, or `Monthly` — scales how often the hourly tick actually calls `update()` (counter modulo threshold). |
| **Firmware: Check for Update** | Button — forces a check; uses a short internal flag so auto-install rules still apply only when appropriate. |

Standard ESPHome **`update`** entities may also appear for the HTTP update platform depending on your HA version.

## Manual compile / flash

For local development, bump **`firmware_version`** in YAML or use ESPHome’s compile output as usual; GitHub-hosted OTA is optional for developers who flash over USB.

## Related

- [Install](/install) — first-time flashing
