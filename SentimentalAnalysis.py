from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import requests
import Database as db
import Stats


class SentimentalAnalysis:
    def getNaiveBayesResult(self, msg, sts):
        pp_np = self.getConditionalProbability(msg, sts)
        return self.getResult(pp_np, (pp_np[0] + pp_np[1]) / 2)

    def getBayesianBayesResult(self, msg, sts):
        pp_np = self.getConditionalProbability(msg, sts)
        pp_np[0] *= (sts.posSentences / (sts.posSentences + sts.negSentences))
        pp_np[1] *= (sts.negSentences / (sts.posSentences + sts.negSentences))
        pp_np[0] = pp_np[0] / (pp_np[0] + pp_np[1])
        pp_np[1] = pp_np[1] / (pp_np[0] + pp_np[1])
        return self.getResult(pp_np, (pp_np[0] + pp_np[1]) / 2)

    def getLexiconPredictorResult(self, msg, sts):
        pp_np = self.getConditionalProbability(msg, sts)
        pp_np[0] *= (sts.posCount / (sts.posCount + sts.negCount))
        pp_np[1] *= (sts.negCount / (sts.posCount + sts.negCount))
        return self.getResult(pp_np, (pp_np[0] + pp_np[1]) / 2)

    def getVaderResult(self, msg):
        analyser = SentimentIntensityAnalyzer()
        sentiment = analyser.polarity_scores(msg)
        return self.getResult([sentiment['pos'], sentiment['neg']], sentiment['neu'])

    def isExactString(self, dict, st):
        for i in dict.keys():
            if i == st:
                return True
        return False

    def updateStats(self, sts):
        sts = Stats.Stats(dataset)

    def getConditionalProbability(self, msg, sts):
        np = pp = 1
        for m in msg.split(' '):
            m = m.lower()
            if not self.isExactString(sts.stats, m):
                pp *= sts.getDefaultProbability("Pos")
                np *= sts.getDefaultProbability("Neg")
            elif self.isExactString(sts.stats, m):
                np *= sts.stats[m]["NegProb"]
                pp *= sts.stats[m]["PosProb"]
        return [pp, np]

    def getResult(self, pp_np, neu):
        if pp_np[0] > pp_np[1]:
            return "Positive", '{:.2e}'.format(pp_np[0])
        elif pp_np[0] < pp_np[1]:
            return "Negative", '{:.2e}'.format(pp_np[1])
        return "Neutral", neu

    def getAbbreviatedResult(self, result):
        if result[0]=="Positive":
            return "Pos"
        elif result[0]=="Negative":
            return "Neg"
        elif result[0]=="Neutral":
            return "Neu"


dataset = db.Database()
sts = Stats.Stats(dataset)
sa = SentimentalAnalysis()
