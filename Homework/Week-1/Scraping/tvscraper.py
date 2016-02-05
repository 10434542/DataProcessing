#!/usr/bin/env python
# Name: Ruben Timmermans
# Student number: 10434542
# Sources:
# Problem: Unicode error
# Very useful link = http://stackoverflow.com/questions/21129020/how-to-fix-unicodedecodeerror-ascii-codec-cant-decode-byte
# Problem: couldn't find a way to get the right <a.../a> parts in HTML code to start from and extract data
# Useful link: http://www.gregreda.com/2013/03/03/web-scraping-101-with-python/
# Problem: split list in string
# Useful link: https://docs.python.org/2/library/string.html
'''
This script scrapes IMDB and outputs a CSV file with highest ranking tv series.
'''
# IF YOU WANT TO TEST YOUR ATTEMPT, RUN THE test-tvscraper.py SCRIPT.
import csv
import sys

from pattern.web import URL, DOM, plaintext
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

# I had an unicode error and managed to fix it with help from stack overflow
reload(sys)  
sys.setdefaultencoding('utf8')


TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest ranking TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Ranking
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    # Counter for keeping track of the ranking
    ranking = 0

    # List to fill with lists containing tv serie information
    csv_out = []

    # Search for elements that begin with td and then followed by title
    for SERIES in dom.by_tag('td.title'):

        # Get the first <a..../a> element
        tvtitle = SERIES.by_tag('a')[0].content

        # Increase ranking
        ranking += 1

        # Search first <span ... genre ... /span> then all <a..../a> elements
        genre = SERIES.by_tag('span.genre')[0].by_tag('a')

        # found easy way to write store data in a list using for loop within the list here:
        # http://mlwhiz.com/blog/2014/10/02/data_science_101_python_pattern/
        genre2 = ", ".join([i.content for i in genre])

        # Search first <span ... credit ... /span> then all <a..../a> elements
        all_actors = SERIES.by_tag('span.credit')[0].by_tag('a')

        # Store content from a in list all actors
        all_actors2 = ", ".join([j.content for j in all_actors])

        # Search for runtime value (content)
        runtime_series = SERIES.by_tag('span.runtime')[0].content

        # Store all data in csv_form runtime_series[:-6] to get rid of the "mins."
        csv_form = [tvtitle, str(ranking), genre2, all_actors2 ,runtime_series[:-6]]

        # Append each csv_form in a list, hence creating a list of lists
        csv_out.append(csv_form)

    # Return properly
    # print csv_out
    return csv_out 



def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest ranking TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Ranking', 'Genre', 'Actors', 'Runtime'])

    # Loop over data extracted via extract_tvseries and change in csv format
    for i in tvseries:
        writer.writerow(i)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in testing / grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)