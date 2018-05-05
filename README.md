# Link Checker

## TODO
- Add count of files with noindex and number of checked embedded youtube videos

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
- remove style attributes and create custom CSS file

## Changelog

### 1.10.0
- Compression of results before they get stored in browser cache.
- New 'Mark as fixed on all pages' button.

### 1.9.1
- Bugfix: Reset result when new check is started.

### 1.9.0
- Redesigned user interface.
	- Pagination.
	- All-in-one (links, images, videos, working redirects, unhandled resources) result view.
- Performance of user interface was improved so that it's now possible to view result tables with more than 100'000 broken links or redirects.
- Use IndexedDB instead of localStorage to store result so that the result set size is not limited to about 5 MB anymore.

### 1.8.0
- Auto-resume support if the Link Checker gets opened and a check is already running on the server.
- Implemented a warning for high crawl-delays.
- Added a stop button to stop the current check.
- Implemented protection for check hijacking if token is used.

### 1.7.1
- Fixed redirect stats.

### 1.7.0
- Highlighting of redirects.
- Added option to show working redirects.
	- Has to be enabled in the settings.

### 1.6.0
- Results are saved now and don't get discarded when leaving the Link Checker anymore.
- Improved navigation with tabs.
- More detailed stats.
- Crawler
	- Added status code 603 (Unknown authority error) with explanation.
	- Added cookie support.

### 1.5.0
- Added support for broken embedded YouTube videos.
- Remove all whitespace (line breaks, spaces, tabs) from token. This prevents Copy and Paste issues.
- Improvement notification message for daily checks.
- Crawler performance improvements.

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
