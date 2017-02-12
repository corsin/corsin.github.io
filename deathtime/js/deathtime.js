// ui variables
var firstPage = true;
var changeHash = false;

// time boundaries
var timeMin = 0;
var timeMax = 1000;
var timeUndefinedMin = -1;
var timeUndefinedMax = 1001;

// maximum number of iterations and tolerance
var maxIterations = 50;
var maxTolerance = 0.0000001;

// temperature errors
var q02 = 7;
var q02withFactor1 = 7;
var q0203 = 7;
var q0203withFactor1 = 4.5;
var q0305 = 4.5;
var q0305withFactor1 = 3.2;
var q051= 2.8;
var q051withFactor1 = 2.8;
var q05above23 = 2.8;

// livores times
var tLivoresBeginnMin = 0;
var tLivoresBeginnMax = 3;
var tLivoresKonfluenzMin = 1;
var tLivoresKonfluenzMax = 4;
var tLivoresDaumendruckMin = 1;
var tLivoresDaumendruckMax = 20;
var tLivoresVerlagerbarkeitVollstaendigMin = 2;
var tLivoresVerlagerbarkeitVollstaendigMax = 6;
var tLivoresMaximumMin = 3;
var tLivoresMaximumMax = 16;
var tLivoresVerlagerbarkeitUnvollstaendigMin = 4
var tLivoresVerlagerbarkeitUnvollstaendigMax = 24;

// rigor times
var tRigorBeginnMin = 0.5;
var tRigorBeginnMax = 7.0;
var tRigorWiederbildungMin = 2.0;
var tRigorWiederbildungMax = 8.0;
var tRigorMaximumMin = 2.0;
var tRigorMaximumMax = 20.0;

// electrical exitability
var tAugenbraueGrad1Min = 5.0;
var tAugenbraueGrad1Max = 22.0;
var tAugenbraueGrad2Min = 5.0;
var tAugenbraueGrad2Max = 26.0;
var tAugenbraueGrad3Min = 3.5;
var tAugenbraueGrad3Max = 13.0;
var tAugenbraueGrad4Min = 3.0;
var tAugenbraueGrad4Max = 8.0;
var tAugenbraueGrad5Min = 2.0;
var tAugenbraueGrad5Max = 7.0;
var tAugenbraueGrad6Min = 1.0;
var tAugenbraueGrad6Max = 6.0;
var tOrisGrad1Min = 2.0;
var tOrisGrad1Max = 6.0;
var tOrisGrad2Min = 1.0;
var tOrisGrad2Max = 5.0;
var tOrisGrad3Min = 0.0;
var tOrisGrad3Max = 2.5;


// chemical exitability
var tIrisAtropinMin = 3.0;
var tIrisAtropinMax = 10.0;
var tIrisTropicamidMin = 5.0;
var tIrisTropicamidMax = 30.0;
var tIrisAcetylcholinMin = 14.0;
var tIrisAcetylcholinMax = 46.0;
var tIrisAdrenalinMin = 14.0;
var tIrisAdrenalinMax = 46.0;

// mechanical exitability
var tZsakoMin = undefined;
var tZsakoMax = 2.5;
var tIdioReversibleMin = 1.5;
var tIdioReversibleMax = 5.0;
var tIdioPersistentMin = undefined;
var tIdioPersistentMax = 13.0;

// correction factor adaptations based on the surface and clothing:
var heavyInsulationThickClothing = 0.1;
var heavyInsulationThinClothing = 0.3;
var heavyInsulationNoClothing = 1.3;
var lightInsulationClothing = 0.1;
var lightInsulationNoClothing = 1.15;
var conductingThickClothing = -0.1;

function calculateCorrectionFactor(correctionFactor70, bodyWeight) {
  if (correctionFactor70 < 1.4) {
    return correctionFactor70;
  }
  if (correctionFactor70 < 1.6 && (bodyWeight > 20.0 && bodyWeight < 120.0)) {
    return correctionFactor70;
  }
  if (correctionFactor70 < 1.8 && (bodyWeight > 30.0 && bodyWeight < 110.0)) {
    return correctionFactor70;
  }
  if (correctionFactor70 < 2.0 && (bodyWeight > 50.0 && bodyWeight < 100.0)) {
    return correctionFactor70;
  }
  if (correctionFactor70 < 2.2 && (bodyWeight > 50.0 && bodyWeight < 90.0)) {
    return correctionFactor70;
  }
  if (bodyWeight > 69.0 && bodyWeight < 71.0) {
    return correctionFactor70;
  }

  return Math.pow((-1.2815) / (((Math.pow(bodyWeight, -0.625) - 0.028) * (-3.24956 * Math.exp(-0.89959 * correctionFactor70))) - 0.0354), 1.6) / bodyWeight;
}

function computeErrorMin(ambientTemperatureMin, qMin) {
  var errorMin;
  if (ambientTemperatureMin >= 23.0 && qMin >= 0.5) {
    errorMin = q05above23;
  } else if (qMin <= 0.1) {
    errorMin = undefined;
  } else if (qMin <= 0.2) {
    if (correctionFactorMin == 1.0) {
      errorMin = q02withFactor1;
    } else {
      errorMin = q02;
    }
  } else if (0.2 < qMin && qMin <= 0.3) {
    if (correctionFactorMin == 1.0) {
      errorMin = q0203withFactor1;
    } else {
      errorMin = q0203;    
    }
  } else if (0.3 < qMin && qMin <= 0.5) {
    if (correctionFactorMin == 1.0) {
      errorMin = q0305withFactor1;
    } else {
      errorMin = q0305;
    }
  } else if (0.5 < qMin && qMin <= 1.0) {
    if (correctionFactorMin == 1.0) {
      errorMin = q051withFactor1;
    } else {
      errorMin = q051;
    }
  }
  
  return errorMin;
}

