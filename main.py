from sklearn.feature_extraction.text import CountVectorizer
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC

from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import StringTensorType

corpus = [
'This is the first document.',
'This document is the second document.',
'And this is the third one.',
'Is this the first document?',
]

pipeline = Pipeline([
    ('tansform', CountVectorizer()),
    ('class', SVC()),
])

pipeline.fit(corpus, [0, 1, 0, 1])

initial_type = [('text_input', StringTensorType())]
onx = convert_sklearn(pipeline, initial_types=initial_type)

with open("model.onnx", "wb") as f:
    f.write(onx.SerializeToString())