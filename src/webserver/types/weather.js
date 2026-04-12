registerButtonType("weather", {
  label: "Weather",
  allowInSubpage: false,
  labelPlaceholder: "e.g. My Location",
  onSelect: function (b) {
    b.entity = "";
    b.sensor = "";
    b.unit = "";
    b.icon = "Auto";
    b.icon_on = "Auto";
  },
  renderSettings: function (panel, b, slot, helpers) {
    var feeds = [
      ["condition", "Condition"],
      ["temperature", "Temperature"],
      ["feels_like", "Feels Like"],
      ["humidity", "Humidity"],
      ["wind", "Wind Speed"],
      ["precip", "Precipitation"],
      ["cloud", "Cloud Cover"],
    ];
    var ff = document.createElement("div");
    ff.className = "sp-field";
    ff.appendChild(helpers.fieldLabel("Data Feed", helpers.idPrefix + "sensor"));
    var feedSelect = document.createElement("select");
    feedSelect.className = "sp-select";
    feedSelect.id = helpers.idPrefix + "sensor";
    feeds.forEach(function (f) {
      var opt = document.createElement("option");
      opt.value = f[0];
      opt.textContent = f[1];
      if ((b.sensor || "condition") === f[0]) opt.selected = true;
      feedSelect.appendChild(opt);
    });
    ff.appendChild(feedSelect);

    var labelField = panel.querySelector("#" + helpers.idPrefix + "label");
    var labelWrap = labelField ? labelField.closest(".sp-field") : null;
    if (labelWrap) {
      panel.insertBefore(ff, labelWrap);
    } else {
      panel.appendChild(ff);
    }

    var uf = document.createElement("div");
    uf.className = "sp-field";
    uf.appendChild(helpers.fieldLabel("Unit", helpers.idPrefix + "unit"));
    var unitInp = helpers.textInput(helpers.idPrefix + "unit", b.unit, "e.g. \u00B0C");
    unitInp.className = "sp-input sp-input--narrow";
    uf.appendChild(unitInp);
    panel.appendChild(uf);
    helpers.bindField(unitInp, "unit", true);

    var isCondition = !b.sensor || b.sensor === "condition";
    if (labelWrap) labelWrap.style.display = isCondition ? "none" : "";
    uf.style.display = isCondition ? "none" : "";

    var unitDefaults = {
      condition: "", temperature: "\u00B0C", feels_like: "\u00B0C",
      humidity: "%", wind: "km/h", precip: "mm", cloud: "%",
    };
    feedSelect.addEventListener("change", function () {
      b.sensor = this.value;
      b.unit = unitDefaults[this.value] || "";
      helpers.saveField("sensor", this.value);
      unitInp.value = b.unit;
      var cond = this.value === "condition";
      if (labelWrap) labelWrap.style.display = cond ? "none" : "";
      uf.style.display = cond ? "none" : "";
      if (cond) {
        b.label = "";
        b.unit = "";
        var labelInput = panel.querySelector("#" + helpers.idPrefix + "label");
        if (labelInput) labelInput.value = "";
      }
      renderPreview();
    });

    var hint = document.createElement("div");
    hint.className = "sp-hint";
    hint.textContent = "Set location in Settings \u2192 Weather";
    panel.appendChild(hint);
  },
  renderPreview: function (b, helpers) {
    var label = b.label || "Weather";
    var feed = b.sensor || "condition";
    if (feed === "condition") {
      return {
        iconHtml: '<span class="sp-btn-icon mdi mdi-weather-partly-cloudy"></span>',
        labelHtml: '<span class="sp-btn-label">' + helpers.escHtml(label) + '</span>',
      };
    }
    var unit = b.unit ? helpers.escHtml(b.unit) : "";
    return {
      iconHtml:
        '<span class="sp-sensor-preview">' +
          '<span class="sp-sensor-value">0</span>' +
          '<span class="sp-sensor-unit">' + unit + '</span>' +
        '</span>',
      labelHtml:
        '<span class="sp-btn-label">' + helpers.escHtml(label) + '</span>',
    };
  },
});
