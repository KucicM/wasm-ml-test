var session = null;
const class2label = {0: "NON-ENG", 1: "ENG"};
const label2class = {"NON-ENG": 0, "ENG": 1};

async function run() {
    const status = document.getElementById("status");
    status.style.visibility = "";

    if (session === null) {
        status.innerText = "Loading model";
        const modelPath = "models/model.onnx";
        session = await ort.InferenceSession.create(modelPath);
    }
    status.innerText = "Processing";

    const text = document.getElementById("textbox").value;
    const words = text.replace(/\n/g, " ").split(" ");

    const inputTensor = new ort.Tensor("string", words);
    const output = await session.run({text_input: inputTensor});

    const table = document.getElementById("table");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    for (var i = 0; i < words.length; i++) {
        if (words[i] === "") {
            continue;
        }

        var row = table.insertRow(table.rows.length);
        row.insertCell(0).innerHTML = words[i];
        row.insertCell(1).innerHTML = class2label[output.label.data[i]];
        row.insertCell(2).innerHTML = Math.abs(output.probabilities.data[i * 2]);
    }
    table.style.visibility = "";

    status.style.visibility = "hidden";

    const downloadButton = document.getElementById("downloadB");
    downloadButton.style.visibility = "";
}

function download() {
    csv_data = table2csv();
    const CSVFile = new Blob([csv_data], { type: "text/csv" });
    const temp_link = document.createElement("a");
    temp_link.download = `lacon-results-${new Date().getTime()}.csv`;
    temp_link.href = window.URL.createObjectURL(CSVFile);
    temp_link.style.display = "none";

    document.body.appendChild(temp_link);
    temp_link.click();
    document.body.removeChild(temp_link);
}

function table2csv() {
    var csv_data = [];
    var rows = document.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        var cols = rows[i].querySelectorAll("td,th");
        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
            if (i > 0 && j == 1) {
                csvrow.push(label2class[cols[j].innerHTML]);
            } else {
                csvrow.push(cols[j].innerHTML);
            }
        }
        csv_data.push(csvrow.join(","));
    }
    return csv_data.join("\n");
}