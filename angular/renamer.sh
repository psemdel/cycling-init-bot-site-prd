#!/bin/bash
ng build --configuration "production"

for file in "main"
do
    main=`(find "dist/app/" -name "$file*")`
    cp $main "../bot_requests/static/$file.cycling.js"
done

file="styles"
main=`(find "dist/app/" -name "$file*")`
cp $main "../bot_requests/static/$file.cycling.css"


