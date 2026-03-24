---
title: Install
description:
  Add the Espcontrol package to ESPHome, set WiFi secrets, flash the Guition ESP32-P4 JC1060P470, then open the device web UI.
---

# Install

Espcontrol is distributed as an **ESPHome package** from this repository. You edit a small root `esphome.yaml` (device name, WiFi, package URL), compile, and flash the Guition **ESP32-P4 JC1060P470** board.

## What you need

- **Guition ESP32-P4 JC1060P470** (7" display)
- **USB-C cable** (data-capable) for flashing
- **[ESPHome](https://esphome.io/)** (dashboard or CLI)
- **[Home Assistant](https://www.home-assistant.io/)** on your network (for API, time, and entities)
- WiFi **SSID and password** in ESPHome secrets

## 1. Create the device config

Copy the template from the repo’s [`esphome.yaml`](https://github.com/jtenniswood/espcontrol/blob/main/guition-esp32-p4-jc1060p470/esphome.yaml) and adjust:

- `substitutions.name` — ESPHome hostname (e.g. `my-panel`)
- `substitutions.friendly_name` — human-readable name
- `wifi` — use `!secret wifi_ssid` and `!secret wifi_password` (or inline values)

The **packages** block pulls the full firmware from GitHub:

```yaml
packages:
  setup:
    url: https://github.com/jtenniswood/espcontrol/
    file: guition-esp32-p4-jc1060p470/package.yaml
    refresh: 1sec
```

Use a short `refresh` while developing; you can increase it later.

## 2. Flash the firmware

1. Connect the panel via USB-C.
2. In the ESPHome dashboard, create or import the YAML above, then **Install** to the serial port.
3. On first boot you should see the **loading** LVGL page, then WiFi connection.

If WiFi fails, the device exposes a **fallback hotspot** and **captive portal** so you can enter credentials from a phone or laptop (see on-screen instructions).

## 3. Add to Home Assistant

When the device is online, Home Assistant should discover it via the ESPHome integration. Complete pairing so the **API**, **time sync**, and **entity controls** work.

## 4. Open the web UI

1. Note the device IP (router DHCP list, ESPHome log, or on-screen URL when no buttons are configured).
2. Browse to `http://<device-ip>/`.
3. Configure **buttons**, **appearance**, **temperatures**, **screensaver**, **backlight**, and **firmware** from the tabs.
4. Use **Apply Configuration** (restart) when you need a full config reload from persisted entities.

## Troubleshooting

- **No web UI styling** — the device loads custom JS from GitHub Pages (`js_url` in firmware). Ensure the device can reach the internet, or check [Hardware](/hardware-architecture) for the URL.
- **YAML errors after a repo update** — run **Validate** in ESPHome; breaking changes are rare but `refresh: 1sec` helps you pick up fixes quickly.

Next: [Web UI](/web-ui).
