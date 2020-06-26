class Stats:
    def __init__(self, dataset):
        count = self.getClassCounts(dataset.unique_words)
        self.posSentences = dataset.posSentences;
        self.negSentences = dataset.negSentences;
        self.posCount = count[0]
        self.negCount = count[1]
        self.stats = self.getProbabilities(dataset.unique_words, self.posSentences, self.negSentences)
        self.ratings=self.getRatings()

    def getClassCounts(self, unique):
        pos = neg = 0
        for key in unique.keys():
            pos += unique[key]["Pos"]
            neg += unique[key]["Neg"]
        return pos, neg

    def getProbabilities(self, unique_words, posCount, negCount):
        for key in unique_words.keys():
            unique_words[key]["PosProb"] = float((unique_words[key]["Pos"] + 1) / (posCount + len(unique_words)))
            unique_words[key]["NegProb"] = float((unique_words[key]["Neg"] + 1) / (negCount + len(unique_words)))
        return unique_words

    def getDefaultProbability(self, typ):
        if typ == "Pos":
            return float(1 / (self.posCount + len(self.stats)))
        elif typ == "Neg":
            return float(1 / (self.negCount + len(self.stats)))
        return 1

    def getRatings(self):
        pos=float(self.posSentences/(self.posSentences+self.negSentences))
        neg = float(self.negSentences / (self.posSentences + self.negSentences))
        return [round(neg * 100, 2), round(pos * 100, 2)]
