---
title: Web UI
description:
  The device serves ESPHome web server v3 with a custom www.js: Screen preview, Settings, and Logs tabs.
---

# Web UI

The firmware enables **ESPHome web server v3** on port 80. The stock React shell is loaded from `oi.esphome.io`, while **layout and behaviour** come from a custom script hosted on GitHub Pages (`js_url` in `device.yaml`) so the panel gets a tailored UI without reflashing for every text change.

Open **`http://<device-ip>/`** in a desktop or mobile browser.

## Tabs

### Screen

- **Live preview** at roughly the panel’s aspect ratio (1024×600), including top bar (clock, temperatures when enabled).
- **Add / remove / reorder** buttons with drag-and-drop. Empty slots show an add control.
- **Per-button editor** (entity ID, optional label, icon, optional sensor + unit for readouts) when a slot is selected.

The UI keeps **20 slots** (`NUM_SLOTS` in `www.js`). Entity and label changes are sent to the ESPHome REST endpoints (`/text/.../set`, `/select/.../set`, etc.).

### Settings

Grouped to match ESPHome **sorting groups** in firmware:

- **Button Configuration** — shared **Button Order** (comma-separated slot indices, e.g. `3,1,2,4`), per-button fields, **Button On/Off Color**
- **Display Configuration** — indoor/outdoor temperature toggles and entity IDs, **Presence Sensor Entity** for screensaver wake
- **Brightness** — **Clock: Timezone** (for sunrise/sunset), **Screen: Daytime / Nighttime Brightness**, diagnostic **Sunrise** / **Sunset** text
- **Screensaver** — **Screensaver Timeout** (30–1800 seconds, step 30)
- **Firmware** — version line, **Auto Update**, **Update Frequency**, **Check for Update**

### Logs

- Streams the device log with level-based colouring (same family as ESPHome’s web log viewer).

## Apply Configuration

The **Apply Configuration** button triggers an ESPHome **restart** entity so persisted template values reload cleanly. Use it after bulk changes if something does not apply live.

## Related

- [Buttons & Icons](/buttons-and-icons) — Auto icon domains and icon list
- [Firmware Updates](/firmware-updates) — manifest URL and HA entities
