---
title: Hardware & connectivity
description:
  ESP32-P4 application MCU, ESP32-C6 hosted WiFi, MIPI DSI display, GT911 touch, PSRAM, web server v3 with hosted www.js.
---

# Hardware & connectivity

This firmware targets the **Guition ESP32-P4 JC1060P470** module: **ESP32-P4** for application code and display, plus **ESP32-C6** for WiFi via **ESP32 Hosted** (`esp32_hosted` in [`device/device.yaml`](https://github.com/jtenniswood/espcontrol/blob/main/guition-esp32-p4-jc1060p470/device/device.yaml)).

## MCU and memory

- **ESP32-P4** — ESP-IDF framework, **16MB** flash, CPU **360MHz**, experimental IDF features enabled as required by the board support package
- **PSRAM** — hex mode, **200MHz**, for framebuffers / LVGL
- **ESP32-C6** — secondary chip for **WiFi** connectivity (reset/cmd/clk/data pins defined in YAML)

## Display and touch

- **MIPI DSI** display, model **JC1060P470**, **RGB**, LVGL-driven UI (`rotation: 0`)
- **GT911** touchscreen on **I2C** with reset and interrupt pins; **on_touch** wakes the screensaver script

## Backlight

- **LEDC** PWM on **GPIO23** driving a **monochromatic** `light` entity **Display Backlight**

## Network stack

- **WiFi** through hosted mode (see `esp32_hosted` block)
- **OTA** — `esphome` and `http_request` platforms for standard and HTTP-based updates
- **API** — Home Assistant native API with `homeassistant_states: true`
- **`http_request`** client — used by the firmware update component

## Web interface

- **`web_server`** port **80**, **version: 3**
- **`js_url`** — `https://jtenniswood.github.io/espcontrol/webserver/www.js`

The device fetches that script from **GitHub Pages** on each load so you can iterate the control UI without rebuilding firmware for every JS change. The script loads the stock ESPHome v3 bundle from `oi.esphome.io` for API compatibility, then injects the custom **Screen / Settings / Logs** UI.

## External components

The config pulls the **`espcontrol`** component from the same GitHub repo for sunrise/sunset math — see [External component](/external-component).
