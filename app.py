import SentimentalAnalysis
import math
from flask import Flask, render_template, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET', "POST"])
def initMovie():
    data = SentimentalAnalysis.dataset.data.copy()
    return render_template("movie.html", data=data, stats=SentimentalAnalysis.sts.ratings)


@app.route('/addreview', methods=['GET', "POST"])
def addReview():
    if request.method == 'POST':
        result = SentimentalAnalysis.sa.getVaderResult(request.form['review'])
        rev = [SentimentalAnalysis.sa.getAbbreviatedResult(result), request.form['review']]
        SentimentalAnalysis.dataset.addRecord(rev)
        SentimentalAnalysis.sa.updateStats(SentimentalAnalysis.sts)
        return request.form['review']


@app.route('/computesentiment', methods=["GET", "POST"])
def computeSentiment():
    if request.method == 'POST':
        rev = request.form['review']
        results = {"review": rev,
                   "Naive Bayes": SentimentalAnalysis.sa.getNaiveBayesResult(rev, SentimentalAnalysis.sts),
                   "Baysian Predictor": SentimentalAnalysis.sa.getNaiveBayesResult(rev, SentimentalAnalysis.sts),
                   "Lexicon Predictor": SentimentalAnalysis.sa.getLexiconPredictorResult(rev, SentimentalAnalysis.sts),
                   "VADER Predictor": SentimentalAnalysis.sa.getVaderResult(rev)}
        jsonObj = json.dumps(results)
        return jsonObj


@app.route('/setstats', methods=["GET", "POST"])
def setStats():
    if request.method == 'POST':
        jsonObj = {"ratings": SentimentalAnalysis.sts.getRatings()}
        return json.dumps(jsonObj)


if __name__ == "__main__":
    app.run(debug=True)