function computeErrorMax(ambientTemperatureMax, qMax) {
  var errorMax;
  if (ambientTemperatureMax >= 23.0 && qMax >= 0.5) {
     errorMax = q05above23;
  } else if (qMax <= 0.2) {
    errorMax = undefined;
  } else if (0.2 < qMax && qMax <= 0.3) {
    if (correctionFactorMax == 1.0) {
      errorMax = q0203withFactor1;
    } else {
      errorMax = q0203;
    }
  } else if (0.3 < qMax && qMax <= 0.5) {
    if (correctionFactorMax == 1.0) {
      errorMax = q0305withFactor1;
    } else {
      errorMax = q0305;
    }
  } else if (0.5 < qMax && qMax <= 1.0) {
    if (correctionFactorMax == 1.0) {
      errorMax = q051withFactor1;
    } else {
      errorMax = q051;
    }
  }
  return errorMax;
}

function calculateWithBodyTemperature(correctedBodyWeight, ambientTemperature, qGoal) {
     
  // initial boundaries
  var tLower = timeMin;
  var tUpper = timeMax;
  var t = timeMin;
  var i = 0;

  // initial q values
  var qLower = henssgeFormula(correctedBodyWeight, tLower, ambientTemperature);
  var qUpper = henssgeFormula(correctedBodyWeight, tUpper, ambientTemperature);
  var qCurrent = 0;
     
  do {
    ++i;
    t = (tUpper + tLower) / 2;
    qLower = henssgeFormula(correctedBodyWeight, tLower, ambientTemperature);
    qUpper = henssgeFormula(correctedBodyWeight, tUpper, ambientTemperature);
    qCurrent = henssgeFormula(correctedBodyWeight, t, ambientTemperature);
    if (qUpper < qCurrent && qCurrent < qGoal) {
      tUpper = t;
    } else {
      tLower = t;       }
    } while (i < maxIterations && qLower - qUpper > maxTolerance && qLower > qGoal && qUpper < qGoal)

    if (i == 1) {
      return undefined;
    }
       
    return t;
}

function henssgeFormula(bodyWeight, t, ambientTemperature) {
  if (ambientTemperature > 23) {
     return henssgeAbove23(bodyWeight, t);
     } else {
       return henssgeBelow23(bodyWeight, t);
     }
}

function henssgeBelow23(bodyWeight, t) {
  var b = 0.0284 - 1.2815 * (Math.pow(bodyWeight, -0.625));
  var n = 1.25 * Math.exp(b * t) - 0.25 * Math.exp(5 * b * t);
  return n;
}

function henssgeAbove23(bodyWeight, t) {
  var b = 0.0284 - 1.2815 * (Math.pow(bodyWeight, -0.625));
  var n = 1.11 * Math.exp(b * t) - 0.11 * Math.exp(10 * b * t);
  return n;
}

function Data() {
  
  // input
  measurementDate = undefined;
  ambientTemperatureMin = undefined;
  ambientTemperatureMax = undefined;
  bodyTemperature = undefined;
  initialBodyTemperature = undefined;
  bodyWeightMin = undefined;
  bodyWeightMax = undefined;
  correctionFactorMin = undefined;
  correctionFactorMax = undefined;
  surface = undefined;
  clothing = undefined;
  bodyWeightAdaptedMin = undefined;
  bodyWeightAdaptedMax = undefined;
  livoresBeginn = undefined;
  livoresKonfluenz = undefined;
  livoresMaximum = undefined;
  livoresDaumendruck = undefined;
  livoresVerlagerbarkeitVollstaendig = undefined;
  livoresVerlagerbarkeitUnvollstaendig = undefined;
  rigorBeginn = undefined;
  rigorWiederbildung = undefined;
  rigorMaximum = undefined;
  reizbarkeitAugenbraue = undefined;
  reizbarkeitOris = undefined;
  reizbarkeitIrisAtropin = undefined;
  reizbarkeitIrisTopicamid = undefined;
  reizbarkeitIrisActylcholin = undefined;
  reizbarkeitIrisAdrenalin = undefined;
  reizbarkeitIdioMuskulaererWulstReversible = undefined;
  reizbarkeitIdioMuskulaererWulstPersistent = undefined;
  reizbarkeitZsako = undefined;
  
  // messages
  errors = undefined;
  warnings = undefined;
  
  // results
  tMin = undefined;
  tMax = undefined;
  tMinAbsolute = undefined;
  tMaxAbsolute = undefined;
  tTemperatureMin = undefined;
  tTemperatureMax = undefined;
  tLividityMin = undefined;
  tLividityMax = undefined;
  tRigorMin = undefined;
  tRigorMax = undefined;
  tMimicMin = undefined;
  tMimicMax = undefined;
  tOrbicularisMin = undefined;
  tOrbicularisMax = undefined;
  tIrisMin = undefined;
  tIrisMax = undefined;
  tIdioMuskulaererWulstMin = undefined;
  tIdioMuskulaererWulstMax = undefined;
  tReizbarkeitZsakoMin = undefined;
  tReizbarkeitZsakoMax = undefined;
  
  // helper
  correctionFactorAdaptedMin = undefined;
  correctionFactorAdaptedMax = undefined;
  q = undefined;
  temperatureErrorMin = undefined;
  temperatureErrorMax = undefined;
}

function getRadioButtonValue(name) {
   var fields = $("input[name='" + name + "']");
   for (var i = 0; i < fields.length; i++) {
     if (fields[i].checked) {
       return fields[i].value;
     }
   }
}
 
function setRadioButtonValue(name, value) {
  var fields = $("input[name='" + name + "']");
  for (var i = 0; i < fields.length; i++) {
    if (fields[i].value == value) {
      $(fields[i]).attr("checked", "checked");
    } else {
      $(fields[i]).attr("checked", undefined);
    }
  }
}

function formatDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (month < 10) {
     month = "0" + month;
  }
  if (day < 10) {
     day = "0" + day;
  }
 
  return year + "-" + month + "-" + day;
}

function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return hours + ":" + minutes;
}

function renderTime(time) {
  if (time == undefined || isNaN(time)) {
    return "?";
  }
   
  time = Math.round(time * 60) / 60;
  var hours = Math.floor(time);
  var minutes = Math.round((time - hours) * 60);
  if (minutes < 10) {
     minutes = "0" + minutes;
  }
  return hours + "h " + minutes + "min";
}

