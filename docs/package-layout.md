---
title: Package layout
description:
  How guition-esp32-p4-jc1060p470/package.yaml orders ESPHome includes — device, assets, config, addons, then LVGL screens.
---

# Package layout

The main manifest is [`guition-esp32-p4-jc1060p470/package.yaml`](https://github.com/jtenniswood/espcontrol/blob/main/guition-esp32-p4-jc1060p470/package.yaml). ESPHome merges packages in declaration order; comments in the file document **why** the sequence matters.

## Load order (summary)

1. **Device & assets** — `device/device.yaml`, fonts, icons, `device/lvgl_base.yaml`, `theme/button.yaml`
2. **User-configurable templates** — `config/button.yaml`, `config/display.yaml`, twenty × `config/button_template.yaml` with `vars: { num: "N" }`
3. **Addons** — connectivity, time, backlight, backlight schedule, network, firmware update
4. **LVGL screens** — **loading** first (required first page), then WiFi setup, then button setup
5. **Main UI** — `device/lvgl.yaml`, `device/sensors.yaml`

## Folders

| Folder | Role |
| --- | --- |
| `addon/` | WiFi, time, backlight, network, OTA update automation |
| `assets/` | LVGL fonts and Material Design icon font glyphs |
| `config/` | Template entities exposed to HA and the web UI |
| `device/` | Board pins, display/touch, LVGL pages, scripts |
| `theme/` | Button styles and shared LVGL theming |

The root [`esphome.yaml`](https://github.com/jtenniswood/espcontrol/blob/main/guition-esp32-p4-jc1060p470/esphome.yaml) only sets substitutions, WiFi, and the remote **`packages.setup`** include — everything else comes from this tree.
