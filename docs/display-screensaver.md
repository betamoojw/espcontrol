---
title: Display & Screensaver
description:
  Indoor and outdoor temperature entities, screensaver idle timeout, optional presence wake, and backlight integration.
---

# Display & Screensaver

Display-related settings are driven by template entities in [`config/display.yaml`](https://github.com/jtenniswood/espcontrol/blob/main/guition-esp32-p4-jc1060p470/config/display.yaml) and scripts in [`addon/backlight.yaml`](https://github.com/jtenniswood/espcontrol/blob/main/guition-esp32-p4-jc1060p470/addon/backlight.yaml). They appear under **Display Configuration**, **Screensaver**, and related groups in the web UI and in Home Assistant.

## Temperature row

- **Indoor Temp Enable** / **Outdoor Temp Enable** — show or hide the temperature area in the top bar
- **Indoor Temp Entity** / **Outdoor Temp Entity** — any **sensor** entity id whose state is shown (formatting depends on firmware LVGL labels)

When both are enabled, the UI can show two values (e.g. `22° / 8°` style); with one enabled, a single value.

## Screensaver idle timeout

- **Screensaver Timeout** — number entity, **30–1800** seconds, step **30**, default **300** (5 minutes)

When the idle timer elapses, the firmware runs the screensaver path: marks the display asleep, turns off the backlight light component, and **pauses LVGL with snow effect** (`screensaver_idle_check` script in `backlight.yaml`).

## Presence wake

- **Presence Sensor Entity** — optional **binary_sensor** (e.g. mmWave). When configured, motion can **wake** the display from the screensaver via the `screensaver_wake` script (touch wake is also handled in `device.yaml`).

## Setup screen dim

On static **setup** LVGL pages, a separate **120s** timer dims the backlight to **50%** for burn-in protection (`setup_screen_dim` in `backlight.yaml`), independent of the main screensaver timeout.

## Related

- [Backlight schedule](/backlight-schedule) — day/night brightness and sunrise/sunset
