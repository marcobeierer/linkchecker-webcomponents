# Link Checker

## Next steps
- Test images

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

## TODO
- update links
	- create own link checker pro site for standalone
	- currently only purchase

- show date when check was finished 
	- indicates if the user has fetched an old result

- remove style attributes and create custom CSS file


## Libraries
- [lscache](https://github.com/pamelafox/lscache) by Pamela Fox
