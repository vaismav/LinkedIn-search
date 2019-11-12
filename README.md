# Linkedin search Extension

Hey guys, so I've created this chrome extension to help maintain a search on regular assest in big numbers.

The extension will cross to sources of inputs, lets say you are looking for me (Avishai Vaisman)
in "company-1" and "company-2", the extension will search for [me + company-1] and [me + compeny-2].
In order to not crush your computer with tons of tabs the extension will keep only 5 tabs running and as you close 1 tab, the next search will open in new tab.

Search result which appeard in the past and did not change since than will automatically be closed.


## Getting Started

In order to use the extension you will have to use a Chrome browser.

1)  Download the files to an empty folder.
2)  Open the Chrome browser and enter the Extension page(optionly type [chrome://extensions/](chrome://extensions/)).
3)  In the Extension page enable the "Developer mode".
4)  Choose the "Load Unpacked" and choose the folder with the files you've downloaded.

### Using the Extension

Put the names in the assets(names) field and the values you wish to cross with in the "assets to cross with" (compeny) field (easy, right?).

Keep the different assest separated by comma. 
EX: assets: _Jack Dean,Ben Jhon,Luis Kapu_ compeny: _this,that,those crop_

Click the search button to start the searching proccess.

If you want the extension to open search reasult which checked before and are closing automaticlly
click on "clear storage", this action will clear all data on past search and will open all new 
search results.

I know its not ideal but i will add a function to clear data of specific searchs closed in the currnet
session as soon as I will be avilable to it.

## Built With

* [Chrome Extension](https://developer.chrome.com/extensions) - The chrome API 


## Authors

* **Avishai Vaisman**  - [LinkedIn](https://www.linkedin.com/in/avishai-vaisman/)

