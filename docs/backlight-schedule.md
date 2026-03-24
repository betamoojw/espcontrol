---
title: Backlight Schedule
description:
  Daytime and nighttime brightness using sunrise and sunset calculated from the selected timezone coordinates and Home Assistant time.
---

# Backlight Schedule

Day/night backlight behaviour is implemented in [`addon/backlight_schedule.yaml`](https://github.com/jtenniswood/espcontrol/blob/main/guition-esp32-p4-jc1060p470/addon/backlight_schedule.yaml) together with [`addon/time.yaml`](https://github.com/jtenniswood/espcontrol/blob/main/guition-esp32-p4-jc1060p470/addon/time.yaml) and the **`espcontrol`** C++ helpers (see [External component](/external-component)).

## Home Assistant time

- **`time` platform `homeassistant`** — `id: ha_time` drives the on-screen clock and provides valid local time for sunrise/sunset math.

## Timezone select

- **Clock: Timezone** — large template **select** listing regions with GMT offsets in the label (e.g. `Europe/London (GMT+0)`). The firmware strips the parenthetical part for coordinate lookup and offset parsing.

Changing time sync or timezone triggers **`backlight_recalc_sunrise_sunset`**, which:

1. Resolves **latitude / longitude** for the IANA zone from the lookup table in `sun_calc.h`
2. Computes **sunrise and sunset** for the current calendar date
3. Publishes human-readable times to **Screen: Sunrise** and **Screen: Sunset** text sensors
4. Sets **`sunrise_sunset_valid`** and reapplies brightness

## Day vs night brightness

- **Screen: Daytime Brightness** — 10–100%, step 5, default 100
- **Screen: Nighttime Brightness** — 10–100%, step 5, default 75

**`backlight_apply_brightness`** chooses **day** or **night** percentage from whether the current time (in minutes from midnight) falls between sunrise and sunset, then applies it to the display backlight with a short transition.

If sunrise/sunset is invalid (unknown timezone coordinates), the firmware uses **daytime** brightness only.

## Periodic updates

An **interval** runs every **60s** to detect **crossing** between day and night windows and reapply brightness. At **local midnight**, sunrise/sunset is **recalculated** for the new date.

## Screensaver interaction

While the display is considered asleep (`display_asleep`), scheduled brightness application is skipped so the screensaver state is not overridden.
