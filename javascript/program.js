var dataSet = null;
var sortingPreferences = [{key: "copay", value: true}, {key: "premium", value: true}, {key: "annualLimit", value: false}];

$(document).ready(function() {
    $.getJSON("data/dataset.json", function(data) {
        dataSet = data;
        createTable(dataSet);

        // tests
        createTestUI();

        $(".sortableHeader").click(function() {
            if(dataSet.sortingId !== this.id) {
                dataSet.sortingId = this.id;
                dataSet.numericSorting = this.classList.contains("numericHeader");
                // Reset the sorting to ascending by forcing a descending to ascending toggle
                dataSet.sortAscending = false;
            }

            var sortingPreference = sortingPreferences.filter(function(element) {
                return element.key === dataSet.sortingId;
            });

            dataSet.sortAscending = sortingPreference.length !== 0 ? sortingPreference[0].value : !dataSet.sortAscending;

            var sortableData = dataSet.filter(function() { return true; });
            sortableData.sortingId = dataSet.sortingId;
            sortableData.numericSorting = dataSet.numericSorting;
            sortableData.sortAscending = dataSet.sortAscending;

            sortData(sortableData);
            updateTableBody(sortableData);
        });
    });
});

function createTable(data) {
    var headerTitles = [];
    $.each($(data).first()[0], function (key, value) {
        var isNumeric = $.isNumeric(value);
        var textAlignmentStyle = "style='text-align: " + (isNumeric ? "right;'" : "left;'");
        var classNames = "class = 'sortableHeader " + (isNumeric ? "numericHeader" : "") + "'";
        headerTitles.push("<th " + classNames + " " + textAlignmentStyle + " id='" +  key + "'>" + key + "</th>");
    });
    $("<table/>", {
        "border": 0,
        "class": "sortableTable"
    }).appendTo("body");
    $("<thead/>").appendTo("table");
    $("<tr/>", {
        "class": "headerRow",
        html: headerTitles.join("")
    }).appendTo("thead");
    $("<tbody/>").appendTo("table");

    updateTableBody(data);
}

function updateTableBody(data) {
    // Clear out any existing rows in the table body so that the
    // table can be recreated with the newly sorted data
    $("tbody > tr").remove();

    $.each(data, function (key, value) {
        var items = [];
        $.each(value, function (key, value) {
            var textAlignmentStyle = "style='text-align: " + ($.isNumeric(value) ? "right;'" : "left;'");
            items.push("<td " + textAlignmentStyle + ">" + value + "</td>");
        });
        $("<tr/>", {
            html: items.join("")
        }).appendTo("tbody");
    });
}

function sortData(data) {
    var sortByNumericKey = function(a, b) {
        return data.sortAscending ?
            a[data.sortingId] - b[data.sortingId] :
            b[data.sortingId] - a[data.sortingId];
    };

    var sortByKey = function(a, b) {
        return a[data.sortingId] === b[data.sortingId] ? 0 :
            (data.sortAscending ?
                (a[data.sortingId] > b[data.sortingId] ? 1 : -1) :
                (a[data.sortingId] > b[data.sortingId] ? -1 : 1));
    };

    data.sort(data.numericSorting ? sortByNumericKey : sortByKey);
}

// Test Code
var validJSONs = null;

function createTestUI() {
    $("<div/>", {
        "id": "Tests",
        html: "<hr><h1>Run Tests</h1><button id='runTests'>Run Tests</button>"
    }).appendTo("body");

    $.getJSON("data/tests/validData.json", function (data) {
        validJSONs = data;
    });

    $('#runTests').click(runTests);
}

