// Internal relay card: controls built-in relay hardware locally on the device.
function internalRelayOptions() {
  return (CFG.features && CFG.features.internalRelays) || [];
}

function internalRelayDefaultIcon(mode) {
  return mode === "push" ? "Gesture Tap" : "Power Plug";
}

function internalRelayMode(b) {
  return b.sensor === "push" ? "push" : "switch";
}

function internalRelayLabelFor(key) {
  var relays = internalRelayOptions();
  for (var i = 0; i < relays.length; i++) {
    if (relays[i].key === key) return relays[i].label;
  }
  return key ? key.replace(/_/g, " ").replace(/\b\w/g, function (ch) { return ch.toUpperCase(); }) : "Relay";
}

function ensureInternalRelaySelection(b) {
  var relays = internalRelayOptions();
  if (!relays.length) return;
  for (var i = 0; i < relays.length; i++) {
    if (relays[i].key === b.entity) return;
  }
  b.entity = relays[0].key;
}

registerButtonType("internal", {
  label: "Internal",
  allowInSubpage: true,
  labelPlaceholder: "e.g. Porch Light",
  isAvailable: function () {
    return internalRelayOptions().length > 0;
  },
  onSelect: function (b) {
    ensureInternalRelaySelection(b);
    b.sensor = "";
    b.unit = "";
    b.precision = "";
    b.icon = "Power Plug";
    b.icon_on = "Auto";
  },
  renderSettings: function (panel, b, slot, helpers) {
    ensureInternalRelaySelection(b);
    var relays = internalRelayOptions();
    var mode = internalRelayMode(b);
    if (!b.icon || b.icon === "Auto") b.icon = internalRelayDefaultIcon(mode);

    var rf = document.createElement("div");
    rf.className = "sp-field";
    rf.appendChild(helpers.fieldLabel("Internal Relay", helpers.idPrefix + "internal-relay"));
    var relaySelect = document.createElement("select");
    relaySelect.className = "sp-select";
    relaySelect.id = helpers.idPrefix + "internal-relay";
    if (!relays.length) {
      var emptyOpt = document.createElement("option");
      emptyOpt.value = "";
      emptyOpt.textContent = "No relays";
      relaySelect.appendChild(emptyOpt);
      relaySelect.disabled = true;
    } else {
      relays.forEach(function (relay) {
        var opt = document.createElement("option");
        opt.value = relay.key;
        opt.textContent = relay.label;
        if (b.entity === relay.key) opt.selected = true;
        relaySelect.appendChild(opt);
      });
    }
    relaySelect.addEventListener("change", function () {
      b.entity = this.value;
      helpers.saveField("entity", b.entity);
    });
    rf.appendChild(relaySelect);
    panel.appendChild(rf);

    var mf = document.createElement("div");
    mf.className = "sp-field";
    mf.appendChild(helpers.fieldLabel("Mode", helpers.idPrefix + "internal-mode"));
    var modeSeg = document.createElement("div");
    modeSeg.className = "sp-segment";
    var switchBtn = document.createElement("button");
    switchBtn.type = "button";
    switchBtn.textContent = "Switch";
    var pushBtn = document.createElement("button");
    pushBtn.type = "button";
    pushBtn.textContent = "Push Button";
    modeSeg.appendChild(switchBtn);
    modeSeg.appendChild(pushBtn);
    mf.appendChild(modeSeg);
    panel.appendChild(mf);

    var iconField = helpers.makeIconPicker(
      helpers.idPrefix + "icon-picker", helpers.idPrefix + "icon",
      b.icon || internalRelayDefaultIcon(mode), function (opt) {
        b.icon = opt;
        helpers.saveField("icon", opt);
      }
    );
    panel.appendChild(iconField);

    function syncIcon(value) {
      b.icon = value;
      helpers.saveField("icon", value);
      var preview = iconField.querySelector(".sp-icon-picker-preview");
      if (preview) preview.className = "sp-icon-picker-preview mdi mdi-" + iconSlug(value);
      var input = iconField.querySelector(".sp-icon-picker-input");
      if (input) input.value = value;
    }

    var hasIconOn = b.icon_on && b.icon_on !== "Auto";
    var whenOnToggle = helpers.toggleRow("When Entity On", helpers.idPrefix + "whenon-toggle", hasIconOn);
    panel.appendChild(whenOnToggle.row);

    var iconOnCond = condField();
    if (mode === "switch" && hasIconOn) iconOnCond.classList.add("sp-visible");

    var iconOnSection = document.createElement("div");
    iconOnSection.className = "sp-field";
    iconOnSection.appendChild(helpers.fieldLabel("Icon When On", helpers.idPrefix + "icon-on"));
    var iconOnVal = hasIconOn ? b.icon_on : "Auto";
    var iconOnPicker = document.createElement("div");
    iconOnPicker.className = "sp-icon-picker";
    iconOnPicker.id = helpers.idPrefix + "icon-on-picker";
    iconOnPicker.innerHTML =
      '<span class="sp-icon-picker-preview mdi mdi-' + iconSlug(iconOnVal) + '"></span>' +
      '<input class="sp-icon-picker-input" id="' + helpers.idPrefix + 'icon-on" type="text" ' +
      'placeholder="Search icons\u2026" value="' + escAttr(iconOnVal) + '" autocomplete="off">' +
      '<div class="sp-icon-dropdown"></div>';
    iconOnSection.appendChild(iconOnPicker);
    iconOnCond.appendChild(iconOnSection);
    initIconPicker(iconOnPicker, iconOnVal, function (opt) {
      b.icon_on = opt;
      helpers.saveField("icon_on", opt);
    });
    panel.appendChild(iconOnCond);

    function syncModeUi() {
      switchBtn.classList.toggle("active", mode === "switch");
      pushBtn.classList.toggle("active", mode === "push");
      whenOnToggle.row.style.display = mode === "switch" ? "" : "none";
      iconOnCond.classList.toggle("sp-visible", mode === "switch" && whenOnToggle.input.checked);
    }

    function setMode(nextMode) {
      if (mode === nextMode) return;
      var oldDefault = internalRelayDefaultIcon(mode);
      mode = nextMode;
      b.sensor = mode === "push" ? "push" : "";
      helpers.saveField("sensor", b.sensor);
      if (!b.icon || b.icon === "Auto" || b.icon === oldDefault) {
        syncIcon(internalRelayDefaultIcon(mode));
      }
      if (mode === "push") {
        b.icon_on = "Auto";
        helpers.saveField("icon_on", "Auto");
        whenOnToggle.input.checked = false;
        var ionPreview = iconOnPicker.querySelector(".sp-icon-picker-preview");
        if (ionPreview) ionPreview.className = "sp-icon-picker-preview mdi mdi-cog";
        var ionInput = iconOnPicker.querySelector(".sp-icon-picker-input");
        if (ionInput) ionInput.value = "Auto";
      }
      syncModeUi();
    }

    switchBtn.addEventListener("click", function () { setMode("switch"); });
    pushBtn.addEventListener("click", function () { setMode("push"); });
    whenOnToggle.input.addEventListener("change", function () {
      if (this.checked) {
        iconOnCond.classList.add("sp-visible");
      } else {
        b.icon_on = "Auto";
        helpers.saveField("icon_on", "Auto");
        iconOnCond.classList.remove("sp-visible");
        var ionPreview = iconOnPicker.querySelector(".sp-icon-picker-preview");
        if (ionPreview) ionPreview.className = "sp-icon-picker-preview mdi mdi-cog";
        var ionInput = iconOnPicker.querySelector(".sp-icon-picker-input");
        if (ionInput) ionInput.value = "Auto";
      }
    });
    syncModeUi();
  },
  renderPreview: function (b, helpers) {
    var mode = internalRelayMode(b);
    var label = b.label || internalRelayLabelFor(b.entity);
    var iconName = b.icon && b.icon !== "Auto" ? iconSlug(b.icon) : iconSlug(internalRelayDefaultIcon(mode));
    var badge = mode === "push" ? "gesture-tap" : "power-plug";
    return {
      iconHtml: '<span class="sp-btn-icon mdi mdi-' + iconName + '"></span>',
      labelHtml:
        '<span class="sp-btn-label-row"><span class="sp-btn-label">' + helpers.escHtml(label) + '</span>' +
        '<span class="sp-type-badge mdi mdi-' + badge + '"></span></span>',
    };
  },
});