function formatDateAndTime(date) {
  if (date == undefined || isNaN(date)) {
    return "?";
  }
  return formatDate(date) + " " + formatTime(date);
}

function renderDateInterval(from, to) {
  return formatDateAndTime(from) + " - " + formatDateAndTime(to);
}

function parseDate(date) {
  var parts = date.split('-');
  return new Date(parts[0], parts[1]-1, parts[2]);
}

function parseDateAndTime(date, time) {
  var dateObj = parseDate(date);
  var times = time.split(":");
  dateObj.setHours(times[0]);
  dateObj.setMinutes(times[1]);
  return dateObj;
}

function renderDuration(tMin, tMax) {
  return renderTime(tMin) + " - " + renderTime(tMax);
}

function roundNumber(i) {
  return Math.round(i * 1000) / 1000;
}

function renderNumberInterval(from, to) {
  return roundNumber(from) + " - " + roundNumber(to);
}

function isDesktop() {
  return $("body").attr("id") == "desktop";
}

function isMobile() {
  return $("body").attr("id") == "mobile";
}

function updateCorrectionFactorGraphics(minValue, maxValue, lead) {
  $("#correctionFactor").empty().append(minValue / 100 + " - " + maxValue / 100);
  
  var imageWidth = 1100; // width of the image
  var border = 136; // border range for the image
  var valueRange = 300; // width of the value range
  var canvasWidth = $("#correctionFactorImageContainer").width();
  var canvasMid = canvasWidth / 2; // middle of the canvas
  
  var imageRange = imageWidth - (2 * border); // width of the image range
  var scale = imageRange / valueRange; // number of pixels per range unit
  
  var rangeMin = minValue * scale + border; // min value in pixels
  var rangeMax = maxValue * scale + border; // max value in pixels
  var rangeWidth = rangeMax - rangeMin;
  var rangeMid = (rangeMax + rangeMin) / 2;
  
  if (rangeWidth < 2) {
    rangeMin = rangeMin - 1;
    rangeMax = rangeMax + 1;
    rangeWidth = rangeMax - rangeMin;
  } else if (rangeWidth > canvasWidth - border) {
    if (lead == "max") {
      var rangeMid = rangeMax - canvasMid + border / 2;
    } else {
      var rangeMid = rangeMin + canvasMid - border / 2;
    }
  }
  
  // adjust the image
  var imageAdjustment = rangeMid - canvasMid;
  $("#correctionFactorImage").css("left", -imageAdjustment + "px");
  
  // update the range highlighter
  $("#correctionFactorRange").css("left", (rangeMin - imageAdjustment) + "px");
  $("#correctionFactorRange").css("width", rangeWidth + "px");
}

function correctionFactorMinChanged(value) {
  var minValue = parseFloat(value);
  var maxValue = parseFloat($("#correctionFactorMax").val());
  if (minValue > maxValue) {
    maxValue = minValue;
    $("#correctionFactorMax").val(maxValue);
    $("#correctionFactorMax").change();
  }
  updateCorrectionFactorGraphics(minValue, maxValue, "min");
}

function correctionFactorMaxChanged(value) {
  var minValue = parseFloat($("#correctionFactorMin").val());
  var maxValue = parseFloat(value);
  if (maxValue < minValue) {
    minValue = maxValue;
    $("#correctionFactorMin").val(minValue);
    $("#correctionFactorMin").change();
  }
  updateCorrectionFactorGraphics(minValue, maxValue, "max");
}

function updateGradeAugenbraueImageSelection() {
  var gradeValue = getRadioButtonValue("reizbarkeitAugenbraue");

  if (gradeValue != undefined) {
    gradeValue = gradeValue.replace(/grad/g, "");
  } else {
	gradeValue = "unknown";
  }

  var position = gradeValue;
  if (position == 'unknown') {
    position = 0;
  } else {
    position = 7 - parseInt(position);
  }

  var offset = position * 225;
  
  $(".gradeAugenbraueImagePanel").animate({
    left: -offset
  });
}

function nextGradeAugenbraue() {
  var gradeValue = getRadioButtonValue("reizbarkeitAugenbraue");
  if (gradeValue != undefined) {
    gradeValue = gradeValue.replace(/grad/g, "");
  } else {
	gradeValue = "unknown";
  }

  if (gradeValue != 'unknown') {
    var value = parseInt(gradeValue) - 1;
    if (value < 1) {
      gradeValue = "grad1";
    } else {
      gradeValue = "grad" + value;
    }
  } else {
    gradeValue = "grad6";
  }

  setRadioButtonValue("reizbarkeitAugenbraue", gradeValue);
  updateGradeAugenbraueImageSelection();  
}

function prevGradeAugenbraue() {
  var gradeValue = getRadioButtonValue("reizbarkeitAugenbraue");
  if (gradeValue != undefined) {
    gradeValue = gradeValue.replace(/grad/g, "");
  } else {
	gradeValue = "unknown";
  }

  if (gradeValue != 'unknown') {
    var value = parseInt(gradeValue) + 1;
    if (value > 6) {
      gradeValue = "unknown";
    } else {
      gradeValue = "grad" + value;
    }
  } else {
    gradeValue = "unknown";
  }
  
  setRadioButtonValue("reizbarkeitAugenbraue", gradeValue);
  updateGradeAugenbraueImageSelection();  
}

function updateGradeOrisImageSelection() {
  var gradeValue = getRadioButtonValue("reizbarkeitOris").replace(/grad/g, "");
  
  var position = gradeValue;
  if (position == 'unknown') {
    position = 0;
  } else {
    position = 4 - parseInt(position);
  }

  var offset = position * 225;
  
  $(".gradeOrisImagePanel").animate({
    left: -offset
  });
}

