# PDF storage

To avoid the inclusion the pdf files in the bundle and to avoid the need to host this on an S3 bucket, we opted to reference the url of the raw pdf stored on this repo. This introduces some risk however, if the files are moved from this location, the urls will need to be updated as well.

We are liking to the master branch url so if you decide to move these files, it will only break once your changes are merged into master.
