---
title: Buttons & Icons
description:
  Twenty button slots, Home Assistant entities, optional labels, Material Design icon picker, and Auto mode by domain.
---

# Buttons & Icons

The firmware defines **20 button slots** (`btn_1` … `btn_20` in [`package.yaml`](https://github.com/jtenniswood/espcontrol/blob/main/guition-esp32-p4-jc1060p470/package.yaml)). Each slot has template entities for:

| Purpose | Entity name pattern |
| --- | --- |
| Target HA entity | `Button N Entity` |
| Optional label (max 30 chars) | `Button N Label` |
| Optional sensor value | `Button N Sensor` / `Button N Sensor Unit` |
| Icon | `Button N Icon` (select) |

Shared settings live under **Button Configuration**:

- **Button On Color** / **Button Off Color** — 6-character hex (no `#`), defaults `FF8C00` / `313131`
- **Button Order** — comma-separated slot numbers (`1`–`20`) controlling display order; the web UI updates this when you drag buttons

If **Label** is empty, the UI shows the **entity id** or a **Configure** placeholder until an entity is set.

## Auto icon

When **Icon** is **Auto**, the custom web UI resolves the icon from the **entity domain** (part before the first `.`):

| Domain | Auto icon (MDI name) |
| --- | --- |
| `light` | lightbulb |
| `switch` | power-plug |
| `fan` | fan |
| `lock` | lock |
| `cover` | blinds-horizontal |
| `climate` | air-conditioner |
| `media_player` | speaker |
| `camera` | camera |
| `binary_sensor` | motion-sensor |

Any other domain falls back to **cog**. On the LVGL device, the same logic uses glyphs from [`assets/icons.yaml`](https://github.com/jtenniswood/espcontrol/blob/main/guition-esp32-p4-jc1060p470/assets/icons.yaml).

## Icon picker list

The **select** options for each **Button N Icon** are defined in [`config/button_template.yaml`](https://github.com/jtenniswood/espcontrol/blob/main/guition-esp32-p4-jc1060p470/config/button_template.yaml). There are **many** named choices (Material Design Icons **v7.4.47**), including lighting, climate, security, weather, media, and more — not a fixed count of 19. The on-device font in `icons.yaml` includes the glyph codepoints needed for the LVGL UI; the web preview uses the CDN stylesheet referenced in `www.js`.

If you need an icon that is not in the list, [open an issue](https://github.com/jtenniswood/espcontrol/issues) with the MDI name and use case.

## Sensors on buttons

Optional **sensor** + **unit** fields let a button show a numeric readout (e.g. temperature) alongside the icon and label, when implemented in the LVGL layout for that slot.
