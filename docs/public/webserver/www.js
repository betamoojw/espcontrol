// Load the original ESPHome webserver v3 React app
(function () {
  var s = document.createElement("script");
  s.src = "https://oi.esphome.io/v3/www.js";
  document.head.appendChild(s);
})();

// Custom UI: two-page layout (Settings / Logs) with dynamic button management
(function () {
  var NUM_SLOTS = 20;

  var ICON_MAP = {
    Auto: "cog",
    Lightbulb: "lightbulb",
    "Power Plug": "power-plug",
    Fan: "fan",
    Lock: "lock",
    Garage: "garage",
    "Blinds Open": "blinds-horizontal",
    "Blinds Closed": "blinds-horizontal-closed",
    Thermometer: "thermometer",
    Speaker: "speaker",
    Television: "television",
    Camera: "camera",
    "Motion Sensor": "motion-sensor",
    Door: "door",
    "Window": "window-open-variant",
    "Water Heater": "water-boiler",
    "Air Conditioner": "air-filter",
    Battery: "battery",
    "LED Strip": "led-strip",
    Power: "power",
  };

  var DOMAIN_ICONS = {
    light: "lightbulb",
    switch: "power-plug",
    fan: "fan",
    lock: "lock",
    cover: "blinds-horizontal",
    climate: "air-filter",
    media_player: "speaker",
    camera: "camera",
    binary_sensor: "motion-sensor",
  };

  var ICON_OPTIONS = [
    "Auto",
    "Lightbulb",
    "Power Plug",
    "Fan",
    "Lock",
    "Garage",
    "Blinds Open",
    "Blinds Closed",
    "Thermometer",
    "Speaker",
    "Television",
    "Camera",
    "Motion Sensor",
    "Door",
    "Window",
    "Water Heater",
    "Air Conditioner",
    "Battery",
    "LED Strip",
    "Power",
  ];

  var CSS =
    "#sp-app{font-family:Roboto,sans-serif;color:#e0e0e0;max-width:600px;margin:0 auto}" +
    ".sp-header{display:flex;background:#1a1a1a;border-bottom:1px solid #333;" +
    "position:sticky;top:0;z-index:100;border-radius:0 0 8px 8px;overflow:hidden}" +
    ".sp-tab{flex:1;padding:14px 0;text-align:center;color:#888;cursor:pointer;" +
    "font-size:14px;font-weight:500;border-bottom:2px solid transparent;transition:all .2s}" +
    ".sp-tab:hover{color:#bbb}" +
    ".sp-tab.active{color:#fff;border-bottom-color:#03a9f4}" +
    ".sp-page{display:none}.sp-page.active{display:block}" +
    ".sp-wrap{display:flex;justify-content:center;padding:20px 16px 4px}" +
    ".sp-screen{width:100%;max-width:480px;aspect-ratio:1024/600;background:#000;" +
    "border-radius:10px;position:relative;overflow:hidden;" +
    "box-shadow:0 2px 20px rgba(0,0,0,.35);border:2px solid #1a1a1a;" +
    "container-type:inline-size;font-family:Roboto,sans-serif;user-select:none}" +
    ".sp-topbar{position:absolute;top:0;left:0;right:0;height:4.1cqw;" +
    "display:flex;align-items:center;padding:0.78cqw;z-index:1}" +
    ".sp-temp{color:#fff;font-size:1.95cqw;white-space:nowrap;opacity:0;transition:opacity .3s}" +
    ".sp-temp.sp-visible{opacity:1}" +
    ".sp-clock{position:absolute;left:50%;transform:translateX(-50%);" +
    "color:#fff;font-size:1.95cqw;white-space:nowrap}" +
    ".sp-main{position:absolute;top:4.1cqw;left:0.49cqw;right:0.49cqw;bottom:0.49cqw;" +
    "display:flex;flex-wrap:wrap;align-content:flex-start;gap:0.98cqw;padding:0.49cqw}" +
    ".sp-btn{width:19cqw;height:12.7cqw;border-radius:0.78cqw;padding:1.37cqw;" +
    "display:flex;flex-direction:column;justify-content:space-between;" +
    "cursor:pointer;transition:all .2s;box-sizing:border-box;border:2px solid transparent}" +
    ".sp-btn:hover{filter:brightness(1.15)}" +
    ".sp-btn.sp-selected{border-color:#03a9f4}" +
    ".sp-btn-icon{font-size:4.69cqw;line-height:1;color:#fff}" +
    ".sp-btn-label{font-size:1.8cqw;line-height:1.2;color:#fff;" +
    "white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".sp-add-btn{border:2px dashed #444;background:transparent !important;" +
    "display:flex;align-items:center;justify-content:center;cursor:pointer}" +
    ".sp-add-btn:hover{border-color:#03a9f4}" +
    ".sp-add-icon{font-size:5cqw;color:#555}" +
    ".sp-hint{text-align:center;font-size:11px;opacity:.4;padding:6px 0 12px}" +
    ".sp-config{padding:0 16px 16px}" +
    ".sp-section-title{font-size:13px;font-weight:500;color:#888;" +
    "margin:16px 0 8px;text-transform:uppercase;letter-spacing:0.5px}" +
    ".sp-list{list-style:none;margin:0;padding:0}" +
    ".sp-list-item{display:flex;align-items:center;padding:10px 12px;" +
    "background:#1e1e1e;border-radius:6px;margin-bottom:6px;cursor:pointer;" +
    "border:1px solid #2a2a2a;transition:all .15s}" +
    ".sp-list-item:hover{border-color:#444}" +
    ".sp-list-item.sp-list-selected{border-color:#03a9f4;background:#1a2a3a}" +
    ".sp-list-item.sp-dragging{opacity:.4}" +
    ".sp-list-handle{color:#555;margin-right:10px;cursor:grab;font-size:18px;line-height:1}" +
    ".sp-list-handle:active{cursor:grabbing}" +
    ".sp-list-info{flex:1;min-width:0}" +
    ".sp-list-name{font-size:13px;font-weight:500;white-space:nowrap;" +
    "overflow:hidden;text-overflow:ellipsis}" +
    ".sp-list-entity{font-size:11px;color:#888;white-space:nowrap;" +
    "overflow:hidden;text-overflow:ellipsis;margin-top:2px}" +
    ".sp-list-icon{font-size:20px;margin-right:10px;width:24px;text-align:center;color:#aaa}" +
    ".sp-drop-before{border-top:2px solid #03a9f4 !important}" +
    ".sp-drop-after{border-bottom:2px solid #03a9f4 !important}" +
    ".sp-panel{background:#1e1e1e;border-radius:8px;padding:16px;margin-top:12px;" +
    "border:1px solid #2a2a2a}" +
    ".sp-panel-title{font-size:14px;font-weight:500;margin-bottom:12px}" +
    ".sp-field{margin-bottom:12px}" +
    ".sp-field-label{display:block;font-size:11px;color:#888;margin-bottom:4px;" +
    "text-transform:uppercase;letter-spacing:0.3px}" +
    ".sp-input,.sp-select{width:100%;padding:9px 12px;background:#2a2a2a;" +
    "border:1px solid #444;border-radius:6px;color:#e0e0e0;font-size:14px;" +
    "font-family:inherit;box-sizing:border-box;outline:none;transition:border-color .2s}" +
    ".sp-input:focus,.sp-select:focus{border-color:#03a9f4}" +
    ".sp-select{appearance:auto}" +
    ".sp-btn-row{display:flex;gap:8px;margin-top:16px}" +
    ".sp-action-btn{padding:9px 16px;border:none;border-radius:6px;font-size:13px;" +
    "font-weight:500;cursor:pointer;font-family:inherit;transition:filter .15s}" +
    ".sp-action-btn:hover{filter:brightness(1.15)}" +
    ".sp-delete-btn{background:#d32f2f;color:#fff}" +
    ".sp-apply-bar{padding:16px;text-align:center}" +
    ".sp-apply-btn{background:#03a9f4;color:#fff;border:none;border-radius:6px;" +
    "padding:12px 32px;font-size:14px;font-weight:500;cursor:pointer;" +
    "font-family:inherit;transition:filter .15s}" +
    ".sp-apply-btn:hover{filter:brightness(1.15)}" +
    ".sp-apply-note{font-size:11px;color:#666;margin-top:6px}" +
    ".sp-log-toolbar{display:flex;justify-content:flex-end;padding:12px 16px 0}" +
    ".sp-log-clear{background:#333;color:#ccc;border:none;border-radius:4px;" +
    "padding:6px 14px;font-size:12px;cursor:pointer;font-family:inherit}" +
    ".sp-log-clear:hover{background:#444}" +
    ".sp-log-output{margin:8px 16px 16px;padding:12px;background:#0a0a0a;" +
    "border-radius:8px;font-family:'Courier New',monospace;font-size:12px;" +
    "color:#ccc;height:70vh;overflow-y:auto;white-space:pre-wrap;word-break:break-all;" +
    "border:1px solid #1a1a1a}" +
    ".sp-log-line{padding:1px 0}" +
    ".sp-log-error{color:#ef5350}" +
    ".sp-log-warn{color:#ffa726}" +
    ".sp-log-debug{color:#666}" +
    ".sp-log-verbose{color:#555}" +
    ".sp-empty{text-align:center;padding:24px;color:#666;font-size:13px}" +
    "esp-app.sp-hidden{display:none !important}";

  var state = {
    order: [],
    buttons: [],
    onColor: "FF8C00",
    offColor: "313131",
    selectedSlot: -1,
    activeTab: "settings",
    _indoorOn: false,
    _outdoorOn: false,
  };

  for (var i = 0; i < NUM_SLOTS; i++) {
    state.buttons.push({ entity: "", label: "", icon: "Auto" });
  }

  var els = {};
  var dragSrcPos = -1;

  // ── Helpers ──────────────────────────────────────────────────────────

  function parseOrder(str) {
    if (!str || !str.trim()) return [];
    return str
      .split(",")
      .map(function (s) {
        return parseInt(s.trim(), 10);
      })
      .filter(function (n) {
        return n >= 1 && n <= NUM_SLOTS && !isNaN(n);
      });
  }

  function resolveIcon(slot) {
    var b = state.buttons[slot - 1];
    var sel = b.icon || "Auto";
    if (sel === "Auto" && b.entity) {
      var domain = b.entity.split(".")[0];
      return DOMAIN_ICONS[domain] || "cog";
    }
    return ICON_MAP[sel] || "cog";
  }

  function btnDisplayName(slot) {
    var b = state.buttons[slot - 1];
    return b.label || b.entity || "Configure";
  }

  function postText(entityId, value) {
    fetch("/text/" + entityId + "?value=" + encodeURIComponent(value), {
      method: "POST",
    });
  }

  function postSelect(entityId, option) {
    fetch("/select/" + entityId + "?option=" + encodeURIComponent(option), {
      method: "POST",
    });
  }

  function postButtonPress(entityId) {
    fetch("/button/" + entityId + "/press", { method: "POST" });
  }

  // ── Init ─────────────────────────────────────────────────────────────

  function init() {
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var mdi = document.createElement("link");
    mdi.rel = "stylesheet";
    mdi.href =
      "https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css";
    document.head.appendChild(mdi);

    var roboto = document.createElement("link");
    roboto.rel = "stylesheet";
    roboto.href =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap";
    document.head.appendChild(roboto);

    buildUI();
    connectEvents();
    setupStockAppHiding();
    updateClock();
    setInterval(updateClock, 30000);
  }

  // ── Build UI ─────────────────────────────────────────────────────────

  function buildUI() {
    var root = document.createElement("div");
    root.id = "sp-app";

    buildHeader(root);
    buildSettingsPage(root);
    buildLogsPage(root);

    var app = document.querySelector("esp-app");
    if (app) {
      app.parentNode.insertBefore(root, app);
    } else {
      document.body.insertBefore(root, document.body.firstChild);
    }

    els.root = root;
  }

  function buildHeader(parent) {
    var header = document.createElement("div");
    header.className = "sp-header";

    var tabSettings = document.createElement("div");
    tabSettings.className = "sp-tab active";
    tabSettings.textContent = "Settings";
    tabSettings.addEventListener("click", function () {
      switchTab("settings");
    });

    var tabLogs = document.createElement("div");
    tabLogs.className = "sp-tab";
    tabLogs.textContent = "Logs";
    tabLogs.addEventListener("click", function () {
      switchTab("logs");
    });

    header.appendChild(tabSettings);
    header.appendChild(tabLogs);
    parent.appendChild(header);

    els.tabSettings = tabSettings;
    els.tabLogs = tabLogs;
  }

  function buildSettingsPage(parent) {
    var page = document.createElement("div");
    page.id = "sp-settings";
    page.className = "sp-page active";

    // Screen preview
    var wrap = document.createElement("div");
    wrap.className = "sp-wrap";
    wrap.innerHTML =
      '<div class="sp-screen">' +
      '<div class="sp-topbar">' +
      '<span class="sp-temp"></span>' +
      '<span class="sp-clock">--:--</span>' +
      "</div>" +
      '<div class="sp-main"></div>' +
      "</div>";
    page.appendChild(wrap);

    els.temp = wrap.querySelector(".sp-temp");
    els.clock = wrap.querySelector(".sp-clock");
    els.previewMain = wrap.querySelector(".sp-main");

    var hint = document.createElement("div");
    hint.className = "sp-hint";
    hint.textContent = "tap a button to configure it";
    page.appendChild(hint);

    // Config area
    var config = document.createElement("div");
    config.className = "sp-config";

    var listTitle = document.createElement("div");
    listTitle.className = "sp-section-title";
    listTitle.textContent = "Buttons";
    config.appendChild(listTitle);

    var list = document.createElement("ul");
    list.className = "sp-list";
    config.appendChild(list);
    els.buttonList = list;

    var panel = document.createElement("div");
    panel.className = "sp-panel";
    panel.style.display = "none";
    config.appendChild(panel);
    els.settingsPanel = panel;

    page.appendChild(config);

    // Apply bar
    var applyBar = document.createElement("div");
    applyBar.className = "sp-apply-bar";
    var applyBtn = document.createElement("button");
    applyBtn.className = "sp-apply-btn";
    applyBtn.textContent = "Apply Configuration";
    applyBtn.addEventListener("click", function () {
      postButtonPress("apply_configuration");
    });
    applyBar.appendChild(applyBtn);
    var note = document.createElement("div");
    note.className = "sp-apply-note";
    note.textContent = "Restarts the device to apply changes";
    applyBar.appendChild(note);
    page.appendChild(applyBar);

    parent.appendChild(page);
    els.settingsPage = page;
  }

  function buildLogsPage(parent) {
    var page = document.createElement("div");
    page.id = "sp-logs";
    page.className = "sp-page";

    var toolbar = document.createElement("div");
    toolbar.className = "sp-log-toolbar";
    var clearBtn = document.createElement("button");
    clearBtn.className = "sp-log-clear";
    clearBtn.textContent = "Clear";
    clearBtn.addEventListener("click", function () {
      els.logOutput.innerHTML = "";
    });
    toolbar.appendChild(clearBtn);
    page.appendChild(toolbar);

    var output = document.createElement("div");
    output.className = "sp-log-output";
    page.appendChild(output);
    els.logOutput = output;

    parent.appendChild(page);
    els.logsPage = page;
  }

  // ── Tab switching ────────────────────────────────────────────────────

  function switchTab(tab) {
    state.activeTab = tab;
    els.tabSettings.className =
      "sp-tab" + (tab === "settings" ? " active" : "");
    els.tabLogs.className = "sp-tab" + (tab === "logs" ? " active" : "");
    els.settingsPage.className =
      "sp-page" + (tab === "settings" ? " active" : "");
    els.logsPage.className = "sp-page" + (tab === "logs" ? " active" : "");

    var espApp = document.querySelector("esp-app");
    if (espApp) {
      if (tab === "logs") {
        espApp.classList.add("sp-hidden");
      } else {
        espApp.classList.remove("sp-hidden");
      }
    }
  }

  // ── Preview rendering ────────────────────────────────────────────────

  function renderPreview() {
    var main = els.previewMain;
    main.innerHTML = "";

    state.order.forEach(function (slot) {
      var b = state.buttons[slot - 1];
      var iconName = resolveIcon(slot);
      var label = b.label || b.entity || "Configure";
      var color = state.offColor;

      var btn = document.createElement("div");
      btn.className = "sp-btn" + (state.selectedSlot === slot ? " sp-selected" : "");
      btn.style.backgroundColor = "#" + (color.length === 6 ? color : "313131");
      btn.innerHTML =
        '<span class="sp-btn-icon mdi mdi-' + iconName + '"></span>' +
        '<span class="sp-btn-label">' + escHtml(label) + "</span>";
      btn.addEventListener("click", function () {
        selectButton(slot);
      });
      main.appendChild(btn);
    });

    if (state.order.length < NUM_SLOTS) {
      var add = document.createElement("div");
      add.className = "sp-btn sp-add-btn";
      add.innerHTML = '<span class="sp-add-icon mdi mdi-plus"></span>';
      add.addEventListener("click", addButton);
      main.appendChild(add);
    }
  }

  function escHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  // ── Button list rendering ───────────────────────────────────────────

  function renderButtonList() {
    var list = els.buttonList;
    list.innerHTML = "";

    if (state.order.length === 0) {
      var empty = document.createElement("li");
      empty.className = "sp-empty";
      empty.textContent = 'No buttons configured. Tap "+" on the screen above to add one.';
      list.appendChild(empty);
      return;
    }

    state.order.forEach(function (slot, pos) {
      var b = state.buttons[slot - 1];
      var iconName = resolveIcon(slot);
      var name = btnDisplayName(slot);

      var item = document.createElement("li");
      item.className =
        "sp-list-item" +
        (state.selectedSlot === slot ? " sp-list-selected" : "");
      item.dataset.pos = pos;
      item.draggable = true;

      item.innerHTML =
        '<span class="sp-list-handle mdi mdi-drag"></span>' +
        '<span class="sp-list-icon mdi mdi-' + iconName + '"></span>' +
        '<div class="sp-list-info">' +
        '<div class="sp-list-name">' + escHtml(name) + "</div>" +
        (b.entity
          ? '<div class="sp-list-entity">' + escHtml(b.entity) + "</div>"
          : "") +
        "</div>";

      item.addEventListener("click", function (e) {
        if (e.target.closest(".sp-list-handle")) return;
        selectButton(slot);
      });

      setupDrag(item, pos);
      list.appendChild(item);
    });
  }

  // ── Drag and drop ───────────────────────────────────────────────────

  function setupDrag(item, pos) {
    item.addEventListener("dragstart", function (e) {
      dragSrcPos = pos;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(pos));
      setTimeout(function () {
        item.classList.add("sp-dragging");
      }, 0);
    });

    item.addEventListener("dragend", function () {
      item.classList.remove("sp-dragging");
      clearDropIndicators();
    });

    item.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      clearDropIndicators();
      var rect = item.getBoundingClientRect();
      var midY = rect.top + rect.height / 2;
      if (e.clientY < midY) {
        item.classList.add("sp-drop-before");
      } else {
        item.classList.add("sp-drop-after");
      }
    });

    item.addEventListener("dragleave", function () {
      item.classList.remove("sp-drop-before", "sp-drop-after");
    });

    item.addEventListener("drop", function (e) {
      e.preventDefault();
      clearDropIndicators();
      var fromPos = dragSrcPos;
      if (fromPos < 0) return;

      var rect = item.getBoundingClientRect();
      var midY = rect.top + rect.height / 2;
      var toPos = e.clientY < midY ? pos : pos + 1;

      if (fromPos < toPos) toPos--;
      if (fromPos === toPos) return;

      var newOrder = state.order.slice();
      var moved = newOrder.splice(fromPos, 1)[0];
      newOrder.splice(toPos, 0, moved);

      postText("button_order", newOrder.join(","));
      dragSrcPos = -1;
    });
  }

  function clearDropIndicators() {
    els.buttonList
      .querySelectorAll(".sp-drop-before,.sp-drop-after")
      .forEach(function (el) {
        el.classList.remove("sp-drop-before", "sp-drop-after");
      });
  }

  // ── Settings panel ──────────────────────────────────────────────────

  function selectButton(slot) {
    state.selectedSlot = slot;
    renderPreview();
    renderButtonList();
    renderSettingsPanel();
  }

  function renderSettingsPanel() {
    var panel = els.settingsPanel;
    var slot = state.selectedSlot;

    if (slot < 1 || state.order.indexOf(slot) === -1) {
      panel.style.display = "none";
      return;
    }

    var b = state.buttons[slot - 1];
    panel.style.display = "block";
    panel.innerHTML =
      '<div class="sp-panel-title">Button ' + slot + " Settings</div>" +
      '<div class="sp-field">' +
      '<label class="sp-field-label">Entity ID</label>' +
      '<input class="sp-input" id="sp-inp-entity" type="text" ' +
      'placeholder="e.g. light.kitchen" value="' + escAttr(b.entity) + '">' +
      "</div>" +
      '<div class="sp-field">' +
      '<label class="sp-field-label">Label</label>' +
      '<input class="sp-input" id="sp-inp-label" type="text" ' +
      'placeholder="Optional custom label" value="' + escAttr(b.label) + '">' +
      "</div>" +
      '<div class="sp-field">' +
      '<label class="sp-field-label">Icon</label>' +
      '<select class="sp-select" id="sp-inp-icon">' +
      ICON_OPTIONS.map(function (opt) {
        return (
          '<option value="' + opt + '"' +
          (opt === b.icon ? " selected" : "") +
          ">" + opt + "</option>"
        );
      }).join("") +
      "</select>" +
      "</div>" +
      '<div class="sp-btn-row">' +
      '<button class="sp-action-btn sp-delete-btn">Delete Button</button>' +
      "</div>";

    var entityInp = panel.querySelector("#sp-inp-entity");
    var labelInp = panel.querySelector("#sp-inp-label");
    var iconSel = panel.querySelector("#sp-inp-icon");
    var delBtn = panel.querySelector(".sp-delete-btn");

    entityInp.addEventListener("blur", function () {
      postText("button_" + slot + "_entity", this.value);
    });
    entityInp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") this.blur();
    });

    labelInp.addEventListener("blur", function () {
      postText("button_" + slot + "_label", this.value);
    });
    labelInp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") this.blur();
    });

    iconSel.addEventListener("change", function () {
      postSelect("button_" + slot + "_icon", this.value);
    });

    delBtn.addEventListener("click", function () {
      deleteButton(slot);
    });
  }

  function escAttr(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // ── Add / Delete buttons ────────────────────────────────────────────

  function addButton() {
    var used = {};
    state.order.forEach(function (s) {
      used[s] = true;
    });
    var slot = -1;
    for (var i = 1; i <= NUM_SLOTS; i++) {
      if (!used[i]) {
        slot = i;
        break;
      }
    }
    if (slot < 0) return;

    var newOrder = state.order.concat(slot);
    postText("button_order", newOrder.join(","));
  }

  function deleteButton(slot) {
    var newOrder = state.order.filter(function (s) {
      return s !== slot;
    });
    postText("button_order", newOrder.join(","));
    postText("button_" + slot + "_entity", "");
    postText("button_" + slot + "_label", "");
    postSelect("button_" + slot + "_icon", "Auto");

    if (state.selectedSlot === slot) {
      state.selectedSlot = -1;
    }
  }

  // ── Clock ───────────────────────────────────────────────────────────

  function updateClock() {
    if (!els.clock) return;
    var now = new Date();
    var h = String(now.getHours()).padStart(2, "0");
    var m = String(now.getMinutes()).padStart(2, "0");
    els.clock.textContent = h + ":" + m;
  }

  // ── SSE ──────────────────────────────────────────────────────────────

  function connectEvents() {
    var source = new EventSource("/events");

    source.addEventListener("state", function (e) {
      var d;
      try {
        d = JSON.parse(e.data);
      } catch (_) {
        return;
      }
      var id = d.id;
      var val = d.state != null ? String(d.state) : "";

      // Button order
      if (id === "text-button_order") {
        state.order = parseOrder(val);
        renderPreview();
        renderButtonList();
        if (state.selectedSlot > 0 && state.order.indexOf(state.selectedSlot) === -1) {
          state.selectedSlot = -1;
        }
        renderSettingsPanel();
        return;
      }

      // Shared colors
      if (id === "text-button_on_color") {
        state.onColor = val;
        renderPreview();
        return;
      }
      if (id === "text-button_off_color") {
        state.offColor = val;
        renderPreview();
        return;
      }

      // Per-button entity / label
      var textMatch = id.match(/^text-button_(\d+)_(entity|label)$/);
      if (textMatch) {
        var slot = parseInt(textMatch[1], 10);
        var field = textMatch[2];
        if (slot >= 1 && slot <= NUM_SLOTS) {
          state.buttons[slot - 1][field] = val;
          renderPreview();
          renderButtonList();
          if (state.selectedSlot === slot) {
            var inp = document.getElementById(
              field === "entity" ? "sp-inp-entity" : "sp-inp-label"
            );
            if (inp && document.activeElement !== inp) {
              inp.value = val;
            }
          }
        }
        return;
      }

      // Per-button icon
      var selMatch = id.match(/^select-button_(\d+)_icon$/);
      if (selMatch) {
        var slot = parseInt(selMatch[1], 10);
        if (slot >= 1 && slot <= NUM_SLOTS) {
          state.buttons[slot - 1].icon = val;
          renderPreview();
          renderButtonList();
          if (state.selectedSlot === slot) {
            var sel = document.getElementById("sp-inp-icon");
            if (sel && document.activeElement !== sel) {
              sel.value = val;
            }
          }
        }
        return;
      }

      // Temperature switches
      if (
        id === "switch-indoor_temp_enable" ||
        id === "switch-outdoor_temp_enable"
      ) {
        var on = d.value === true || val === "ON";
        if (id === "switch-indoor_temp_enable") state._indoorOn = on;
        if (id === "switch-outdoor_temp_enable") state._outdoorOn = on;
        var show = state._indoorOn || state._outdoorOn;
        els.temp.className = "sp-temp" + (show ? " sp-visible" : "");
        if (!els.temp.textContent) els.temp.textContent = "-\u00B0 / -\u00B0";
        return;
      }
    });

    // Log events
    source.addEventListener("log", function (e) {
      var d;
      try {
        d = JSON.parse(e.data);
      } catch (_) {
        d = { msg: e.data };
      }
      appendLog(d.msg || e.data, d.lvl);
    });
  }

  // ── Log viewer ──────────────────────────────────────────────────────

  function appendLog(msg, lvl) {
    if (!els.logOutput) return;
    var line = document.createElement("div");
    line.className = "sp-log-line";

    if (lvl === 1) line.classList.add("sp-log-error");
    else if (lvl === 2) line.classList.add("sp-log-warn");
    else if (lvl === 5) line.classList.add("sp-log-debug");
    else if (lvl >= 6) line.classList.add("sp-log-verbose");

    line.textContent = msg;

    var atBottom =
      els.logOutput.scrollHeight - els.logOutput.scrollTop - els.logOutput.clientHeight < 40;
    els.logOutput.appendChild(line);

    // Cap at 1000 lines
    while (els.logOutput.childNodes.length > 1000) {
      els.logOutput.removeChild(els.logOutput.firstChild);
    }

    if (atBottom) {
      els.logOutput.scrollTop = els.logOutput.scrollHeight;
    }
  }

  // ── Stock app management ────────────────────────────────────────────

  function setupStockAppHiding() {
    var observer = new MutationObserver(function () {
      hideButtonConfigGroup();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(hideButtonConfigGroup, 2000);
  }

  function hideButtonConfigGroup() {
    var app = document.querySelector("esp-app");
    if (!app) return;

    var walker = document.createTreeWalker(
      app,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    while (walker.nextNode()) {
      var text = walker.currentNode;
      if (text.textContent.trim() === "Button Configuration") {
        var section = text.parentElement;
        if (section) {
          var container = section.parentElement;
          if (container) {
            container.style.display = "none";
          }
        }
      }
    }
  }

  // ── Start ───────────────────────────────────────────────────────────

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
