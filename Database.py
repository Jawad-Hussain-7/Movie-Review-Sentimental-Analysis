import csv
import string
from nltk.corpus import stopwords


class Database:
    def __init__(self):
        self.posSentences = 0;
        self.negSentences = 0;
        self.data = self.getRecords()
        self.unique_words = self.getUniqueWords(self.data)

    def getRecords(self):
        data = []
        i=0;
        with open("movie-pang02.csv", 'r') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                data.append(row)
                if row[0] == "Pos":
                    self.posSentences = self.posSentences + 1
                elif row[0] == "Neg":
                    self.negSentences = self.negSentences + 1
        data.pop(0)
        return data

    def getUniqueWords(self, sentences):
        en_stops = set(stopwords.words('english'))
        unique = {}
        for i in range(len(sentences)):
            words = sentences[i][1].split()
            for word in words:
                word = word.lower()
                if word in en_stops or word in string.punctuation:
                    continue
                if word not in unique:
                    unique[word] = {"Pos": 0, "Neg": 0}
                if word in unique.keys() and sentences[i][0] == "Pos":
                    unique[word]["Pos"] += 1
                if word in unique.keys() and sentences[i][0] == "Neg":
                    unique[word]["Neg"] += 1
        return unique

    def isPresent(self, word):
        for i in self.unique_words.keys():
            if i == word:
                return True

    def addRecord(self, row):
        self.data.append(row)
        with open("movie-pang02.csv", 'a', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(row)
        self.unique_words = self.getUniqueWords(self.data)
