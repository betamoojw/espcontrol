---
title: Espcontrol — Home Assistant touch control panel
titleTemplate: :title
description:
  7-inch ESP32-P4 touchscreen running ESPHome and LVGL: up to 20 Home Assistant buttons, web-based configuration, OTA firmware updates.
---

# Espcontrol

**Espcontrol** is firmware for the **Guition ESP32-P4 JC1060P470** (7", 1024×600) touch display. It runs [ESPHome](https://esphome.io/) with an [LVGL](https://lvgl.io/)-based UI and talks to [Home Assistant](https://www.home-assistant.io/) over the native API. You get up to **20 configurable buttons** that can toggle or control any exposed entity, plus a status bar (clock, indoor/outdoor temperature), screensaver, backlight control, and **over-the-air updates**. After the first flash, almost everything is configured in the **built-in web UI** at `http://<device-ip>` — no YAML edits for day-to-day changes.

**Full documentation:** this site. **Source and issues:** [github.com/jtenniswood/espcontrol](https://github.com/jtenniswood/espcontrol).

## Features

- **20 button slots** — bind any Home Assistant entity (lights, switches, fans, locks, covers, media players, and more)
- **Drag-and-drop ordering** — reorder buttons from the web UI; order is stored in the **Button Order** text entity
- **Large icon set** — per-button icon dropdown (Material Design Icons), plus **Auto** mode that picks an icon from the entity domain when possible
- **Optional labels** — or leave blank to use the entity’s friendly name from Home Assistant
- **Configurable on/off button colours** (hex)
- **Indoor and outdoor temperature** in the top bar from any HA sensor entities
- **Clock** — synced from Home Assistant
- **Screensaver** — idle timeout (30s–30min in 30s steps); optional presence sensor to wake the display
- **Backlight** — manual brightness plus optional **day/night** levels based on calculated sunrise/sunset for the selected timezone
- **OTA firmware updates** — manifest hosted on GitHub Pages; control via Home Assistant entities
- **Captive portal** — WiFi setup if the configured network is unavailable
- **On-device setup screens** — WiFi and initial button configuration when needed

## Where to buy

- **Panel:** [AliExpress](https://s.click.aliexpress.com/e/_c335W0r5) (affiliate link, ~£40)
- **Desk stand (3D printable):** [MakerWorld](https://makerworld.com/en/models/2387421-guition-esp32p4-jc1060p470-7inch-screen-desk-mount#profileId-2614995)

## Next steps

- [Install](/install) — ESPHome package, secrets, flash, first boot
- [Web UI](/web-ui) — Screen, Settings, and Logs tabs
