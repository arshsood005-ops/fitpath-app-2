document.addEventListener("DOMContentLoaded", function () {
  var planContent = document.getElementById("plan-content");
  var errorContent = document.getElementById("error-content");
  var downloadBtn = document.getElementById("download-btn");

  var user = getUserData();

  if (!user) {
    planContent.style.display = "none";
    errorContent.style.display = "block";
    return;
  }

  renderSummary(user);

  var plans = generatePlans(user);
  document.getElementById("diet-plan").innerHTML = plans.diet;
  document.getElementById("workout-plan").innerHTML = plans.workout;

  downloadBtn.addEventListener("click", function () {
    downloadPDF(user, plans);
  });

  // Read data from URL params, fallback to localStorage
  function getUserData() {
    var params = new URLSearchParams(window.location.search);

    if (params.has("name") && params.has("goal")) {
      return {
        name: decodeURIComponent(params.get("name")),
        age: parseInt(params.get("age")) || 25,
        weight: parseFloat(params.get("weight")) || 70,
        height: parseFloat(params.get("height")) || 175,
        goal: decodeURIComponent(params.get("goal")),
        activity: decodeURIComponent(params.get("activity")) || "Beginner",
      };
    }

    var raw = localStorage.getItem("userData");
    return raw ? JSON.parse(raw) : null;
  }

  // Render user summary
  function renderSummary(user) {
    document.getElementById("greeting").textContent =
      "Hey " + user.name + ", here\u2019s a plan built for you.";
    document.getElementById("sum-name").textContent = user.name;
    document.getElementById("sum-age").textContent = user.age + " yrs";
    document.getElementById("sum-weight").textContent = user.weight + " kg";
    document.getElementById("sum-height").textContent = user.height + " cm";
    document.getElementById("sum-goal").textContent = user.goal;
    document.getElementById("sum-activity").textContent = user.activity;
  }

  // Generate plans based on user inputs
  function generatePlans(user) {
    var isFatLoss = user.goal === "Fat Loss";
    var needsCardio = user.weight > 85;
    var calProtein = Math.round(user.weight * (isFatLoss ? 2 : 2.2));

    var plans = isFatLoss
      ? getFatLossPlan(user.activity, needsCardio, calProtein)
      : getMuscleGainPlan(user.activity, needsCardio, calProtein);

    return {
      diet: renderList(plans.diet),
      workout: renderList(plans.workout),
    };
  }

  function getFatLossPlan(activity, needsCardio, protein) {
    var diet = [
      "Maintain a 300\u2013500 calorie deficit daily",
      "Eat " + protein + "g protein per day (" + Math.round(protein / 10) * 10 + "g target)",
      "Minimize added sugars and processed foods",
      "Prioritize vegetables, lean meats, and whole grains",
      "Drink 2.5\u20133 liters of water daily",
    ];

    if (needsCardio) {
      diet.push("Add 1 extra cardio session per week due to current weight");
    }

    var workout;

    if (activity === "Beginner") {
      workout = [
        "<span class='day-label'>Monday</span> 20\u201330 min brisk walking",
        "<span class='day-label'>Tuesday</span> Light full-body: bodyweight squats, push-ups, planks (2 sets x 10)",
        "<span class='day-label'>Wednesday</span> Rest or light stretching",
        "<span class='day-label'>Thursday</span> 20 min walk + light core work",
        "<span class='day-label'>Friday</span> Light full-body: lunges, wall push-ups, bird dogs (2 sets x 10)",
        "<span class='day-label'>Saturday</span> 30 min easy walk or cycling",
        "<span class='day-label'>Sunday</span> Rest",
      ];
    } else if (activity === "Intermediate") {
      workout = [
        "<span class='day-label'>Monday</span> 30 min cardio (jogging or cycling)",
        "<span class='day-label'>Tuesday</span> Full-body strength (3 sets x 12 reps)",
        "<span class='day-label'>Wednesday</span> Rest or yoga",
        "<span class='day-label'>Thursday</span> 25 min HIIT intervals",
        "<span class='day-label'>Friday</span> Upper-body strength (3 sets x 12 reps)",
        "<span class='day-label'>Saturday</span> 40 min steady-state cardio",
        "<span class='day-label'>Sunday</span> Rest",
      ];
    } else {
      workout = [
        "<span class='day-label'>Monday</span> 40 min HIIT + core finisher",
        "<span class='day-label'>Tuesday</span> Push: bench press, OHP, dips (4 sets x 10 reps)",
        "<span class='day-label'>Wednesday</span> 30 min cardio (running or rowing)",
        "<span class='day-label'>Thursday</span> Pull: deadlifts, rows, curls (4 sets x 10 reps)",
        "<span class='day-label'>Friday</span> Legs: squats, lunges, calf raises (4 sets x 10 reps)",
        "<span class='day-label'>Saturday</span> 45 min cardio + mobility work",
        "<span class='day-label'>Sunday</span> Rest",
      ];
    }

    return { diet: diet, workout: workout };
  }

  function getMuscleGainPlan(activity, needsCardio, protein) {
    var diet = [
      "Maintain a 200\u2013400 calorie surplus daily",
      "Eat " + protein + "g protein per day (" + Math.round(protein / 10) * 10 + "g target)",
      "Include complex carbs: rice, oats, potatoes, whole grains",
      "Eat 4\u20136 meals per day spaced evenly",
      "Prioritize post-workout meal: protein + fast carbs",
    ];

    if (needsCardio) {
      diet.push("Limit cardio to 2 light sessions per week to preserve gains");
    }

    var workout;

    if (activity === "Beginner") {
      workout = [
        "<span class='day-label'>Monday</span> Full-body: goblet squats, push-ups, rows (3 sets x 10)",
        "<span class='day-label'>Tuesday</span> Rest",
        "<span class='day-label'>Wednesday</span> Full-body: lunges, dumbbell press, lat pulldown (3 sets x 10)",
        "<span class='day-label'>Thursday</span> Rest",
        "<span class='day-label'>Friday</span> Full-body: deadlifts, overhead press, curls (3 sets x 10)",
        "<span class='day-label'>Saturday</span> Light walk or rest",
        "<span class='day-label'>Sunday</span> Rest",
      ];
    } else if (activity === "Intermediate") {
      workout = [
        "<span class='day-label'>Monday</span> Chest &amp; Triceps: bench, flyes, pushdowns (4 sets x 8\u201310)",
        "<span class='day-label'>Tuesday</span> Back &amp; Biceps: rows, pulldowns, curls (4 sets x 8\u201310)",
        "<span class='day-label'>Wednesday</span> Rest",
        "<span class='day-label'>Thursday</span> Shoulders &amp; Abs: OHP, lateral raises, planks (4 sets x 10)",
        "<span class='day-label'>Friday</span> Legs: squats, leg press, calf raises (4 sets x 8\u201310)",
        "<span class='day-label'>Saturday</span> Arms &amp; weak points (3 sets x 12)",
        "<span class='day-label'>Sunday</span> Rest",
      ];
    } else {
      workout = [
        "<span class='day-label'>Monday</span> Heavy chest &amp; triceps: bench 5x5, dips, close-grip bench",
        "<span class='day-label'>Tuesday</span> Heavy back &amp; biceps: deadlift 5x5, barbell rows, chin-ups",
        "<span class='day-label'>Wednesday</span> Rest or light cardio (20 min)",
        "<span class='day-label'>Thursday</span> Heavy shoulders &amp; abs: OHP 5x5, face pulls, ab wheel",
        "<span class='day-label'>Friday</span> Heavy legs: squat 5x5, leg press, Romanian deadlifts",
        "<span class='day-label'>Saturday</span> Volume day: all muscle groups (3 sets x 15 reps)",
        "<span class='day-label'>Sunday</span> Rest",
      ];
    }

    return { diet: diet, workout: workout };
  }

  // Render list items as HTML
  function renderList(items) {
    var html = "<ul>";
    for (var i = 0; i < items.length; i++) {
      html += "<li>" + items[i] + "</li>";
    }
    html += "</ul>";
    return html;
  }

  // Strip HTML tags for PDF
  function stripHtml(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  // Download as PDF using jsPDF
  function downloadPDF(user, plans) {
    var doc = new jspdf.jsPDF();
    var y = 20;
    var pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(22);
    doc.setFont(undefined, "bold");
    doc.text("FitPath Personalized Plan", pageWidth / 2, y, { align: "center" });
    y += 12;

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(120);
    doc.text("Generated for " + user.name, pageWidth / 2, y, { align: "center" });
    doc.setTextColor(0);
    y += 15;

    // Divider
    doc.setDrawColor(200);
    doc.line(20, y, pageWidth - 20, y);
    y += 12;

    // User Details
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Your Details", 20, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    var details = [
      "Name: " + user.name,
      "Age: " + user.age + " years",
      "Weight: " + user.weight + " kg",
      "Height: " + user.height + " cm",
      "Goal: " + user.goal,
      "Activity Level: " + user.activity,
    ];

    for (var i = 0; i < details.length; i++) {
      doc.text(details[i], 20, y);
      y += 6;
    }

    y += 8;

    // Diet Plan
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Diet Plan", 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    var dietItems = stripHtml(plans.diet).split("\n");
    for (var j = 0; j < dietItems.length; j++) {
      var lines = doc.splitTextToSize(dietItems[j], pageWidth - 45);
      for (var k = 0; k < lines.length; k++) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(lines[k], 25, y);
        y += 5.5;
      }
    }

    y += 8;

    // Workout Plan
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Workout Plan", 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    var workoutItems = stripHtml(plans.workout).split("\n");
    for (var m = 0; m < workoutItems.length; m++) {
      var wl = doc.splitTextToSize(workoutItems[m], pageWidth - 45);
      for (var n = 0; n < wl.length; n++) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(wl[n], 25, y);
        y += 5.5;
      }
    }

    // Footer
    y += 12;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Generated by FitPath \u2022 Stay consistent, see results", pageWidth / 2, y, { align: "center" });

    doc.save("fitpath-plan.pdf");
  }
});