function nextGradeOris() {
  var gradeValue = getRadioButtonValue("reizbarkeitOris").replace(/grad/g, "");

  if (gradeValue != 'unknown') {
    var value = parseInt(gradeValue) - 1;
    if (value < 1) {
      gradeValue = "grad1";
    } else {
      gradeValue = "grad" + value;
    }
  } else {
    gradeValue = "grad3";
  }

  setRadioButtonValue("reizbarkeitOris", gradeValue);
  updateGradeOrisImageSelection();  
}

function prevGradeOris() {
  var gradeValue = getRadioButtonValue("reizbarkeitOris").replace(/grad/g, "");

  if (gradeValue != 'unknown') {
    var value = parseInt(gradeValue) + 1;
    if (value > 3) {
      gradeValue = "unknown";
    } else {
      gradeValue = "grad" + value;
    }
  } else {
    gradeValue = "unknown";
  }
  
  setRadioButtonValue("reizbarkeitOris", gradeValue);
  updateGradeOrisImageSelection();  
}

function initializeMobile() {
  
  // event handlers for the correction factor sliders (need multiple to cover all the options)
  $("input#correctionFactorMin").live('change', function (event) {
    correctionFactorMinChanged($(event.target).val());
  });
  $("input#correctionFactorMin").live('input', function (event) {
    correctionFactorMinChanged($(event.target).val());
  });
  $("input#correctionFactorMin").live('formchange', function (event) {
    correctionFactorMinChanged($(event.target).val());
  });
  $("input#correctionFactorMax").live('change', function (event) {
    correctionFactorMaxChanged($(event.target).val());
  });
  $("input#correctionFactorMax").live('input', function (event) {
    correctionFactorMaxChanged($(event.target).val());
  });
  $("input#correctionFactorMax").live('formchange', function (event) {
    correctionFactorMaxChanged($(event.target).val());
  });
  
  // click handlers for the grade images
  $("#gradNext").click(function() {
    nextGradeAugenbraue();
  });
  $("#gradPrev").click(function() {
    prevGradeAugenbraue();
  });
  $("#orisGradNext").click(function() {
    nextGradeOris();
  });
  $("#orisGradPrev").click(function() {
    prevGradeOris();
  });
  
  // swipe handlers for the grade images
  $(".gradeImages").live('swiperight',function(event, ui){
    prevGrade();
  });
  $(".gradeImages").live('swipeleft',function(event, ui){
    nextGrade();
  });

  $("#backToCaptureButton").click(function (event) {
	event.preventDefault();
    $.mobile.changePage($("#capture"), {
  		  transition: "slide",
          reverse: true,
  		  changeHash: changeHash
    });
  });
  
  updateGradeAugenbraueImageSelection();
}

function initializeDesktop() {
  	
  	// event handlers for the correction factor sliders (need multiple to cover all the options)
    $("input#correctionFactorMin").live('change', function (event) {
      correctionFactorMinChanged($(event.target).val());
    });
    $("input#correctionFactorMin").live('input', function (event) {
      correctionFactorMinChanged($(event.target).val());
    });
    $("input#correctionFactorMin").live('formchange', function (event) {
      correctionFactorMinChanged($(event.target).val());
    });
    $("input#correctionFactorMax").live('change', function (event) {
      correctionFactorMaxChanged($(event.target).val());
    });
    $("input#correctionFactorMax").live('input', function (event) {
      correctionFactorMaxChanged($(event.target).val());
    });
    $("input#correctionFactorMax").live('formchange', function (event) {
      correctionFactorMaxChanged($(event.target).val());
    });
    
  // initialize the accordion tabs
	$("#sections").tabs("#sections div .sectionContent", {tabs: 'h2', effect: 'slide', initialIndex: 0});

  // initialize the tooltips
  $("[title]").tooltip({
    offset: [-5, 0]
  });
  
//	console.log("desktop version initialization completed");
}

function collectData() {
  var data = new Data();
  data.measurementDate = parseDateAndTime($("#measurementDate").val(), $("#measurementTime").val());
  data.ambientTemperatureMin = parseFloat($("#ambientTemperatureMin").val());
  data.ambientTemperatureMax = parseFloat($("#ambientTemperatureMax").val());
  data.bodyTemperature = parseFloat($("#bodyTemperature").val());
  data.initialBodyTemperature = parseFloat($("#initialBodyTemperature").val());
  data.bodyWeightMin = parseFloat($("#bodyWeightMin").val());
  data.bodyWeightMax = parseFloat($("#bodyWeightMax").val());
  data.correctionFactorMin = parseFloat($("#correctionFactorMin").val() / 100);
  data.correctionFactorMax = parseFloat($("#correctionFactorMax").val() / 100);
  data.surface = getRadioButtonValue("surface");
  data.clothing = getRadioButtonValue("clothing");
  data.livoresBeginn = getRadioButtonValue("livoresBeginn");
  data.livoresKonfluenz = getRadioButtonValue("livoresKonfluenz");
  data.livoresMaximum = getRadioButtonValue("livoresMaximum");
  data.livoresDaumendruck = getRadioButtonValue("livoresDaumendruck");
  data.livoresVerlagerbarkeitVollstaendig = getRadioButtonValue("livoresVerlagerbarkeitVollstaendig");
  data.livoresVerlagerbarkeitUnvollstaendig = getRadioButtonValue("livoresVerlagerbarkeitUnvollstaendig");
  data.rigorBeginn = getRadioButtonValue("rigorBeginn");
  data.rigorWiederbildung = getRadioButtonValue("rigorWiederbildung");
  data.rigorMaximum = getRadioButtonValue("rigorMaximum");
  data.reizbarkeitAugenbraue = getRadioButtonValue("reizbarkeitAugenbraue");
  data.reizbarkeitOris = getRadioButtonValue("reizbarkeitOris");
  data.reizbarkeitIrisAtropin = getRadioButtonValue("reizbarkeitIrisAtropin");
  data.reizbarkeitIrisTropicamid = getRadioButtonValue("reizbarkeitIrisTropicamid");
  data.reizbarkeitIrisAcetylcholin = getRadioButtonValue("reizbarkeitIrisAcetylcholin");
  data.reizbarkeitIrisAdrenalin = getRadioButtonValue("reizbarkeitIrisAdrenalin");
  data.reizbarkeitIdioMuskulaererWulstReversible = getRadioButtonValue("reizbarkeitIdioMuskulaererWulstReversible");
  data.reizbarkeitIdioMuskulaererWulstPersistent = getRadioButtonValue("reizbarkeitIdioMuskulaererWulstPersistent");
  data.reizbarkeitZsako = getRadioButtonValue("reizbarkeitZsako");
  
  return data;
}

