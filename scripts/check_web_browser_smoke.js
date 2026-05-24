#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const WEB_OUTPUT_DIR = path.join(ROOT, "docs", "public", "webserver");
const FAILURE_DIR = path.join(ROOT, ".cache", "web-browser-smoke");

const CASES = [
  {
    name: "landscape",
    slug: "guition-esp32-p4-jc8012p4a1",
    viewport: { width: 1280, height: 900 },
  },
  {
    name: "portrait",
    slug: "guition-esp32-p4-jc4880p443",
    viewport: { width: 1100, height: 1000 },
  },
  {
    name: "square",
    slug: "esp32-p4-86",
    viewport: { width: 1000, height: 900 },
  },
];

const BUTTON_FIXTURES = [
  "light.kitchen;Kitchen;Lightbulb;Lightbulb",
  "sensor.energy;Energy;Gauge;Auto;sensor.energy;W;sensor;0",
  "climate.hall;Hall;Thermostat;Auto;;;climate;;",
];

function htmlFor(slug) {
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    `<title>${slug}</title>`,
    "</head>",
    "<body>",
    "<esp-app></esp-app>",
    `<script src="/webserver/${slug}/www.js"></script>`,
    "</body>",
    "</html>",
  ].join("");
}

function routeContentType(url) {
  if (/\.css(?:$|\?)/.test(url)) return "text/css";
  if (/\.(?:png|jpg|jpeg|gif|webp|svg)(?:$|\?)/.test(url)) return "image/svg+xml";
  return "text/plain";
}

async function installRoutes(context, slug) {
  const scriptPath = path.join(WEB_OUTPUT_DIR, slug, "www.js");
  assert(fs.existsSync(scriptPath), `${slug}: generated web UI does not exist at ${scriptPath}`);

  await context.route("**/*", async (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.hostname === "espcontrol.test" && requestUrl.pathname === `/${slug}`) {
      await route.fulfill({ status: 200, contentType: "text/html", body: htmlFor(slug) });
      return;
    }
    if (requestUrl.hostname === "espcontrol.test" && requestUrl.pathname === `/webserver/${slug}/www.js`) {
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: fs.readFileSync(scriptPath, "utf8"),
      });
      return;
    }
    if (requestUrl.hostname === "espcontrol.test") {
      await route.fulfill({ status: 204, contentType: "text/plain", body: "" });
      return;
    }
    await route.fulfill({ status: 200, contentType: routeContentType(requestUrl.pathname), body: "" });
  });
}

async function installFakeEventSource(page) {
  await page.addInitScript(() => {
    window.__eventSources = [];
    window.__seedEspState = function (events) {
      if (!window.__eventSources.length) throw new Error("No EventSource instance was created");
      var source = window.__eventSources[0];
      events.forEach(function (event) {
        source.dispatch("state", { data: JSON.stringify(event) });
      });
    };

    window.EventSource = class FakeEventSource {
      constructor(url) {
        this.url = url;
        this.readyState = 0;
        this.listeners = {};
        window.__eventSources.push(this);
        setTimeout(() => {
          this.readyState = 1;
          this.dispatch("open", {});
        }, 0);
      }

      addEventListener(type, listener) {
        if (!this.listeners[type]) this.listeners[type] = [];
        this.listeners[type].push(listener);
      }

      close() {
        this.readyState = 2;
      }

      dispatch(type, event) {
        (this.listeners[type] || []).forEach((listener) => listener(event));
      }
    };
  });
}

function seededEvents() {
  const events = [
    { id: "text-button_order", state: "1,2,3" },
    { id: "text-button_on_color", state: "FF8C00" },
    { id: "text-button_off_color", state: "313131" },
    { id: "text-sensor_card_color", state: "212121" },
    { id: "switch-screen__clock_bar", state: "ON", value: true },
    { id: "switch-screen__network_status_icon", state: "ON", value: true },
  ];
  BUTTON_FIXTURES.forEach((state, index) => {
    events.push({ id: `text-button_${index + 1}_config`, state });
  });
  return events;
}

function assertNoLayoutBreaks(result, label) {
  assert(result.appVisible, `${label}: #sp-app should be visible`);
  assert(result.screenVisible, `${label}: .sp-screen should be visible`);
  assert(result.mainVisible, `${label}: .sp-main should be visible`);
  assert(result.applyVisible, `${label}: apply controls should be visible`);
  assert(result.gridChildren > 0, `${label}: grid should render cells`);
  assert(result.visibleGridChildren > 0, `${label}: grid cells should have visible size`);
  assert(result.visibleCards >= 3, `${label}: seeded cards should render`);
  assert.strictEqual(result.outsideGrid.length, 0, `${label}: grid children overflowed the preview: ${result.outsideGrid.join(", ")}`);
  assert.strictEqual(result.overlaps.length, 0, `${label}: grid children overlapped: ${result.overlaps.join(", ")}`);
  assert(
    result.documentScrollWidth <= result.windowWidth + 1,
    `${label}: page has horizontal overflow (${result.documentScrollWidth}px > ${result.windowWidth}px)`
  );
}

