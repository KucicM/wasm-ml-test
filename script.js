async function runInference() {
    const text = document.getElementById('textbox').value;
    const modelPath = 'model.onnx';
    let session = new ort.InferenceSession();
    await session.loadModel(modelPath);

    const inputTensor = new ort.Tensor([text], 'string', [1]);

    const outputMap = await session.run([inputTensor]);
    const outputTensor = outputMap.values().next().value;
    const outputData = outputTensor.data;

    console.log('Output:', outputData);
}