function calculateResults(data) {

  // initialize the messages
  if (data.errors == undefined) {
    data.errors = new Array();
  }
  if (data.warnings == undefined) {
    data.warnings = new Array();
  }
  
  // check the initial body temperature
  if (data.initialBodyTemperature != undefined && data.initialBodyTemperature != 37.2) {
    data.warnings.push("initial body temperature is not 37.2");
  }
  
  // handle intervals
  if (data.ambientTemperatureMax == undefined || isNaN(data.ambientTemperatureMax)) {
    data.ambientTemperatureMax = data.ambientTemperatureMin;
  }
  if (data.bodyWeightMax == undefined || isNaN(data.bodyWeightMax)) {
    data.bodyWeightMax = data.bodyWeightMin;
  }
  if (data.correctionFactorMax == undefined || isNaN(data.correctionFactorMax)) {
    data.correctionFactorMax = data.correctionFactorMin;
  }
  
  // adapt the correction factor based on the surface and clothing
  if (data.surface == "heavilyInsulating") {
    if (data.clothing == "thick") {
      data.correctionFactorMin = data.correctionFactorMin + heavyInsulationThickClothing;
      data.correctionFactorMax = data.correctionFactorMax + heavyInsulationThickClothing;
    } else if (data.clothing == "thin") {
      data.correctionFactorMin = data.correctionFactorMin + heavyInsulationThinClothing;
      data.correctionFactorMax = data.correctionFactorMax + heavyInsulationThinClothing;
    } else if (data.clothing == "naked") {
      data.correctionFactorMin = data.correctionFactorMin + heavyInsulationNoClothing;
      data.correctionFactorMax = data.correctionFactorMax + heavyInsulationNoClothing;
    }
  } else if (data.surface == "lightlyInsulating") {
      if (data.clothing == "thick" || data.clothing == "thin") {
        data.correctionFactorMin = data.correctionFactorMin + lightInsulationClothing;
        data.correctionFactorMax = data.correctionFactorMax + lightInsulationClothing;
      } else if (data.clothing == "naked") {
        data.correctionFactorMin = data.correctionFactorMin + lightInsulationNoClothing;
        data.correctionFactorMax = data.correctionFactorMax + lightInsulationNoClothing;
      }
  } else if (data.surface == "conducting") {
    if (data.clothing == "thick") {
      data.correctionFactorMin = data.correctionFactorMin + conductingThickClothing;
      data.correctionFactorMax = data.correctionFactorMax + conductingThickClothing;
    }
  }
  
  // adapt the correction factor for the body weight
  data.correctionFactorAdaptedMin = calculateCorrectionFactor(data.correctionFactorMin, data.bodyWeightMin);
  data.correctionFactorAdaptedMax = calculateCorrectionFactor(data.correctionFactorMax, data.bodyWeightMax);
  var correctionFactorAdapted = (data.correctionFactorAdaptedMin + data.correctionFactorAdaptedMax) / 2.0;

  // adapt the weight
  data.bodyWeightAdaptedMin = correctionFactorAdapted * data.bodyWeightMin;
  data.bodyWeightAdaptedMax = correctionFactorAdapted * data.bodyWeightMax;
  
  var ambientTemperature = (data.ambientTemperatureMin + data.ambientTemperatureMax) / 2.0;
  
  // compute the Q value
  data.q = (data.bodyTemperature - ambientTemperature) / (data.initialBodyTemperature - ambientTemperature);
  
  // compute the error
  data.temperatureErrorMin = computeErrorMin(ambientTemperature, data.q);
  data.temperatureErrorMax = computeErrorMax(ambientTemperature, data.q);
  
  // compute the post-mortem interval for the body temperature cooling
  data.tTempMinWithoutError = calculateWithBodyTemperature(data.bodyWeightAdaptedMin, ambientTemperature, data.q);
  data.tTempMaxWithoutError = calculateWithBodyTemperature(data.bodyWeightAdaptedMax, ambientTemperature, data.q);
  
  data.tTemperatureMin = Math.max(data.tTempMinWithoutError - data.temperatureErrorMin, 0);
  data.tTemperatureMax = data.tTempMaxWithoutError + data.temperatureErrorMax;
  
  // compute the post-mortem interval for livores
  tLivoresMin = timeUndefinedMin;
  tLivoresMax = timeUndefinedMax;
  if (data.livoresBeginn == "true") {
    tLivoresMin = Math.max(tLivoresMin, tLivoresBeginnMin);
  } else if (data.livoresBeginn == "false") {
    tLivoresMax = Math.min(tLivoresMax, tLivoresBeginnMax);
  }
  if (data.livoresKonfluenz == "true") {
    tLivoresMin = Math.max(tLivoresMin, tLivoresKonfluenzMin);
  } else if (data.livoresKonfluenz == "false") {
     tLivoresMax = Math.min(tLivoresMax, tLivoresKonfluenzMax);
  }
  if (data.livoresDaumendruck == "false") {
    tLivoresMin = Math.max(tLivoresMin, tLivoresDaumendruckMin);
  } else if (data.livoresDaumendruck == "true") {
    tLivoresMax = Math.min(tLivoresMax, tLivoresDaumendruckMax);
  }
  if (data.livoresVerlagerbarkeitVollstaendig == "false") {
    tLivoresMin = Math.max(tLivoresMin, tLivoresVerlagerbarkeitVollstaendigMin);
  } else if (data.livoresVerlagerbarkeitVollstaendig == "true") {
    tLivoresMax = Math.min(tLivoresMax, tLivoresVerlagerbarkeitVollstaendigMax);
  }
  if (data.livoresMaximum == "true") {
    tLivoresMin = Math.max(tLivoresMin, tLivoresMaximumMin);
  } else if (data.livoresMaximum == "false") {
    tLivoresMax = Math.min(tLivoresMax, tLivoresMaximumMax);
  }
  if (data.livoresVerlagerbarkeitUnvollstaendig == "false") {
    tLivoresMin = Math.max(tLivoresMin, tLivoresVerlagerbarkeitUnvollstaendigMin);
  } else if (data.livoresVerlagerbarkeitUnvollstaendig == "true") {
    tLivoresMax = Math.min(tLivoresMax, tLivoresVerlagerbarkeitUnvollstaendigMax);
  }
  if (tLivoresMin == timeUndefinedMin) {
    tLivoresMin = undefined;
  }
  if (tLivoresMax == timeUndefinedMax) {
    tLivoresMax = undefined;
  }
  data.tLividityMin = tLivoresMin;
  data.tLividityMax = tLivoresMax;
  
  // compute the post-mortem interval for rigor
  var tRigorMin = timeUndefinedMin;
  var tRigorMax = timeUndefinedMax;
  if (data.rigorBeginn == "true") {
    tRigorMin = Math.max(tRigorMin, tRigorBeginnMin);
  } else if (data.rigorBeginn == "false") {
    tRigorMax = Math.min(tRigorMax, tRigorBeginnMax);
  }
  if (data.rigorWiederbildung == "false") {
    tRigorMin = Math.max(tRigorMin, tRigorWiederbildungMin);
  } else if (data.rigorWiederbildung == "true") {
    tRigorMax = Math.min(tRigorMax, tRigorWiederbildungMax);
  }
  if (data.rigorMaximum == "true") {
    tRigorMin = Math.max(tRigorMin, tRigorMaximumMin);
  } else if (data.rigorMaximum == "false") {
    tRigorMax = Math.min(tRigorMax, tRigorMaximumMax);
  }
  if (tRigorMin == timeUndefinedMin) {
    tRigorMin = undefined;
  }
  if (tRigorMax == timeUndefinedMax) {
    tRigorMax = undefined;
  }
  data.tRigorMin = tRigorMin;
  data.tRigorMax = tRigorMax;
  
  // compute the post-mortem interval for reizbarkeitAugenbraue
  var tAugenbraueMin = timeUndefinedMin;
  var tAugenbraueMax = timeUndefinedMax;
  if (data.reizbarkeitAugenbraue == "grad1") {
    tAugenbraueMin = tAugenbraueGrad1Min;
    tAugenbraueMax = tAugenbraueGrad1Max;
  } else if (data.reizbarkeitAugenbraue == "grad2") {
    tAugenbraueMin = tAugenbraueGrad2Min;
    tAugenbraueMax = tAugenbraueGrad2Max;
  } else if (data.reizbarkeitAugenbraue == "grad3") {
    tAugenbraueMin = tAugenbraueGrad3Min;
    tAugenbraueMax = tAugenbraueGrad3Max;
  } else if (data.reizbarkeitAugenbraue == "grad4") {
    tAugenbraueMin = tAugenbraueGrad4Min;
    tAugenbraueMax = tAugenbraueGrad4Max;
  } else if (data.reizbarkeitAugenbraue == "grad5") {
    tAugenbraueMin = tAugenbraueGrad5Min;
    tAugenbraueMax = tAugenbraueGrad5Max;
  } else if (data.reizbarkeitAugenbraue == "grad6") {
    tAugenbraueMin = tAugenbraueGrad6Min;
    tAugenbraueMax = tAugenbraueGrad6Max;
  }
  if (tAugenbraueMin == timeUndefinedMin) {
    tAugenbraueMin = undefined;
  }
  if (tAugenbraueMax == timeUndefinedMax) {
    tAugenbraueMax = undefined;
  }
  data.tMimicMin = tAugenbraueMin;
  data.tMimicMax = tAugenbraueMax;
  
  // compute the post-mortem interval for reizbarkeitOris
  var tOrbicularisMin = timeUndefinedMin;
  var tOrbicularisMax = timeUndefinedMax;
  if (data.reizbarkeitOris == "grad1") {
    tOrbicularisMin = tOrisGrad1Min;
    tOrbicularisMax = tOrisGrad1Max;
  } else if (data.reizbarkeitOris == "grad2") {
    tOrbicularisMin = tOrisGrad2Min;
    tOrbicularisMax = tOrisGrad2Max;
  } else if (data.reizbarkeitOris == "grad3") {
    tOrbicularisMin = tOrisGrad3Min;
    tOrbicularisMax = tOrisGrad3Max;
  }
  if (tOrbicularisMin == timeUndefinedMin) {
    tOrbicularisMin = undefined;
  }
  if (tOrbicularisMax == timeUndefinedMax) {
    tOrbicularisMax = undefined;
  }
  data.tOrbicularisMin = tOrbicularisMin;
  data.tOrbicularisMax = tOrbicularisMax;
  
  // compute the post-mortem interval for the chemical exitability of the iris
  var tIrisMin = timeUndefinedMin;
  var tIrisMax = timeUndefinedMax;
  if (data.reizbarkeitIrisAtropin == "positive") {
    tIrisMax = Math.min(tIrisMax, tIrisAtropinMax);
  } else if (data.reizbarkeitIrisAtropin == "negative") {
    tIrisMin = Math.max(tIrisMin, tIrisAtropinMin);
  }
  if (data.reizbarkeitIrisTropicamid == "positive") {
    tIrisMax = Math.min(tIrisMax, tIrisTropicamidMax);
  } else if (data.reizbarkeitIrisTropicamid == "negative") {
    tIrisMin = Math.max(tIrisMin, tIrisTropicamidMin);
  }
  if (data.reizbarkeitIrisAcetylcholin == "positive") {
    tIrisMax = Math.min(tIrisMax, tIrisAcetylcholinMax);
  } else if (data.reizbarkeitIrisAcetylcholin == "negative") {
    tIrisMin = Math.max(tIrisMin, tIrisAcetylcholinMin);
  }
  if (data.reizbarkeitIrisAdrenalin == "positive") {
    tIrisMax = Math.min(tIrisMax, tIrisAdrenalinMax);
  } else if (data.reizbarkeitIrisAdrenalin == "negative") {
    tIrisMin = Math.max(tIrisMin, tIrisAdrenalinMin);
  }
  if (tIrisMin == timeUndefinedMin) {
    tIrisMin = undefined;
  }
  if (tIrisMax == timeUndefinedMax) {
    tIrisMax = undefined;
  }
  data.tIrisMin = tIrisMin;
  data.tIrisMax = tIrisMax;
  
  // compute the post-mortem interval for zsako
  var tReizbarkeitZsakoMin = timeUndefinedMin;
  var tReizbarkeitZsakoMax = timeUndefinedMax;
  if (data.reizbarkeitZsako == "positive") {
    tReizbarkeitZsakoMax = Math.min(tReizbarkeitZsakoMax, tZsakoMax);
  } else if (data.reizbarkeitZsako == "negative") {
    tReizbarkeitZsakoMin = Math.max(tReizbarkeitZsakoMax, tZsakoMin);
  }
  if (tReizbarkeitZsakoMin == timeUndefinedMin) {
    tReizbarkeitZsakoMin = undefined;
  }
  if (tReizbarkeitZsakoMax == timeUndefinedMax) {
    tReizbarkeitZsakoMax = undefined;
  }
  data.tReizbarkeitZsakoMin = tReizbarkeitZsakoMin;
  data.tReizbarkeitZsakoMax = tReizbarkeitZsakoMax;

  // compute the post-mortem interval for the idiomuskulaerer wulst
  var tIdioMuskulaererWulstMin = timeUndefinedMin;
  var tIdioMuskulaererWulstMax = timeUndefinedMax;
  if (data.reizbarkeitIdioMuskulaererWulstReversible == "positive") {
    tIdioMuskulaererWulstMax = Math.min(tIdioMuskulaererWulstMax, tIdioReversibleMax);
  } else if (data.reizbarkeitIdioMuskulaererWulstReversible == "negative") {
    tIdioMuskulaererWulstMin = Math.max(tIdioMuskulaererWulstMin, tIdioReversibleMin);
  }
  if (data.reizbarkeitIdioMuskulaererWulstPersistent == "positive") {
    tIdioMuskulaererWulstMax = Math.min(tIdioMuskulaererWulstMax, tIdioPersistentMax);
  // } else if (data.reizbarkeitIdioMuskulaererWulstPersistent == "negative") {
  //   tIdioMuskulaererWulstMin = Math.max(tIdioMuskulaererWulstMin, tIdioPersistentMin);
  }
  if (tIdioMuskulaererWulstMin == timeUndefinedMin) {
    tIdioMuskulaererWulstMin = undefined;
  }
  if (tIdioMuskulaererWulstMax == timeUndefinedMax) {
    tIdioMuskulaererWulstMax = undefined;
  }
  data.tIdioMuskulaererWulstMin = tIdioMuskulaererWulstMin;
  data.tIdioMuskulaererWulstMax = tIdioMuskulaererWulstMax;
  
  // compute the post-mortem interval
  var tMin = data.tTemperatureMin;
  var tMax = data.tTemperatureMax;
  
  if (tMin == undefined || isNaN(tMin)) {
    tMin = data.tLividityMin;
  }
  if (tMax == undefined || isNaN(tMax)) {
    tMax = data.tLividityMax;
  }
  if (data.tLividityMin > tMin) {
    tMin = data.tLividityMin;
  }
  if (data.tLividityMax < tMax) {
    tMax = data.tLividityMax;
  }

  if (tMin == undefined || isNaN(tMin)) {
    tMin = data.tRigorMin;
  }
  if (tMax == undefined || isNaN(tMax)) {
    tMax = data.tRigorMax;
  }
  if (data.tRigorMin > tMin) {
    tMin = data.tRigorMin;
  }
  if (data.tRigorMax < tMax) {
    tMax = data.tRigorMax;
  }

  if (tMin == undefined || isNaN(tMin)) {
    tMin = data.tMimicMin;   
  }
  if (tMax == undefined || isNaN(tMax)) {
     tMax = data.tMimicMax;
  }
  if (data.tMimicMin > tMin) {
     tMin = data.tMimicMin;
  }
  if (data.tMimicMax < tMax) {
     tMax = data.tMimicMax;
  }
  
  if (tMin == undefined || isNaN(tMin)) {
    tMin = data.tOrbicularisMin;
  }
  if (tMax == undefined || isNaN(tMax)) {
    tMax = data.tOrbicularisMax;
  }
  if (data.tOrbicularisMin > tMin) {
    tMin = data.tOrbicularisMin;
  }
  if (data.tOrbicularisMax < tMax) {
    tMax = data.tOrbicularisMax;
  }
  
  if (tMin == undefined || isNaN(tMin)) {
    tMin = data.tIrisMin;
  }
  if (tMax == undefined || isNaN(tMax)) {
    tMax = data.tIrisMax;
  }
  if (data.tIrisMin > tMin) {
    tMin = data.tIrisMin;
  }
  if (data.tIrisMax < tMax) {
    tMax = data.tIrisMax;
  }
  
  if (tMin == undefined || isNaN(tMin)) {
    tMin = data.tReizbarkeitZsakoMin;
  }
  if (tMax == undefined || isNaN(tMax)) {
    tMax = data.tReizbarkeitZsakoMax;
  }
  if (data.tReizbarkeitZsakoMin > tMin) {
    tMin = data.tReizbarkeitZsakoMin;
  }
  if (data.tReizbarkeitZsakoMax < tMax) {
    tMax = data.tReizbarkeitZsakoMax;
  }

  if (tMin == undefined || isNaN(tMin)) {
    tMin = data.tIdioMuskulaererWulstMin;
  }
  if (tMax == undefined || isNaN(tMax)) {
    tMax = data.tIdioMuskulaererWulstMax;
  }
  if (data.tIdioMuskulaererWulstMin > tMin) {
    tMin = data.tIdioMuskulaererWulstMin;
  }
  if (data.tIdioMuskulaererWulstMax < tMax) {
    tMax = data.tIdioMuskulaererWulstMax;
  }
  
  data.tMin = tMin;
  data.tMax = tMax;

  // validate the result
  if (data.tMin > data.tMax) {
    data.errors.push("The computed lower bound of the interval is bigger than the higher bound.");
  }
  
  // compute the absolute time
  data.tMinAbsolute = new Date(data.measurementDate.getTime() - Math.round(data.tMax * 60 * 60 * 1000));
  data.tMaxAbsolute = new Date(data.measurementDate.getTime() - Math.round(data.tMin * 60 * 60 * 1000));  
}

