import csv

def parseData():
    filteredList = []
    # need to keep col 3,4,7,8,9,10,11,12,13,16,17,18,19,22,23,24,25
    with open('data.csv', 'rb') as csvfile:
        f = csv.reader((line.replace('\0','') for line in csvfile), delimiter="\t")
        for row in f:
            print row[3]
            print row[4]
            print row[7]
            print row[8]
            print row[9]
            print row[10]
            print row[11]
            print row[12]
            print row[13]
            print row[17]
            print row[18]
            print row[19]
            print row[22]
            print row[23]
            print row[24]
            print row[25]
            break
            
def main():
    parseData()
 






if __name__ == "__main__":
    main()