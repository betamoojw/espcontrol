---
title: Package layout
description:
  How Espcontrol organises shared and device-specific ESPHome packages — common assets, config, and addons shared across devices, with per-device hardware, LVGL screens, and themes.
---

# Package layout

Each device has its own manifest at `devices/<slug>/packages.yaml`. ESPHome merges packages in declaration order; comments in the file document **why** the sequence matters.

Shared resources (fonts, icons, config templates, generic addons) live under [`common/`](https://github.com/jtenniswood/espcontrol/tree/main/common) and are included via relative paths.

## Load order (summary)

1. **Device & assets** — `device/device.yaml`, `common/assets/fonts.yaml`, `common/assets/icons.yaml`, `device/lvgl_base.yaml`, `theme/button.yaml`
2. **User-configurable templates** — `common/config/button.yaml`, `common/config/display.yaml`, N × `common/config/button_template.yaml` with `vars: { num: "N" }` (9, 12, or 20 depending on device grid)
3. **Addons** — connectivity (device-specific), time, backlight, backlight schedule, network, firmware update (from `common/addon/`)
4. **LVGL screens** — **loading** first (required first page), then WiFi setup, then button setup
5. **Main UI** — `device/lvgl.yaml`, `device/sensors.yaml`

## Folders

| Folder | Role |
| --- | --- |
| `common/addon/` | Shared addons: time, backlight, network, OTA update |
| `common/assets/` | LVGL fonts and Material Design icon font glyphs |
| `common/config/` | Template entities exposed to HA and the web UI |
| `devices/<slug>/addon/` | Device-specific addons (e.g. connectivity / page navigation) |
| `devices/<slug>/device/` | Board pins, display/touch, LVGL pages, scripts |
| `devices/<slug>/theme/` | Button styles and shared LVGL theming |

Each device's `esphome.yaml` (e.g. [JC1060P470](https://github.com/jtenniswood/espcontrol/blob/main/devices/guition-esp32-p4-jc1060p470/esphome.yaml), [JC4880P443](https://github.com/jtenniswood/espcontrol/blob/main/devices/guition-esp32-p4-jc4880p443/esphome.yaml)) only sets substitutions, WiFi, and the remote **`packages.setup`** include — everything else comes from this tree.