function runTests() {
    $("<ul/>", {
        "id": 'testOutputs'
    }).appendTo("div");

    $.getJSON("data/tests/test.json", function(data) {
        var testData = data.filter(function() { return true; });
        var testPassed = testDataSorting(testData, validJSONs.validCarrierSortAscending, "carrierName", true);

        // Carrier Name Testing
        $("<li/>", {
            "class": "testResult " + (testPassed ? "testPassed" : "testFailed"),
            html: "Sort Carrier Name (Ascending): " + (testPassed ? "Passed!" : "Failed!")
        }).appendTo("ul");

        testData = data.filter(function() { return true; });
        testPassed = testDataSorting(testData, validJSONs.validCarrierSortDescending, "carrierName", false);

        $("<li/>", {
            "class": "testResult " + (testPassed ? "testPassed" : "testFailed"),
            html: "Sort Carrier Name (Descending): " + (testPassed ? "Passed!" : "Failed!")
        }).appendTo("ul");

        // Plan Name Testing
        testData = data.filter(function() { return true; });
        testPassed = testDataSorting(testData, validJSONs.validPlanSortAscending, "planName", true);

        $("<li/>", {
            "class": "testResult " + (testPassed ? "testPassed" : "testFailed"),
            html: "Sort Plan Name (Ascending): " + (testPassed ? "Passed!" : "Failed!")
        }).appendTo("ul");

        testData = data.filter(function() { return true; });
        testPassed = testDataSorting(testData, validJSONs.validPlanSortDescending, "planName", false);

        $("<li/>", {
            "class": "testResult " + (testPassed ? "testPassed" : "testFailed"),
            html: "Sort Plan Name (Descending): " + (testPassed ? "Passed!" : "Failed!")
        }).appendTo("ul");

        // Copay Testing
        testData = data.filter(function() { return true; });
        testPassed = testDataSorting(testData, validJSONs.validCopaySortAscending, "copay", true);

        $("<li/>", {
            "class": "testResult " + (testPassed ? "testPassed" : "testFailed"),
            html: "Sort Copay (Ascending): " + (testPassed ? "Passed!" : "Failed!")
        }).appendTo("ul");

        testData = data.filter(function() { return true; });
        testPassed = testDataSorting(testData, validJSONs.validCopaySortDescending, "copay", false);

        $("<li/>", {
            "class": "testResult " + (testPassed ? "testPassed" : "testFailed"),
            html: "Sort Copay (Descending): " + (testPassed ? "Passed!" : "Failed!")
        }).appendTo("ul");

        // Premium Testing
        testData = data.filter(function() { return true; });
        testPassed = testDataSorting(testData, validJSONs.validPremiumSortAscending, "premium", true);

        $("<li/>", {
            "class": "testResult " + (testPassed ? "testPassed" : "testFailed"),
            html: "Sort Premium (Ascending): " + (testPassed ? "Passed!" : "Failed!")
        }).appendTo("ul");

        testData = data.filter(function() { return true; });
        testPassed = testDataSorting(testData, validJSONs.validPremiumSortDescending, "premium", false);

        $("<li/>", {
            "class": "testResult " + (testPassed ? "testPassed" : "testFailed"),
            html: "Sort Premium (Descending): " + (testPassed ? "Passed!" : "Failed!")
        }).appendTo("ul");

        // Annual Limit Testing
        testData = data.filter(function() { return true; });
        testPassed = testDataSorting(testData, validJSONs.validAnnualLimitSortAscending, "annualLimit", true);

        $("<li/>", {
            "class": "testResult " + (testPassed ? "testPassed" : "testFailed"),
            html: "Sort Annual Limit (Ascending): " + (testPassed ? "Passed!" : "Failed!")
        }).appendTo("ul");

        testData = data.filter(function() { return true; });
        testPassed = testDataSorting(testData, validJSONs.validAnnualLimitSortDescending, "annualLimit", false);

        $("<li/>", {
            "class": "testResult " + (testPassed ? "testPassed" : "testFailed"),
            html: "Sort Annual Limit (Descending): " + (testPassed ? "Passed!" : "Failed!")
        }).appendTo("ul");
    });
}