async function measureCoreLayout(page) {
  return page.evaluate(() => {
    function rectFor(el) {
      if (!el) return null;
      var r = el.getBoundingClientRect();
      return {
        left: r.left,
        top: r.top,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      };
    }
    function visible(rect) {
      return !!rect && rect.width > 1 && rect.height > 1;
    }
    function overlap(a, b) {
      var width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      var height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      return width > 1 && height > 1;
    }

    var app = document.querySelector("#sp-app");
    var screen = document.querySelector(".sp-screen");
    var main = document.querySelector(".sp-main");
    var apply = document.querySelector(".sp-apply-btn");
    var mainRect = rectFor(main);
    var children = Array.from(document.querySelectorAll(".sp-main > *")).map(function (el, index) {
      return { index: index, className: el.className, rect: rectFor(el) };
    });
    var visibleChildren = children.filter(function (child) { return visible(child.rect); });
    var outsideGrid = visibleChildren.filter(function (child) {
      var r = child.rect;
      return r.left < mainRect.left - 1 ||
        r.top < mainRect.top - 1 ||
        r.right > mainRect.right + 1 ||
        r.bottom > mainRect.bottom + 1;
    }).map(function (child) { return String(child.index); });
    var overlaps = [];
    for (var i = 0; i < visibleChildren.length; i++) {
      for (var j = i + 1; j < visibleChildren.length; j++) {
        if (overlap(visibleChildren[i].rect, visibleChildren[j].rect)) {
          overlaps.push(visibleChildren[i].index + "/" + visibleChildren[j].index);
        }
      }
    }

    return {
      appVisible: visible(rectFor(app)),
      screenVisible: visible(rectFor(screen)),
      mainVisible: visible(mainRect),
      applyVisible: visible(rectFor(apply)),
      gridChildren: children.length,
      visibleGridChildren: visibleChildren.length,
      visibleCards: document.querySelectorAll(".sp-main > .sp-btn").length,
      outsideGrid: outsideGrid,
      overlaps: overlaps,
      documentScrollWidth: document.documentElement.scrollWidth,
      windowWidth: window.innerWidth,
    };
  });
}

async function assertSettingsPage(page, label) {
  await page.getByRole("tab", { name: "Settings" }).click();
  await page.waitForSelector("#sp-settings.sp-page.active");
  const settingsVisible = await page.locator("#sp-settings").isVisible();
  const appearanceVisible = await page.locator("text=Appearance").first().isVisible();
  if (!(await page.locator("#sp-set-on-color").isVisible())) {
    await page.getByText("Appearance", { exact: true }).click();
  }
  const onColorVisible = await page.locator("#sp-set-on-color").isVisible();
  assert(settingsVisible, `${label}: settings page should be visible`);
  assert(appearanceVisible, `${label}: settings content should render`);
  assert(onColorVisible, `${label}: appearance controls should render`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  assert(!overflow, `${label}: settings page has horizontal overflow`);
  await page.getByRole("tab", { name: "Screen" }).click();
  await page.waitForSelector("#sp-screen.sp-page.active");
}

async function assertEmptyCellSettings(page, label) {
  const emptyCell = page.locator(".sp-empty-cell").first();
  await emptyCell.click();
  await page.waitForSelector(".sp-settings-overlay.sp-visible");
  const modalLayout = await page.evaluate(() => {
    var modal = document.querySelector(".sp-settings-modal");
    var rect = modal.getBoundingClientRect();
    return {
      visible: rect.width > 1 && rect.height > 1,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      documentScrollWidth: document.documentElement.scrollWidth,
    };
  });
  assert(modalLayout.visible, `${label}: card settings modal should be visible`);
  assert(modalLayout.left >= -1 && modalLayout.right <= modalLayout.windowWidth + 1, `${label}: card settings modal overflows horizontally`);
  assert(modalLayout.top < modalLayout.windowHeight && modalLayout.bottom > 0, `${label}: card settings modal is outside the viewport`);
  assert(
    modalLayout.documentScrollWidth <= modalLayout.windowWidth + 1,
    `${label}: card settings modal introduced horizontal overflow`
  );
}

async function runCase(browser, testCase) {
  const context = await browser.newContext({ viewport: testCase.viewport });
  await installRoutes(context, testCase.slug);
  const page = await context.newPage();
  const errors = [];

  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await installFakeEventSource(page);

  try {
    await page.goto(`http://espcontrol.test/${testCase.slug}?events=1`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#sp-app");
    await page.waitForFunction(() => window.__eventSources && window.__eventSources.length > 0);
    await page.evaluate((events) => window.__seedEspState(events), seededEvents());
    await page.waitForSelector(".sp-main > .sp-btn");
    await page.waitForTimeout(100);

    assert.deepStrictEqual(errors, [], `${testCase.name}: browser errors were reported`);
    assertNoLayoutBreaks(await measureCoreLayout(page), testCase.name);
    await assertSettingsPage(page, testCase.name);
    assertNoLayoutBreaks(await measureCoreLayout(page), `${testCase.name} after settings`);
    await assertEmptyCellSettings(page, testCase.name);
  } catch (error) {
    fs.mkdirSync(FAILURE_DIR, { recursive: true });
    await page.screenshot({ path: path.join(FAILURE_DIR, `${testCase.name}-${testCase.slug}.png`), fullPage: true });
    throw error;
  } finally {
    await context.close();
  }
}

(async function main() {
  const browser = await chromium.launch();
  try {
    for (const testCase of CASES) {
      await runCase(browser, testCase);
    }
  } finally {
    await browser.close();
  }
  console.log(`Browser web smoke checks passed for ${CASES.length} generated layouts.`);
})().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
