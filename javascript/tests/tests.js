function testDataSorting(inputData, validOutputData, sortingId, sortAscending) {
    if(!dataSetsMatch(inputData, validOutputData)) return false;

    inputData.sortingId = sortingId;
    inputData.sortAscending = sortAscending;
    inputData.numericSorting = $.isNumeric($(inputData).first()[0][inputData.sortingId]);
    sortData(inputData);
    return dataMatches(inputData, validOutputData);
}

function dataSetsMatch(inputData, validOutputData) {
    if (inputData.length !== validOutputData.length) { return false; }
    var inputDataKeys = Object.keys(inputData[0]);
    var validOutputDataKeys = Object.keys(validOutputData[0]);
    if (inputDataKeys.length !== validOutputDataKeys.length) { return false; }
    return inputDataKeys.every(function(element) { return validOutputDataKeys.indexOf(element) !== -1; });
}

function dataMatches(sortedData, validSortedData) {
    for (var index = 0; index < sortedData.length; ++index) {
        var sortedDatum = sortedData[index];
        var validSortedDatum = validSortedData[index];
        for(var sortedVariableName in sortedDatum) {
            if (sortedDatum[sortedVariableName] !== validSortedDatum[sortedVariableName]) {
                return false;
            }
        }
    }
    return true;
}