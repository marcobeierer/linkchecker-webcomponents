# Link Checker

## ToTest
- retries on no response error

## Next steps
- Test images
- IE testen
- Test Scheduler

## Important Notes
It is necessary to hold all the data in object trees and prevent the use of arrays because arrays are passed down the datatable tree by value and this makes updates very slow. Objects are passed by reference and the updates are very smooth.

## Elements
- linkchecker-form
- linkchecker-scheduler
	- website-url
	- token
	- email
- linkchecker
	- website-url (note: translated to opts.websiteUrl)
	- token
- resulttable
- raw

## TODO
- update links
	- create own link checker pro site for standalone
	- currently only purchase
- show date when check was finished 
	- indicates if the user has fetched an old result
- remove style attributes and create custom CSS file
- impl auto resume
- impl cancel option

## Changelog

### 1.4.0
- Implemented three retries if request could not be sent or no response was received.
- Explain changed status codes (598 is now 601 and 599 is 602).
- Added unhandled resources and images.
- Crawler
	- Implemented better blocked by robots detection and handling (for external links).

### 1.3.3
- 1.3.2 release did not contain new build.

### 1.3.2
- Fixed max fetchers if started from form.
- Added origin system parameter.
- Added info box to scheduler and hide register form if no token is present
- Hide broken images string and show info that not available.

### 1.3.1
- Just add riot.js without compiler to release file.

### 1.3.0
- Update riot version
- Fixed broken links could be removed from the results table with the _Mark as fixed_ button. 
- Added section for links blocked by robots.txt and a _Mark as working_ button to mark them as working after a manual check.
- Added common status code information.
- Broken links in the result table are linked know for the case that someone likes to verify that a link is really broken.

## Libraries
- [lscache](https://github.com/pamelafox/lscache)
- [Riot.js](http://riotjs.com/)
- jQuery
- jquery.serialize-object