function renderResults(data) {
  // clean the results
  $("#tRelative").empty();
  $("#tAbsolute").empty();
  $("#messages").empty();
  $("#tTemperature").empty();
  $("#tLividity").empty();
  $("#tRigor").empty();
  $("#tMimic").empty();
  $("#tOrbicularis").empty();
  $("#tIris").empty();
  $("#tZsako").empty();
  $("#tIdio").empty();
  $("#correctionFactorAdapted").empty();
  $("#bodyWeightAdapted").empty();
  $("#q").empty();
  $("#temperatureError").empty();
  $("#tTempWithoutError").empty();
  
  // render the results
  $("#tRelative").append(renderDuration(data.tMin, data.tMax));
  $("#tAbsolute").append(renderDateInterval(data.tMinAbsolute, data.tMaxAbsolute));
  $(data.errors).each(function (i, message) {
    var messageTag = $("<div/>").addClass("error");
    messageTag.append(message);
    $("#messages").append(messageTag);
  });
  $(data.warnings).each(function (i, message) {
    var messageTag = $("<div/>").addClass("warning");
    messageTag.append(message);
    $("#messages").append(messageTag);
  });
  $("#tTemperature").append(renderDuration(data.tTemperatureMin, data.tTemperatureMax));
  $("#tLividity").append(renderDuration(data.tLividityMin, data.tLividityMax));
  $("#tRigor").append(renderDuration(data.tRigorMin, data.tRigorMax));
  $("#tMimic").append(renderDuration(data.tMimicMin, data.tMimicMax));
  $("#tOrbicularis").append(renderDuration(data.tOrbicularisMin, data.tOrbicularisMax));
  $("#tIris").append(renderDuration(data.tIrisMin, data.tIrisMax));
  $("#tZsako").append(renderDuration(data.tReizbarkeitZsakoMin, data.tReizbarkeitZsakoMax));
  $("#tIdio").append(renderDuration(data.tIdioMuskulaererWulstMin, data.tIdioMuskulaererWulstMax));
  
  // render the helpers
  $("#correctionFactorAdapted").append(renderNumberInterval(data.correctionFactorAdaptedMin, data.correctionFactorAdaptedMax));
  $("#bodyWeightAdapted").append(renderNumberInterval(data.bodyWeightAdaptedMin, data.bodyWeightAdaptedMax));
  $("#q").append(roundNumber(data.q));
  $("#temperatureError").append(renderNumberInterval(data.temperatureErrorMin, data.temperatureErrorMax));
  $("#tTempWithoutError").append(renderDuration(data.tTempMinWithoutError, data.tTempMaxWithoutError));
  
  if (isMobile()) {
    $.mobile.changePage($("#results"), { transition: "slide", changeHash: changeHash });
  }
}

