let session;

async function loadModel() {
  console.log("loading model")
  const modelPath = 'model.onnx';
  session = new onnx.InferenceSession();
  console.log("session done")
  await session.loadModel(modelPath);
  console.log("loaded")
}

async function runInference() {
  const text = document.getElementById('textbox').value;
  if (!session) {
    await loadModel();
  }

  const inputTensor = new onnx.Tensor([text], 'string', [1]);

  const outputMap = await session.run([inputTensor]);
  const outputTensor = outputMap.values().next().value;
  const outputData = outputTensor.data;

  console.log('Output:', outputData);
}