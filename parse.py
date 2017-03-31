import csv

def parseDataIntoList():
    filteredList = []
    # need to keep col 3,4,7,8,9,10,11,12,13,16,17,18,19,22,23,24,25
    with open('data.csv', 'rb') as csvfile:
        f = csv.reader((line.replace('\0','') for line in csvfile), delimiter="\t")
        header_row = next(f)
        for line in f:
            lineDict = {header_row[3]: line[3], 
                        header_row[4]: line[4],
                        header_row[7]: line[7],
                        header_row[8]: line[8],
                        header_row[9]: line[9],
                        header_row[10]: line[10],
                        header_row[11]: line[11],
                        header_row[12]: line[12],
                        header_row[13]: line[13],
                        header_row[16]: line[16],
                        header_row[17]: line[17],
                        header_row[18]: line[18],
                        header_row[18]: line[18],
                        header_row[18]: line[18],
                        header_row[19]: line[19],
                        header_row[22]: line[22],
                        header_row[23]: line[23],
                        header_row[24]: line[24],
                        header_row[25]: line[25]}
            # filter out any rows that have fewer than 5 submissions and don't have question code IUMI06
            if int(lineDict['Submissions']) > 5 and (lineDict['Question Code'] == 'IUMI06' or lineDict['Question Code'] == 'IUMI06-5'):
                filteredList.append(lineDict)
        return filteredList

def checkNumberOfUniqueProfs(filteredList):
    listOfInstructors = []
    for obj in filteredList:
        listOfInstructors.append(obj['Instructor'])
    setOfInstructors = set(listOfInstructors)
    print setOfInstructors

def main():
    filteredList = parseDataIntoList()
    checkNumberOfUniqueProfs(filteredList)
    






if __name__ == "__main__":
    main()