function initializeForm() {
  
  // initialize fields
  var now = new Date();
  $("#measurementDate").val(formatDate(now));
  $("#measurementTime").val(formatTime(now));

  // initialize validation and submission  
  $("#parametersForm").validate({
    errorElement: "span",
    messages: {
      ambientTemperatureMin: {
        number: "number",
        required: "mandatory"
      },
      ambientTemperatureMax: {
        number: "number"
      },
      initialBodyTemperature: {
        number: "number",
        required: "mandatory"
      },
      bodyTemperature: {
        number: "number",
        required: "mandatory"
      },
      bodyWeightMin: {
        number: "number",
        required: "mandatory"
      },
      bodyWeightMax: {
        number: "number"
      },
      correctionFactorMin: {
        number: "number",
        required: "mandatory"
      },
      correctionFactorMax: {
        number: "number"
      }
    },
    submitHandler : function(form) {
      try {
        var data = collectData();
        calculateResults(data);
        renderResults(data);
      } catch (e) {
        console.log(e);
      } finally {
        return false;
      }
    }
  });

}

// initialization
$(document).ready(function() {
  
  if (isDesktop()) {
    initializeDesktop();
  }
  if (isMobile()) {
    initializeMobile();
  }
  
  initializeForm();

});

$(document).bind("pageshow", function() {
  var currentPage = $.mobile.activePage.attr('id');

  // if this is the first page we load
  if (firstPage) {
	firstPage = false;
	
	// go to the splash page (if we are not already there)
	if ("splash" != currentPage) {
      $.mobile.changePage($("#splash"), {
			transition: "fade",
			changeHash: changeHash
	  	  });
	  return;
    }

  }

  // if we are on the splash page, schedule the transition to the capture page
  if ("splash" == currentPage) {
	    	  window.setTimeout(function () {
	    $.mobile.changePage($("#capture"), {
	  		  transition: "flip",
	  		  changeHash: changeHash
	    	    });
	  }, 2000);
    };

  var correctionFactorMinTmp = $("input#correctionFactorMin").val();
  var correctionFactorMaxTmp = $("input#correctionFactorMax").val();
  updateCorrectionFactorGraphics(correctionFactorMinTmp, correctionFactorMaxTmp, "min");
});

$(window).resize(function(){
  var correctionFactorMinTmp = $("input#correctionFactorMin").val();
  var correctionFactorMaxTmp = $("input#correctionFactorMax").val();
  updateCorrectionFactorGraphics(correctionFactorMinTmp, correctionFactorMaxTmp, "min");
});
